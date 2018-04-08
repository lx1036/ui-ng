/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {Component, ViewChild} from '@angular/core';

import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {combineLatest} from 'rxjs/observable/combineLatest';
import {map} from 'rxjs/operators/map';

import {BaseTreeControl} from './control/base-tree-control';
import {TreeControl} from './control/tree-control';
import {FlatTreeControl} from './control/flat-tree-control';
import {NestedTreeControl} from './control/nested-tree-control';
import {CdkTreeModule} from './index';
import {CdkTree} from './tree';
import {getTreeControlFunctionsMissingError} from './tree-errors';


describe('CdkTree', () => {
  /** Represents an indent for expectNestedTreeToMatch */
  const _ = {};
  let dataSource: FakeDataSource;
  let treeElement: HTMLElement;
  let tree: CdkTree<TestData>;

  function configureCdkTreeTestingModule(declarations) {
    TestBed.configureTestingModule({
      imports: [CdkTreeModule],
      declarations: declarations,
    }).compileComponents();
  }

  describe('flat tree', () => {
    describe('should initialize', () => {
      let fixture: ComponentFixture<SimpleCdkTreeApp>;
      let component: SimpleCdkTreeApp;

      beforeEach(() => {
        configureCdkTreeTestingModule([SimpleCdkTreeApp]);
        fixture = TestBed.createComponent(SimpleCdkTreeApp);

        component = fixture.componentInstance;
        dataSource = component.dataSource as FakeDataSource;
        tree = component.tree;
        treeElement = fixture.nativeElement.querySelector('cdk-tree');

        fixture.detectChanges();
      });

      it('with a connected data source', () => {
        expect(tree.dataSource).toBe(dataSource);
        expect(dataSource.isConnected).toBe(true);
      });

      it('with rendered dataNodes', () => {
        const nodes = getNodes(treeElement);

        expect(nodes).toBeDefined('Expect nodes to be defined');
        expect(nodes[0].classList).toContain('customNodeClass');
      });

      it('with the right accessibility roles', () => {
        expect(treeElement.getAttribute('role')).toBe('tree');

        getNodes(treeElement).forEach(node => {
          expect(node.getAttribute('role')).toBe('treeitem');
        });
      });

      it('with the right data', () => {
        expect(dataSource.data.length).toBe(3);

        let data = dataSource.data;
        expectFlatTreeToMatch(treeElement, 28,
          [`${data[0].pizzaTopping} - ${data[0].pizzaCheese} + ${data[0].pizzaBase}`],
          [`${data[1].pizzaTopping} - ${data[1].pizzaCheese} + ${data[1].pizzaBase}`],
          [`${data[2].pizzaTopping} - ${data[2].pizzaCheese} + ${data[2].pizzaBase}`]);

        dataSource.addData(2);
        fixture.detectChanges();

        data = dataSource.data;
        expect(data.length).toBe(4);
        expectFlatTreeToMatch(treeElement, 28,
          [`${data[0].pizzaTopping} - ${data[0].pizzaCheese} + ${data[0].pizzaBase}`],
          [`${data[1].pizzaTopping} - ${data[1].pizzaCheese} + ${data[1].pizzaBase}`],
          [`${data[2].pizzaTopping} - ${data[2].pizzaCheese} + ${data[2].pizzaBase}`],
          [_, `${data[3].pizzaTopping} - ${data[3].pizzaCheese} + ${data[3].pizzaBase}`]);
      });
    });

    describe('with toggle', () => {
      let fixture: ComponentFixture<CdkTreeAppWithToggle>;
      let component: CdkTreeAppWithToggle;

      beforeEach(() => {
        configureCdkTreeTestingModule([CdkTreeAppWithToggle]);
        fixture = TestBed.createComponent(CdkTreeAppWithToggle);

        component = fixture.componentInstance;
        dataSource = component.dataSource as FakeDataSource;
        tree = component.tree;
        treeElement = fixture.nativeElement.querySelector('cdk-tree');

        fixture.detectChanges();
      });

      it('should expand/collapse the node', () => {
        expect(dataSource.data.length).toBe(3);

        expect(component.treeControl.expansionModel.selected.length)
          .toBe(0, `Expect no expanded node`);

        component.toggleRecursively = false;
        let data = dataSource.data;
        dataSource.addChild(data[2]);
        fixture.detectChanges();

        data = dataSource.data;
        expect(data.length).toBe(4);
        expectFlatTreeToMatch(treeElement, 40,
          [`${data[0].pizzaTopping} - ${data[0].pizzaCheese} + ${data[0].pizzaBase}`],
          [`${data[1].pizzaTopping} - ${data[1].pizzaCheese} + ${data[1].pizzaBase}`],
          [`${data[2].pizzaTopping} - ${data[2].pizzaCheese} + ${data[2].pizzaBase}`],
          [_, `${data[3].pizzaTopping} - ${data[3].pizzaCheese} + ${data[3].pizzaBase}`]);


        (getNodes(treeElement)[2] as HTMLElement).click();
        fixture.detectChanges();

        expect(component.treeControl.expansionModel.selected.length)
          .toBe(1, `Expect node expanded`);
        expect(component.treeControl.expansionModel.selected[0]).toBe(data[2]);

        (getNodes(treeElement)[2] as HTMLElement).click();
        fixture.detectChanges();

        expect(component.treeControl.expansionModel.selected.length)
          .toBe(0, `Expect node collapsed`);
      });

      it('should expand/collapse the node recursively', () => {
        expect(dataSource.data.length).toBe(3);

        expect(component.treeControl.expansionModel.selected.length)
          .toBe(0, `Expect no expanded node`);

        let data = dataSource.data;
        dataSource.addChild(data[2]);
        fixture.detectChanges();

        data = dataSource.data;
        expect(data.length).toBe(4);
        expectFlatTreeToMatch(treeElement, 40,
          [`${data[0].pizzaTopping} - ${data[0].pizzaCheese} + ${data[0].pizzaBase}`],
          [`${data[1].pizzaTopping} - ${data[1].pizzaCheese} + ${data[1].pizzaBase}`],
          [`${data[2].pizzaTopping} - ${data[2].pizzaCheese} + ${data[2].pizzaBase}`],
          [_, `${data[3].pizzaTopping} - ${data[3].pizzaCheese} + ${data[3].pizzaBase}`]);

        (getNodes(treeElement)[2] as HTMLElement).click();
        fixture.detectChanges();

        expect(component.treeControl.expansionModel.selected.length)
          .toBe(2, `Expect nodes expanded`);
        expect(component.treeControl.expansionModel.selected[0])
          .toBe(data[2], `Expect parent node expanded`);
        expect(component.treeControl.expansionModel.selected[1])
          .toBe(data[3], `Expected child node expanded`);

        (getNodes(treeElement)[2] as HTMLElement).click();
        fixture.detectChanges();

        expect(component.treeControl.expansionModel.selected.length)
          .toBe(0, `Expect node collapsed`);
      });
    });

    describe('with when node template', () => {
      let fixture: ComponentFixture<WhenNodeCdkTreeApp>;
      let component: WhenNodeCdkTreeApp;

      beforeEach(() => {
        configureCdkTreeTestingModule([WhenNodeCdkTreeApp]);
        fixture = TestBed.createComponent(WhenNodeCdkTreeApp);

        component = fixture.componentInstance;
        dataSource = component.dataSource as FakeDataSource;
        tree = component.tree;
        treeElement = fixture.nativeElement.querySelector('cdk-tree');

        fixture.detectChanges();
      });

      it('with the right data', () => {
        expect(dataSource.data.length).toBe(3);

        let data = dataSource.data;
        expectFlatTreeToMatch(treeElement, 28,
          [`[topping_1] - [cheese_1] + [base_1]`],
          [`[topping_2] - [cheese_2] + [base_2]`],
          [`[topping_3] - [cheese_3] + [base_3]`]);

        dataSource.addChild(data[1]);
        fixture.detectChanges();

        treeElement = fixture.nativeElement.querySelector('cdk-tree');
        data = dataSource.data;
        expect(data.length).toBe(4);
        expectFlatTreeToMatch(treeElement, 28,
          [`[topping_1] - [cheese_1] + [base_1]`],
          [`[topping_2] - [cheese_2] + [base_2]`],
          [_, `topping_4 - cheese_4 + base_4`],
          [`[topping_3] - [cheese_3] + [base_3]`]);
      });
    });

    describe('with array data source', () => {
      let fixture: ComponentFixture<ArrayDataSourceCdkTreeApp>;
      let component: ArrayDataSourceCdkTreeApp;

      beforeEach(() => {
        configureCdkTreeTestingModule([ArrayDataSourceCdkTreeApp]);
        fixture = TestBed.createComponent(ArrayDataSourceCdkTreeApp);

        component = fixture.componentInstance;
        dataSource = component.dataSource as FakeDataSource;
        tree = component.tree;
        treeElement = fixture.nativeElement.querySelector('cdk-tree');

        fixture.detectChanges();
      });

      it('with the right data', () => {
        expect(dataSource.data.length).toBe(3);

        let data = dataSource.data;
        expectFlatTreeToMatch(treeElement, 28,
          [`[topping_1] - [cheese_1] + [base_1]`],
          [`[topping_2] - [cheese_2] + [base_2]`],
          [`[topping_3] - [cheese_3] + [base_3]`]);

        dataSource.addChild(data[1]);
        fixture.detectChanges();

        treeElement = fixture.nativeElement.querySelector('cdk-tree');
        data = dataSource.data;
        expect(data.length).toBe(4);
        expectFlatTreeToMatch(treeElement, 28,
          [`[topping_1] - [cheese_1] + [base_1]`],
          [`[topping_2] - [cheese_2] + [base_2]`],
          [_, `[topping_4] - [cheese_4] + [base_4]`],
          [`[topping_3] - [cheese_3] + [base_3]`]);
      });
    });

    describe('with observable data source', () => {
      let fixture: ComponentFixture<ObservableDataSourceCdkTreeApp>;
      let component: ObservableDataSourceCdkTreeApp;

      beforeEach(() => {
        configureCdkTreeTestingModule([ObservableDataSourceCdkTreeApp]);
        fixture = TestBed.createComponent(ObservableDataSourceCdkTreeApp);

        component = fixture.componentInstance;
        dataSource = component.dataSource as FakeDataSource;
        tree = component.tree;
        treeElement = fixture.nativeElement.querySelector('cdk-tree');

        fixture.detectChanges();
      });

      it('with the right data', () => {
        expect(dataSource.data.length).toBe(3);

        let data = dataSource.data;
        expectFlatTreeToMatch(treeElement, 28,
          [`[topping_1] - [cheese_1] + [base_1]`],
          [`[topping_2] - [cheese_2] + [base_2]`],
          [`[topping_3] - [cheese_3] + [base_3]`]);

        dataSource.addChild(data[1]);
        fixture.detectChanges();

        treeElement = fixture.nativeElement.querySelector('cdk-tree');
        data = dataSource.data;
        expect(data.length).toBe(4);
        expectFlatTreeToMatch(treeElement, 28,
          [`[topping_1] - [cheese_1] + [base_1]`],
          [`[topping_2] - [cheese_2] + [base_2]`],
          [_, `[topping_4] - [cheese_4] + [base_4]`],
          [`[topping_3] - [cheese_3] + [base_3]`]);
      });
    });
  });

  describe('nested tree', () => {
    describe('should initialize', () => {
      let fixture: ComponentFixture<NestedCdkTreeApp>;
      let component: NestedCdkTreeApp;

      beforeEach(() => {
        configureCdkTreeTestingModule([NestedCdkTreeApp]);
        fixture = TestBed.createComponent(NestedCdkTreeApp);

        component = fixture.componentInstance;
        dataSource = component.dataSource as FakeDataSource;
        tree = component.tree;
        treeElement = fixture.nativeElement.querySelector('cdk-tree');

        fixture.detectChanges();
      });

      it('with a connected data source', () => {
        expect(tree.dataSource).toBe(dataSource);
        expect(dataSource.isConnected).toBe(true);
      });

      it('with rendered dataNodes', () => {
        const nodes = getNodes(treeElement);

        expect(nodes).toBeDefined('Expect nodes to be defined');
        expect(nodes[0].classList).toContain('customNodeClass');
      });

      it('with the right accessibility roles', () => {
        expect(treeElement.getAttribute('role')).toBe('tree');

        getNodes(treeElement).forEach(node => {
          expect(node.getAttribute('role')).toBe('treeitem');
        });
      });

      it('with the right data', () => {
        expect(dataSource.data.length).toBe(3);

        let data = dataSource.data;
        expectNestedTreeToMatch(treeElement,
          [`${data[0].pizzaTopping} - ${data[0].pizzaCheese} + ${data[0].pizzaBase}`],
          [`${data[1].pizzaTopping} - ${data[1].pizzaCheese} + ${data[1].pizzaBase}`],
          [`${data[2].pizzaTopping} - ${data[2].pizzaCheese} + ${data[2].pizzaBase}`]);

        dataSource.addChild(data[1], false);
        fixture.detectChanges();

        treeElement = fixture.nativeElement.querySelector('cdk-tree');
        data = dataSource.data;
        expect(data.length).toBe(3);
        expectNestedTreeToMatch(treeElement,
          [`topping_1 - cheese_1 + base_1`],
          [`topping_2 - cheese_2 + base_2`],
          [_, `topping_4 - cheese_4 + base_4`],
          [`topping_3 - cheese_3 + base_3`]);
      });

      it('with nested child data', () => {
        expect(dataSource.data.length).toBe(3);

        let data = dataSource.data;
        const child = dataSource.addChild(data[1], false);
        dataSource.addChild(child, false);
        fixture.detectChanges();

        expect(data.length).toBe(3);
        expectNestedTreeToMatch(treeElement,
            [`topping_1 - cheese_1 + base_1`],
            [`topping_2 - cheese_2 + base_2`],
            [_, `topping_4 - cheese_4 + base_4`],
            [_, _, `topping_5 - cheese_5 + base_5`],
            [`topping_3 - cheese_3 + base_3`]);

        dataSource.addChild(child, false);
        fixture.detectChanges();

        expect(data.length).toBe(3);
        expectNestedTreeToMatch(treeElement,
            [`topping_1 - cheese_1 + base_1`],
            [`topping_2 - cheese_2 + base_2`],
            [_, `topping_4 - cheese_4 + base_4`],
            [_, _, `topping_5 - cheese_5 + base_5`],
            [_, _, `topping_6 - cheese_6 + base_6`],
            [`topping_3 - cheese_3 + base_3`]);
      });
    });

    describe('with when node', () => {
      let fixture: ComponentFixture<WhenNodeNestedCdkTreeApp>;
      let component: WhenNodeNestedCdkTreeApp;

      beforeEach(() => {
        configureCdkTreeTestingModule([WhenNodeNestedCdkTreeApp]);
        fixture = TestBed.createComponent(WhenNodeNestedCdkTreeApp);

        component = fixture.componentInstance;
        dataSource = component.dataSource as FakeDataSource;
        tree = component.tree;
        treeElement = fixture.nativeElement.querySelector('cdk-tree');

        fixture.detectChanges();
      });

      it('with the right data', () => {
        expect(dataSource.data.length).toBe(3);

        let data = dataSource.data;
        expectNestedTreeToMatch(treeElement,
            [`topping_1 - cheese_1 + base_1`],
            [`>> topping_2 - cheese_2 + base_2`],
            [`topping_3 - cheese_3 + base_3`]);

        dataSource.addChild(data[1], false);
        fixture.detectChanges();

        treeElement = fixture.nativeElement.querySelector('cdk-tree');
        data = dataSource.data;
        expect(data.length).toBe(3);
        expectNestedTreeToMatch(treeElement,
            [`topping_1 - cheese_1 + base_1`],
            [`>> topping_2 - cheese_2 + base_2`],
            [_, `topping_4 - cheese_4 + base_4`],
            [`topping_3 - cheese_3 + base_3`]);
      });
    });

    describe('with toggle', () => {
      let fixture: ComponentFixture<NestedCdkTreeAppWithToggle>;
      let component: NestedCdkTreeAppWithToggle;

      beforeEach(() => {
        configureCdkTreeTestingModule([NestedCdkTreeAppWithToggle]);
        fixture = TestBed.createComponent(NestedCdkTreeAppWithToggle);

        component = fixture.componentInstance;
        dataSource = component.dataSource as FakeDataSource;
        tree = component.tree;
        treeElement = fixture.nativeElement.querySelector('cdk-tree');

        fixture.detectChanges();
      });

      it('should expand/collapse the node', () => {
        component.toggleRecursively = false;
        let data = dataSource.data;
        const child = dataSource.addChild(data[1], false);
        dataSource.addChild(child, false);

        fixture.detectChanges();

        expectNestedTreeToMatch(treeElement,
          [`topping_1 - cheese_1 + base_1`],
          [`topping_2 - cheese_2 + base_2`],
          [`topping_3 - cheese_3 + base_3`]);

        fixture.detectChanges();

        (getNodes(treeElement)[1] as HTMLElement).click();
        fixture.detectChanges();

        expect(component.treeControl.expansionModel.selected.length)
          .toBe(1, `Expect node expanded`);
        expectNestedTreeToMatch(treeElement,
          [`topping_1 - cheese_1 + base_1`],
          [`topping_2 - cheese_2 + base_2`],
          [_, `topping_4 - cheese_4 + base_4`],
          [`topping_3 - cheese_3 + base_3`]);

        (getNodes(treeElement)[1] as HTMLElement).click();
        fixture.detectChanges();

        expectNestedTreeToMatch(treeElement,
          [`topping_1 - cheese_1 + base_1`],
          [`topping_2 - cheese_2 + base_2`],
          [`topping_3 - cheese_3 + base_3`]);
        expect(component.treeControl.expansionModel.selected.length)
          .toBe(0, `Expect node collapsed`);
      });

      it('should expand/collapse the node recursively', () => {
        let data = dataSource.data;
        const child = dataSource.addChild(data[1], false);
        dataSource.addChild(child, false);
        fixture.detectChanges();

        expectNestedTreeToMatch(treeElement,
          [`topping_1 - cheese_1 + base_1`],
          [`topping_2 - cheese_2 + base_2`],
          [`topping_3 - cheese_3 + base_3`]);

        (getNodes(treeElement)[1] as HTMLElement).click();
        fixture.detectChanges();

        expect(component.treeControl.expansionModel.selected.length)
          .toBe(3, `Expect node expanded`);
        expectNestedTreeToMatch(treeElement,
          [`topping_1 - cheese_1 + base_1`],
          [`topping_2 - cheese_2 + base_2`],
          [_, `topping_4 - cheese_4 + base_4`],
          [_, _, `topping_5 - cheese_5 + base_5`],
          [`topping_3 - cheese_3 + base_3`]);

        (getNodes(treeElement)[1] as HTMLElement).click();
        fixture.detectChanges();

        expect(component.treeControl.expansionModel.selected.length)
          .toBe(0, `Expect node collapsed`);
        expectNestedTreeToMatch(treeElement,
          [`topping_1 - cheese_1 + base_1`],
          [`topping_2 - cheese_2 + base_2`],
          [`topping_3 - cheese_3 + base_3`]);
      });
    });

    describe('with array data source', () => {
      let fixture: ComponentFixture<ArrayDataSourceNestedCdkTreeApp>;
      let component: ArrayDataSourceNestedCdkTreeApp;

      beforeEach(() => {
        configureCdkTreeTestingModule([ArrayDataSourceNestedCdkTreeApp]);
        fixture = TestBed.createComponent(ArrayDataSourceNestedCdkTreeApp);

        component = fixture.componentInstance;
        dataSource = component.dataSource as FakeDataSource;
        tree = component.tree;
        treeElement = fixture.nativeElement.querySelector('cdk-tree');

        fixture.detectChanges();
      });

      it('with the right data', () => {
        expect(dataSource.data.length).toBe(3);

        let data = dataSource.data;
        expectNestedTreeToMatch(treeElement,
          [`[topping_1] - [cheese_1] + [base_1]`],
          [`[topping_2] - [cheese_2] + [base_2]`],
          [`[topping_3] - [cheese_3] + [base_3]`]);

        dataSource.addChild(data[1], false);
        fixture.detectChanges();

        treeElement = fixture.nativeElement.querySelector('cdk-tree');
        expectNestedTreeToMatch(treeElement,
          [`[topping_1] - [cheese_1] + [base_1]`],
          [`[topping_2] - [cheese_2] + [base_2]`],
          [_, `[topping_4] - [cheese_4] + [base_4]`],
          [`[topping_3] - [cheese_3] + [base_3]`]);
      });
    });

    describe('with observable data source', () => {
      let fixture: ComponentFixture<ObservableDataSourceNestedCdkTreeApp>;
      let component: ObservableDataSourceNestedCdkTreeApp;

      beforeEach(() => {
        configureCdkTreeTestingModule([ObservableDataSourceNestedCdkTreeApp]);
        fixture = TestBed.createComponent(ObservableDataSourceNestedCdkTreeApp);

        component = fixture.componentInstance;
        dataSource = component.dataSource as FakeDataSource;
        tree = component.tree;
        treeElement = fixture.nativeElement.querySelector('cdk-tree');

        fixture.detectChanges();
      });

      it('with the right data', () => {
        expect(dataSource.data.length).toBe(3);

        let data = dataSource.data;
        expectNestedTreeToMatch(treeElement,
          [`[topping_1] - [cheese_1] + [base_1]`],
          [`[topping_2] - [cheese_2] + [base_2]`],
          [`[topping_3] - [cheese_3] + [base_3]`]);

        dataSource.addChild(data[1], false);
        fixture.detectChanges();

        treeElement = fixture.nativeElement.querySelector('cdk-tree');
        expectNestedTreeToMatch(treeElement,
          [`[topping_1] - [cheese_1] + [base_1]`],
          [`[topping_2] - [cheese_2] + [base_2]`],
          [_, `[topping_4] - [cheese_4] + [base_4]`],
          [`[topping_3] - [cheese_3] + [base_3]`]);
      });
    });

    it('should throw an error when missing function in nested tree', () => {
      configureCdkTreeTestingModule([NestedCdkErrorTreeApp]);
      expect(() => TestBed.createComponent(NestedCdkErrorTreeApp).detectChanges())
          .toThrowError(getTreeControlFunctionsMissingError().message);
    });

    it('should throw an error when missing function in flat tree', () => {
      configureCdkTreeTestingModule([FlatCdkErrorTreeApp]);
      expect(() => TestBed.createComponent(FlatCdkErrorTreeApp).detectChanges())
        .toThrowError(getTreeControlFunctionsMissingError().message);
    });
  });
});

