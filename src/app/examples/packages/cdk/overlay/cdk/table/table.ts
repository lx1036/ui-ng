/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {
  AfterContentChecked,
  Attribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  Directive,
  ElementRef,
  EmbeddedViewRef,
  Input,
  isDevMode,
  IterableChangeRecord,
  IterableDiffer,
  IterableDiffers,
  OnInit,
  QueryList,
  TrackByFunction,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {CdkCellOutlet, CdkCellOutletRowContext, CdkHeaderRowDef, CdkRowDef} from './row';
import {takeUntil} from 'rxjs/operators/takeUntil';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Subscription} from 'rxjs/Subscription';
import {Subject} from 'rxjs/Subject';
import {CdkCellDef, CdkColumnDef, CdkHeaderCellDef} from './cell';
import {
  getTableDuplicateColumnNameError,
  getTableMissingMatchingRowDefError,
  getTableMissingRowDefsError,
  getTableMultipleDefaultRowDefsError,
  getTableUnknownColumnError,
  getTableUnknownDataSourceError
} from './table-errors';
import {Observable} from 'rxjs/Observable';
import {of as observableOf} from 'rxjs/observable/of';

/**
 * Provides a handle for the table to grab the view container's ng-container to insert data rows.
 * @docs-private
 */
@Directive({selector: '[rowPlaceholder]'})
export class RowPlaceholder {
  constructor(public viewContainer: ViewContainerRef) { }
}

/**
 * Provides a handle for the table to grab the view container's ng-container to insert the header.
 * @docs-private
 */
@Directive({selector: '[headerRowPlaceholder]'})
export class HeaderRowPlaceholder {
  constructor(public viewContainer: ViewContainerRef) { }
}

/**
 * The table template that can be used by the mat-table. Should not be used outside of the
 * material library.
 */
export const CDK_TABLE_TEMPLATE = `
  <ng-container headerRowPlaceholder></ng-container>
  <ng-container rowPlaceholder></ng-container>`;

/**
 * Class used to conveniently type the embedded view ref for rows with a context.
 * @docs-private
 */
abstract class RowViewRef<T> extends EmbeddedViewRef<CdkCellOutletRowContext<T>> { }

/**
 * A data table that renders a header row and data rows. Uses the dataSource input to determine
 * the data to be rendered. The data can be provided either as a data array, an Observable stream
 * that emits the data array to render, or a DataSource with a connect function that will
 * return an Observable stream that emits the data array to render.
 */