export class TestData {
  pizzaTopping: string;
  pizzaCheese: string;
  pizzaBase: string;
  level: number;
  children: TestData[];
  observableChildren: BehaviorSubject<TestData[]>;

  constructor(pizzaTopping: string, pizzaCheese: string, pizzaBase: string, level: number = 1) {
    this.pizzaTopping = pizzaTopping;
    this.pizzaCheese = pizzaCheese;
    this.pizzaBase = pizzaBase;
    this.level = level;
    this.children = [];
    this.observableChildren = new BehaviorSubject<TestData[]>(this.children);
  }
}

class FakeDataSource extends DataSource<TestData> {
  dataIndex = 0;
  isConnected = false;

  _dataChange = new BehaviorSubject<TestData[]>([]);
  set data(data: TestData[]) { this._dataChange.next(data); }
  get data() { return this._dataChange.getValue(); }

  constructor(public treeControl: TreeControl<TestData>) {
    super();
    for (let i = 0; i < 3; i++) {
      this.addData();
    }
  }

  connect(collectionViewer: CollectionViewer): Observable<TestData[]> {
    this.isConnected = true;
    const streams = [this._dataChange, collectionViewer.viewChange];
    return combineLatest<[TestData[]]>(streams)
      .pipe(map(([data]) => {
        this.treeControl.dataNodes = data;
        return data;
      }));
  }

  disconnect() {
    this.isConnected = false;
  }

  addChild(parent: TestData, isFlat: boolean = true) {
    const nextIndex = ++this.dataIndex;
    const child = new TestData(`topping_${nextIndex}`, `cheese_${nextIndex}`, `base_${nextIndex}`,
      parent.level + 1);
    parent.children.push(child);
    if (isFlat) {
      let copiedData = this.data.slice();
      copiedData.splice(this.data.indexOf(parent) + 1, 0, child);
      this.data = copiedData;
    } else {
      parent.observableChildren.next(parent.children);
    }
    return child;
  }

  addData(level: number = 1) {
    const nextIndex = ++this.dataIndex;

    let copiedData = this.data.slice();
    copiedData.push(
      new TestData(`topping_${nextIndex}`, `cheese_${nextIndex}`, `base_${nextIndex}`, level));

    this.data = copiedData;
  }
}

function getNodes(treeElement: Element): Element[] {
  return [].slice.call(treeElement.querySelectorAll('.cdk-tree-node'))!;
}

function expectFlatTreeToMatch(treeElement: Element, expectedPaddingIndent: number = 28,
                               ...expectedTree: any[]) {
  const missedExpectations: string[] = [];

  function checkNode(node: Element, expectedNode: any[]) {
    const actualTextContent = node.textContent!.trim();
    const expectedTextContent = expectedNode[expectedNode.length - 1];
    if (actualTextContent !== expectedTextContent) {
      missedExpectations.push(
        `Expected node contents to be ${expectedTextContent} but was ${actualTextContent}`);
    }
  }

  function checkLevel(node: Element, expectedNode: any[]) {
    const actualLevel = (node as HTMLElement).style.paddingLeft;
    const expectedLevel = `${(expectedNode.length) * expectedPaddingIndent}px`;
    if (actualLevel != expectedLevel) {
      missedExpectations.push(
        `Expected node level to be ${expectedLevel} but was ${actualLevel}`);
    }
  }

  getNodes(treeElement).forEach((node, index) => {
    const expected = expectedTree ?
      expectedTree[index] :
      null;

    checkLevel(node, expected);
    checkNode(node, expected);
  });

  if (missedExpectations.length) {
    fail(missedExpectations.join('\n'));
  }
}