@Component({
  moduleId: module.id,
  selector: 'cdk-table',
  exportAs: 'cdkTable',
  template: CDK_TABLE_TEMPLATE,
  host: {
    'class': 'cdk-table',
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CdkTable<T> implements CollectionViewer, OnInit, AfterContentChecked {
  /** Subject that emits when the component has been destroyed. */
  private _onDestroy = new Subject<void>();

  /** Latest data provided by the data source. */
  private _data: T[];

  /** Subscription that listens for the data provided by the data source. */
  private _renderChangeSubscription: Subscription | null;

  /**
   * Map of all the user's defined columns (header and data cell template) identified by name.
   * Collection populated by the column definitions gathered by `ContentChildren` as well as any
   * custom column definitions added to `_customColumnDefs`.
   */
  private _columnDefsByName = new Map<string,  CdkColumnDef>();

  /**
   * Set of all row defitions that can be used by this table. Populated by the rows gathered by
   * using `ContentChildren` as well as any custom row definitions added to `_customRowDefs`.
   */
  private _rowDefs: CdkRowDef<T>[];

  /** Differ used to find the changes in the data provided by the data source. */
  private _dataDiffer: IterableDiffer<T>;

  /** Stores the row definition that does not have a when predicate. */
  private _defaultRowDef: CdkRowDef<T> | null;

  /** Column definitions that were defined outside of the direct content children of the table. */
  private _customColumnDefs = new Set<CdkColumnDef>();

  /** Row definitions that were defined outside of the direct content children of the table. */
  private _customRowDefs = new Set<CdkRowDef<T>>();

  /**
   * Whether the header row definition has been changed. Triggers an update to the header row after
   * content is checked.
   */
  private _headerRowDefChanged = false;

  /**
   * Tracking function that will be used to check the differences in data changes. Used similarly
   * to `ngFor` `trackBy` function. Optimize row operations by identifying a row based on its data
   * relative to the function to know if a row should be added/removed/moved.
   * Accepts a function that takes two parameters, `index` and `item`.
   */
  @Input()
  get trackBy(): TrackByFunction<T> { return this._trackByFn; }
  set trackBy(fn: TrackByFunction<T>) {
    if (isDevMode() &&
        fn != null && typeof fn !== 'function' &&
        <any>console && <any>console.warn) {
        console.warn(`trackBy must be a function, but received ${JSON.stringify(fn)}.`);
    }
    this._trackByFn = fn;
  }
  private _trackByFn: TrackByFunction<T>;

  /**
   * The table's source of data, which can be provided in three ways (in order of complexity):
   *   - Simple data array (each object represents one table row)
   *   - Stream that emits a data array each time the array changes
   *   - `DataSource` object that implements the connect/disconnect interface.
   *
   * If a data array is provided, the table must be notified when the array's objects are
   * added, removed, or moved. This can be done by calling the `renderRows()` function which will
   * render the diff since the last table render. If the data array reference is changed, the table
   * will automatically trigger an update to the rows.
   *
   * When providing an Observable stream, the table will trigger an update automatically when the
   * stream emits a new array of data.
   *
   * Finally, when providing a `DataSource` object, the table will use the Observable stream
   * provided by the connect function and trigger updates when that stream emits new data array
   * values. During the table's ngOnDestroy or when the data source is removed from the table, the
   * table will call the DataSource's `disconnect` function (may be useful for cleaning up any
   * subscriptions registered during the connect process).
   */
  @Input()
  get dataSource(): DataSource<T> | Observable<T[]> | T[] { return this._dataSource; }
  set dataSource(dataSource: DataSource<T> | Observable<T[]> | T[]) {
    if (this._dataSource !== dataSource) {
      this._switchDataSource(dataSource);
    }
  }
  private _dataSource: DataSource<T> | Observable<T[]> | T[] | T[];

  // TODO(andrewseguin): Remove max value as the end index
  //   and instead calculate the view on init and scroll.
  /**
   * Stream containing the latest information on what rows are being displayed on screen.
   * Can be used by the data source to as a heuristic of what data should be provided.
   */
  viewChange: BehaviorSubject<{start: number, end: number}> =
      new BehaviorSubject<{start: number, end: number}>({start: 0, end: Number.MAX_VALUE});

  // Placeholders within the table's template where the header and data rows will be inserted.
  @ViewChild(RowPlaceholder) _rowPlaceholder: RowPlaceholder;
  @ViewChild(HeaderRowPlaceholder) _headerRowPlaceholder: HeaderRowPlaceholder;

  /**
   * The column definitions provided by the user that contain what the header and cells should
   * render for each column.
   */
  @ContentChildren(CdkColumnDef) _contentColumnDefs: QueryList<CdkColumnDef>;

  /** Set of template definitions that used as the data row containers. */
  @ContentChildren(CdkRowDef) _contentRowDefs: QueryList<CdkRowDef<T>>;

  /**
   * Template definition used as the header container. By default it stores the header row
   * definition found as a direct content child. Override this value through `setHeaderRowDef` if
   * the header row definition should be changed or was not defined as a part of the table's
   * content.
   */
  @ContentChild(CdkHeaderRowDef) _headerRowDef: CdkHeaderRowDef;

  constructor(private readonly _differs: IterableDiffers,
              private readonly _changeDetectorRef: ChangeDetectorRef,
              elementRef: ElementRef,
              @Attribute('role') role: string) {
    if (!role) {
      elementRef.nativeElement.setAttribute('role', 'grid');
    }
  }

  ngOnInit() {
    // TODO(andrewseguin): Setup a listener for scrolling, emit the calculated view to viewChange
    this._dataDiffer = this._differs.find([]).create(this._trackByFn);

    // If the table has a header row definition defined as part of its content, flag this as a
    // header row def change so that the content check will render the header row.
    if (this._headerRowDef) {
      this._headerRowDefChanged = true;
    }
  }

  ngAfterContentChecked() {
    // Cache the row and column definitions gathered by ContentChildren and programmatic injection.
    this._cacheRowDefs();
    this._cacheColumnDefs();

    // Make sure that the user has at least added a header row or row def.
    if (!this._headerRowDef && !this._rowDefs.length) {
      throw getTableMissingRowDefsError();
    }

    // Render updates if the list of columns have been changed for the header or row definitions.
    this._renderUpdatedColumns();

    // If the header row definition has been changed, trigger a render to the header row.
    if (this._headerRowDefChanged) {
      this._renderHeaderRow();
      this._headerRowDefChanged = false;
    }

    // If there is a data source and row definitions, connect to the data source unless a
    // connection has already been made.
    if (this.dataSource && this._rowDefs.length > 0 && !this._renderChangeSubscription) {
      this._observeRenderChanges();
    }
  }

  ngOnDestroy() {
    this._rowPlaceholder.viewContainer.clear();
    this._headerRowPlaceholder.viewContainer.clear();
    this._onDestroy.next();
    this._onDestroy.complete();

    if (this.dataSource instanceof DataSource) {
      this.dataSource.disconnect(this);
    }
  }

  /**
   * Renders rows based on the table's latest set of data, which was either provided directly as an
   * input or retrieved through an Observable stream (directly or from a DataSource).
   * Checks for differences in the data since the last diff to perform only the necessary
   * changes (add/remove/move rows).
   *
   * If the table's data source is a DataSource or Observable, this will be invoked automatically
   * each time the provided Observable stream emits a new data array. Otherwise if your data is
   * an array, this function will need to be called to render any changes.
   */
  renderRows() {
    const changes = this._dataDiffer.diff(this._data);
    if (!changes) { return; }

    const viewContainer = this._rowPlaceholder.viewContainer;
    changes.forEachOperation(
        (record: IterableChangeRecord<T>, adjustedPreviousIndex: number, currentIndex: number) => {
          if (record.previousIndex == null) {
            this._insertRow(record.item, currentIndex);
          } else if (currentIndex == null) {
            viewContainer.remove(adjustedPreviousIndex);
          } else {
            const view = <RowViewRef<T>>viewContainer.get(adjustedPreviousIndex);
            viewContainer.move(view!, currentIndex);
          }
        });

    // Update the meta context of a row's context data (index, count, first, last, ...)
    this._updateRowIndexContext();

    // Update rows that did not get added/removed/moved but may have had their identity changed,
    // e.g. if trackBy matched data on some property but the actual data reference changed.
    changes.forEachIdentityChange((record: IterableChangeRecord<T>) => {
      const rowView = <RowViewRef<T>>viewContainer.get(record.currentIndex!);
      rowView.context.$implicit = record.item;
    });
  }

  /**
   * Sets the header row definition to be used. Overrides the header row definition gathered by
   * using `ContentChild`, if one exists. Sets a flag that will re-render the header row after the
   * table's content is checked.
   */
  setHeaderRowDef(headerRowDef: CdkHeaderRowDef) {
    this._headerRowDef = headerRowDef;
    this._headerRowDefChanged = true;
  }

  /** Adds a column definition that was not included as part of the direct content children. */
  addColumnDef(columnDef: CdkColumnDef) {
    this._customColumnDefs.add(columnDef);
  }

  /** Removes a column definition that was not included as part of the direct content children. */
  removeColumnDef(columnDef: CdkColumnDef) {
    this._customColumnDefs.delete(columnDef);
  }

  /** Adds a row definition that was not included as part of the direct content children. */
  addRowDef(rowDef: CdkRowDef<T>) {
    this._customRowDefs.add(rowDef);
  }

  /** Removes a row definition that was not included as part of the direct content children. */
  removeRowDef(rowDef: CdkRowDef<T>) {
    this._customRowDefs.delete(rowDef);
  }

  /** Update the map containing the content's column definitions. */
  private _cacheColumnDefs() {
    this._columnDefsByName.clear();

    const columnDefs = this._contentColumnDefs ? this._contentColumnDefs.toArray() : [];
    this._customColumnDefs.forEach(columnDef => columnDefs.push(columnDef));

    columnDefs.forEach(columnDef => {
      if (this._columnDefsByName.has(columnDef.name)) {
        throw getTableDuplicateColumnNameError(columnDef.name);
      }
      this._columnDefsByName.set(columnDef.name, columnDef);
    });
  }

  /** Update the list of all available row definitions that can be used. */
  private _cacheRowDefs() {
    this._rowDefs = this._contentRowDefs ? this._contentRowDefs.toArray() : [];
    this._customRowDefs.forEach(rowDef => this._rowDefs.push(rowDef));

    const defaultRowDefs = this._rowDefs.filter(def => !def.when);
    if (defaultRowDefs.length > 1) { throw getTableMultipleDefaultRowDefsError(); }
    this._defaultRowDef = defaultRowDefs[0];
  }

  /**
   * Check if the header or rows have changed what columns they want to display. If there is a diff,
   * then re-render that section.
   */
  private _renderUpdatedColumns() {
    // Re-render the rows when the row definition columns change.
    this._rowDefs.forEach(def => {
      if (!!def.getColumnsDiff()) {
        // Reset the data to an empty array so that renderRowChanges will re-render all new rows.
        this._dataDiffer.diff([]);

        this._rowPlaceholder.viewContainer.clear();
        this.renderRows();
      }
    });

    // Re-render the header row if there is a difference in its columns.
    if (this._headerRowDef && this._headerRowDef.getColumnsDiff()) {
      this._renderHeaderRow();
    }
  }

  /**
   * Switch to the provided data source by resetting the data and unsubscribing from the current
   * render change subscription if one exists. If the data source is null, interpret this by
   * clearing the row placeholder. Otherwise start listening for new data.
   */
  private _switchDataSource(dataSource: DataSource<T> | Observable<T[]> | T[]) {
    this._data = [];

    if (this.dataSource instanceof DataSource) {
      this.dataSource.disconnect(this);
    }

    // Stop listening for data from the previous data source.
    if (this._renderChangeSubscription) {
      this._renderChangeSubscription.unsubscribe();
      this._renderChangeSubscription = null;
    }

    if (!dataSource) {
      if (this._dataDiffer) {
        this._dataDiffer.diff([]);
      }
      this._rowPlaceholder.viewContainer.clear();
    }

    this._dataSource = dataSource;
  }

  /** Set up a subscription for the data provided by the data source. */
  private _observeRenderChanges() {
    // If no data source has been set, there is nothing to observe for changes.
    if (!this.dataSource) { return; }

    let dataStream: Observable<T[]> | undefined;

    // Check if the datasource is a DataSource object by observing if it has a connect function.
    // Cannot check this.dataSource['connect'] due to potential property renaming, nor can it
    // checked as an instanceof DataSource<T> since the table should allow for data sources
    // that did not explicitly extend DataSource<T>.
    if ((this.dataSource as DataSource<T>).connect  instanceof Function) {
      dataStream = (this.dataSource as DataSource<T>).connect(this);
    } else if (this.dataSource instanceof Observable) {
      dataStream = this.dataSource;
    } else if (Array.isArray(this.dataSource)) {
      dataStream = observableOf(this.dataSource);
    }

    if (dataStream === undefined) {
      throw getTableUnknownDataSourceError();
    }

    this._renderChangeSubscription = dataStream
        .pipe(takeUntil(this._onDestroy))
        .subscribe(data => {
          this._data = data;
          this.renderRows();
        });
  }

  /**
   * Clears any existing content in the header row placeholder and creates a new embedded view
   * in the placeholder using the header row definition.
   */
  private _renderHeaderRow() {
    // Clear the header row placeholder if any content exists.
    if (this._headerRowPlaceholder.viewContainer.length > 0) {
      this._headerRowPlaceholder.viewContainer.clear();
    }

    const cells = this._getHeaderCellTemplatesForRow(this._headerRowDef);
    if (!cells.length) { return; }

    // TODO(andrewseguin): add some code to enforce that exactly
    //   one CdkCellOutlet was instantiated as a result
    //   of `createEmbeddedView`.
    this._headerRowPlaceholder.viewContainer
        .createEmbeddedView(this._headerRowDef.template, {cells});

    cells.forEach(cell => {
      if (CdkCellOutlet.mostRecentCellOutlet) {
        CdkCellOutlet.mostRecentCellOutlet._viewContainer.createEmbeddedView(cell.template, {});
      }
    });

    this._changeDetectorRef.markForCheck();
  }

  /**
   * Finds the matching row definition that should be used for this row data. If there is only
   * one row definition, it is returned. Otherwise, find the row definition that has a when
   * predicate that returns true with the data. If none return true, return the default row
   * definition.
   */
  _getRowDef(data: T, i: number): CdkRowDef<T> {
    if (this._rowDefs.length == 1) { return this._rowDefs[0]; }

    let rowDef = this._rowDefs.find(def => def.when && def.when(i, data)) || this._defaultRowDef;
    if (!rowDef) { throw getTableMissingMatchingRowDefError(); }

    return rowDef;
  }

  /**
   * Create the embedded view for the data row template and place it in the correct index location
   * within the data row view container.
   */
  private _insertRow(rowData: T, index: number) {
    const row = this._getRowDef(rowData, index);

    // Row context that will be provided to both the created embedded row view and its cells.
    const context: CdkCellOutletRowContext<T> = {$implicit: rowData};

    // TODO(andrewseguin): add some code to enforce that exactly one
    //   CdkCellOutlet was instantiated as a result  of `createEmbeddedView`.
    this._rowPlaceholder.viewContainer.createEmbeddedView(row.template, context, index);

    this._getCellTemplatesForRow(row).forEach(cell => {
      if (CdkCellOutlet.mostRecentCellOutlet) {
        CdkCellOutlet.mostRecentCellOutlet._viewContainer
            .createEmbeddedView(cell.template, context);
      }
    });

    this._changeDetectorRef.markForCheck();
  }

  /**
   * Updates the index-related context for each row to reflect any changes in the index of the rows,
   * e.g. first/last/even/odd.
   */
  private _updateRowIndexContext() {
    const viewContainer = this._rowPlaceholder.viewContainer;
    for (let index = 0, count = viewContainer.length; index < count; index++) {
      const viewRef = viewContainer.get(index) as RowViewRef<T>;
      viewRef.context.index = index;
      viewRef.context.count = count;
      viewRef.context.first = index === 0;
      viewRef.context.last = index === count - 1;
      viewRef.context.even = index % 2 === 0;
      viewRef.context.odd = !viewRef.context.even;
    }
  }

  /**
   * Returns the cell template definitions to insert into the header
   * as defined by its list of columns to display.
   */
  private _getHeaderCellTemplatesForRow(headerDef: CdkHeaderRowDef): CdkHeaderCellDef[] {
    if (!headerDef || !headerDef.columns) { return []; }
    return headerDef.columns.map(columnId => {
      const column = this._columnDefsByName.get(columnId);

      if (!column) {
        throw getTableUnknownColumnError(columnId);
      }

      return column.headerCell;
    });
  }

  /**
   * Returns the cell template definitions to insert in the provided row
   * as defined by its list of columns to display.
   */
  private _getCellTemplatesForRow(rowDef: CdkRowDef<T>): CdkCellDef[] {
    if (!rowDef.columns) { return []; }
    return rowDef.columns.map(columnId => {
      const column = this._columnDefsByName.get(columnId);

      if (!column) {
        throw getTableUnknownColumnError(columnId);
      }

      return column.cell;
    });
  }
}