function expectNestedTreeToMatch(treeElement: Element, ...expectedTree: any[]) {
  const missedExpectations: string[] = [];
  function checkNodeContent(node: Element, expectedNode: any[]) {
    const expectedTextContent = expectedNode[expectedNode.length - 1];
    const actualTextContent = node.childNodes.item(0).textContent!.trim();
    if (actualTextContent !== expectedTextContent) {
      missedExpectations.push(
        `Expected node contents to be ${expectedTextContent} but was ${actualTextContent}`);
    }
  }

  function checkNodeDescendants(node: Element, expectedNode: any[], currentIndex: number) {
    let expectedDescendant = 0;

    for (let i = currentIndex + 1; i < expectedTree.length; ++i) {
      if (expectedTree[i].length > expectedNode.length) {
        ++expectedDescendant;
      } else if (expectedTree[i].length === expectedNode.length) {
        break;
      }
    }

    const actualDescendant = getNodes(node).length;
    if (actualDescendant !== expectedDescendant) {
      missedExpectations.push(
        `Expected node descendant num to be ${expectedDescendant} but was ${actualDescendant}`);
    }
  }

  getNodes(treeElement).forEach((node, index) => {

    const expected = expectedTree ?
      expectedTree[index] :
      null;

    checkNodeDescendants(node, expected, index);
    checkNodeContent(node, expected);
  });

  if (missedExpectations.length) {
    fail(missedExpectations.join('\n'));
  }
}

@Component({
  template: `
    <cdk-tree [dataSource]="dataSource" [treeControl]="treeControl">
      <cdk-tree-node *cdkTreeNodeDef="let node" class="customNodeClass"
                     cdkTreeNodePadding [cdkTreeNodePaddingIndent]="28"
                     cdkTreeNodeToggle>
                     {{node.pizzaTopping}} - {{node.pizzaCheese}} + {{node.pizzaBase}}
      </cdk-tree-node>
    </cdk-tree>
  `
})
class SimpleCdkTreeApp {
  getLevel = (node: TestData) => node.level;
  isExpandable = (node: TestData) => node.children.length > 0;

  treeControl: TreeControl<TestData> = new FlatTreeControl(this.getLevel, this.isExpandable);

  dataSource: FakeDataSource | null = new FakeDataSource(this.treeControl);

  @ViewChild(CdkTree) tree: CdkTree<TestData>;

}

@Component({
  template: `
    <cdk-tree [dataSource]="dataSource" [treeControl]="treeControl">
      <cdk-nested-tree-node *cdkTreeNodeDef="let node" class="customNodeClass">
                     {{node.pizzaTopping}} - {{node.pizzaCheese}} + {{node.pizzaBase}}
         <ng-template cdkTreeNodeOutlet></ng-template>
      </cdk-nested-tree-node>
    </cdk-tree>
  `
})
class NestedCdkTreeApp {
  getChildren = (node: TestData) => node.observableChildren;

  treeControl: TreeControl<TestData> = new NestedTreeControl(this.getChildren);

  dataSource: FakeDataSource | null = new FakeDataSource(this.treeControl);

  @ViewChild(CdkTree) tree: CdkTree<TestData>;
}

@Component({
  template: `
    <cdk-tree [dataSource]="dataSource" [treeControl]="treeControl">
      <cdk-nested-tree-node *cdkTreeNodeDef="let node" class="customNodeClass">
                     {{node.pizzaTopping}} - {{node.pizzaCheese}} + {{node.pizzaBase}}
         <ng-template cdkTreeNodeOutlet></ng-template>
      </cdk-nested-tree-node>
       <cdk-nested-tree-node *cdkTreeNodeDef="let node; when: isSecondNode" class="customNodeClass">
                     >> {{node.pizzaTopping}} - {{node.pizzaCheese}} + {{node.pizzaBase}}
         <ng-template cdkTreeNodeOutlet></ng-template>
      </cdk-nested-tree-node>
    </cdk-tree>
  `
})
class WhenNodeNestedCdkTreeApp {
  isSecondNode = (_: number, node: TestData) => node.pizzaBase.indexOf('2') > 0;

  getChildren = (node: TestData) => node.observableChildren;

  treeControl: TreeControl<TestData> = new NestedTreeControl(this.getChildren);

  dataSource: FakeDataSource | null = new FakeDataSource(this.treeControl);

  @ViewChild(CdkTree) tree: CdkTree<TestData>;
}


@Component({
  template: `
    <cdk-tree [dataSource]="dataSource" [treeControl]="treeControl">
      <cdk-tree-node *cdkTreeNodeDef="let node" class="customNodeClass"
                     cdkTreeNodePadding
                     cdkTreeNodeToggle [cdkTreeNodeToggleRecursive]="toggleRecursively">
                     {{node.pizzaTopping}} - {{node.pizzaCheese}} + {{node.pizzaBase}}
      </cdk-tree-node>
    </cdk-tree>
  `
})
class CdkTreeAppWithToggle {
  toggleRecursively: boolean = true;

  getLevel = (node: TestData) => node.level;
  isExpandable = (node: TestData) => node.children.length > 0;

  treeControl: TreeControl<TestData> = new FlatTreeControl(this.getLevel, this.isExpandable);
  dataSource: FakeDataSource | null = new FakeDataSource(this.treeControl);

  @ViewChild(CdkTree) tree: CdkTree<TestData>;
}

@Component({
  template: `
    <cdk-tree [dataSource]="dataSource" [treeControl]="treeControl">
      <cdk-nested-tree-node *cdkTreeNodeDef="let node" class="customNodeClass"
                            cdkTreeNodeToggle [cdkTreeNodeToggleRecursive]="toggleRecursively">
                     {{node.pizzaTopping}} - {{node.pizzaCheese}} + {{node.pizzaBase}}
        <div *ngIf="treeControl.isExpanded(node)">
          <ng-template cdkTreeNodeOutlet></ng-template>
        </div>
      </cdk-nested-tree-node>
    </cdk-tree>
  `
})
class NestedCdkTreeAppWithToggle {
  toggleRecursively: boolean = true;

  getChildren = (node: TestData) => node.observableChildren;

  treeControl: TreeControl<TestData> = new NestedTreeControl(this.getChildren);
  dataSource: FakeDataSource | null = new FakeDataSource(this.treeControl);

  @ViewChild(CdkTree) tree: CdkTree<TestData>;
}

@Component({
  template: `
    <cdk-tree [dataSource]="dataSource" [treeControl]="treeControl">
      <cdk-tree-node *cdkTreeNodeDef="let node" class="customNodeClass"
                     cdkTreeNodePadding [cdkTreeNodePaddingIndent]="28"
                     cdkTreeNodeToggle>
                     {{node.pizzaTopping}} - {{node.pizzaCheese}} + {{node.pizzaBase}}
      </cdk-tree-node>
       <cdk-tree-node *cdkTreeNodeDef="let node; when: isOddNode" class="customNodeClass"
                     cdkTreeNodePadding [cdkTreeNodePaddingIndent]="28"
                     cdkTreeNodeToggle>
                     [{{node.pizzaTopping}}] - [{{node.pizzaCheese}}] + [{{node.pizzaBase}}]
      </cdk-tree-node>
    </cdk-tree>
  `
})
class WhenNodeCdkTreeApp {
  isOddNode = (_: number, node: TestData) => node.level % 2 === 1;
  getLevel = (node: TestData) => node.level;
  isExpandable = (node: TestData) => node.children.length > 0;

  treeControl: TreeControl<TestData> = new FlatTreeControl(this.getLevel, this.isExpandable);

  dataSource: FakeDataSource | null = new FakeDataSource(this.treeControl);

  @ViewChild(CdkTree) tree: CdkTree<TestData>;
}

@Component({
  template: `
    <cdk-tree [dataSource]="dataArray" [treeControl]="treeControl">
      <cdk-tree-node *cdkTreeNodeDef="let node"
                     cdkTreeNodePadding [cdkTreeNodePaddingIndent]="28"
                     cdkTreeNodeToggle>
                     [{{node.pizzaTopping}}] - [{{node.pizzaCheese}}] + [{{node.pizzaBase}}]
      </cdk-tree-node>
    </cdk-tree>
  `
})
class ArrayDataSourceCdkTreeApp {
  getLevel = (node: TestData) => node.level;
  isExpandable = (node: TestData) => node.children.length > 0;

  treeControl: TreeControl<TestData> = new FlatTreeControl(this.getLevel, this.isExpandable);

  dataSource: FakeDataSource = new FakeDataSource(this.treeControl);

  get dataArray() {
    return this.dataSource.data;
  }

  @ViewChild(CdkTree) tree: CdkTree<TestData>;
}

@Component({
  template: `
    <cdk-tree [dataSource]="dataObservable" [treeControl]="treeControl">
      <cdk-tree-node *cdkTreeNodeDef="let node"
                     cdkTreeNodePadding [cdkTreeNodePaddingIndent]="28"
                     cdkTreeNodeToggle>
                     [{{node.pizzaTopping}}] - [{{node.pizzaCheese}}] + [{{node.pizzaBase}}]
      </cdk-tree-node>
    </cdk-tree>
  `
})
class ObservableDataSourceCdkTreeApp {
  getLevel = (node: TestData) => node.level;
  isExpandable = (node: TestData) => node.children.length > 0;

  treeControl: TreeControl<TestData> = new FlatTreeControl(this.getLevel, this.isExpandable);

  dataSource: FakeDataSource = new FakeDataSource(this.treeControl);

  get dataObservable() {
    return this.dataSource._dataChange;
  }

  @ViewChild(CdkTree) tree: CdkTree<TestData>;
}

@Component({
  template: `
    <cdk-tree [dataSource]="dataArray" [treeControl]="treeControl">
      <cdk-nested-tree-node *cdkTreeNodeDef="let node">
                     [{{node.pizzaTopping}}] - [{{node.pizzaCheese}}] + [{{node.pizzaBase}}]
         <ng-template cdkTreeNodeOutlet></ng-template>
      </cdk-nested-tree-node>
    </cdk-tree>
  `
})
class ArrayDataSourceNestedCdkTreeApp {

  getChildren = (node: TestData) => node.observableChildren;

  treeControl: TreeControl<TestData> = new NestedTreeControl(this.getChildren);

  dataSource: FakeDataSource = new FakeDataSource(this.treeControl);

  get dataArray() {
    return this.dataSource.data;
  }

  @ViewChild(CdkTree) tree: CdkTree<TestData>;
}

@Component({
  template: `
    <cdk-tree [dataSource]="dataObservable" [treeControl]="treeControl">
      <cdk-nested-tree-node *cdkTreeNodeDef="let node">
                     [{{node.pizzaTopping}}] - [{{node.pizzaCheese}}] + [{{node.pizzaBase}}]
         <ng-template cdkTreeNodeOutlet></ng-template>
      </cdk-nested-tree-node>
    </cdk-tree>
  `
})
class ObservableDataSourceNestedCdkTreeApp {

  getChildren = (node: TestData) => node.observableChildren;

  treeControl: TreeControl<TestData> = new NestedTreeControl(this.getChildren);

  dataSource: FakeDataSource = new FakeDataSource(this.treeControl);

  get dataObservable() {
    return this.dataSource._dataChange;
  }

  @ViewChild(CdkTree) tree: CdkTree<TestData>;
}

@Component({
  template: `
    <cdk-tree [dataSource]="dataSource" [treeControl]="treeControl">
      <cdk-nested-tree-node *cdkTreeNodeDef="let node" class="customNodeClass">
                     {{node.pizzaTopping}} - {{node.pizzaCheese}} + {{node.pizzaBase}}
         <ng-template cdkTreeNodeOutlet></ng-template>
      </cdk-nested-tree-node>
    </cdk-tree>
  `
})
class NestedCdkErrorTreeApp {
  getLevel = (node: TestData) => node.level;

  isExpandable = (node: TestData) => node.children.length > 0;

  treeControl: TreeControl<TestData> = new FlatTreeControl(this.getLevel, this.isExpandable);

  dataSource: FakeDataSource | null = new FakeDataSource(this.treeControl);

  @ViewChild(CdkTree) tree: CdkTree<TestData>;
}

class FakeTreeControl extends BaseTreeControl<TestData> {
  getDescendants(_: TestData): TestData[] {
    return this.dataNodes;
  }

  expandAll(): void {
    // No op
  }
}
@Component({
  template: `
    <cdk-tree [dataSource]="dataSource" [treeControl]="treeControl">
      <cdk-tree-node *cdkTreeNodeDef="let node" class="customNodeClass">
                     {{node.pizzaTopping}} - {{node.pizzaCheese}} + {{node.pizzaBase}}
         <ng-template cdkTreeNodeOutlet></ng-template>
      </cdk-tree-node>
    </cdk-tree>
  `
})
class FlatCdkErrorTreeApp {

  getLevel = (node: TestData) => node.level;

  isExpandable = (node: TestData) => node.children.length > 0;

  treeControl: TreeControl<TestData> = new FakeTreeControl();

  dataSource: FakeDataSource | null = new FakeDataSource(this.treeControl);

  @ViewChild(CdkTree) tree: CdkTree<TestData>;
}
