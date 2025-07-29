// Store functionality test

import React from 'react';
import { Provider } from 'react-redux';
import { store, useAppDispatch, useAppSelector, tablesActions, canvasActions } from '../index';

// Test component to verify store functionality
const TestStoreComponent: React.FC = () => {
  const dispatch = useAppDispatch();
  const tables = useAppSelector((state) => state.tables);
  const viewport = useAppSelector((state) => state.canvas.viewport);

  const addTestTable = () => {
    dispatch(tablesActions.addTable({
      name: 'Test Table',
      position: { x: 100, y: 100 },
    }));
  };

  const zoomIn = () => {
    dispatch(canvasActions.zoomIn());
  };

  return (
    <div>
      <h2>Store Test Component</h2>
      <p>Tables count: {tables.allIds.length}</p>
      <p>Zoom level: {viewport.zoom}</p>
      <button onClick={addTestTable}>Add Test Table</button>
      <button onClick={zoomIn}>Zoom In</button>
    </div>
  );
};

// Test wrapper with provider
export const StoreTestWrapper: React.FC = () => {
  return (
    <Provider store={store}>
      <TestStoreComponent />
    </Provider>
  );
};

// Simple unit test functions
export const testStoreInitialization = () => {
  const state = store.getState();
  
  console.log('Testing store initialization...');
  console.log('Canvas state:', state.canvas);
  console.log('Tables state:', state.tables);
  console.log('UI state:', state.ui);
  
  // Verify initial state structure
  const tests = [
    {
      name: 'Canvas viewport should be initialized',
      test: () => state.canvas.viewport.zoom === 1,
    },
    {
      name: 'Tables should be empty initially',
      test: () => state.tables.allIds.length === 0,
    },
    {
      name: 'Grid should be visible by default',
      test: () => state.canvas.gridVisible === true,
    },
    {
      name: 'Snap to grid should be enabled by default',
      test: () => state.canvas.snapToGrid === true,
    },
    {
      name: 'UI theme should be light by default',
      test: () => state.ui.theme === 'light',
    },
  ];

  const results = tests.map(({ name, test }) => {
    try {
      const passed = test();
      console.log(`✓ ${name}: ${passed ? 'PASS' : 'FAIL'}`);
      return passed;
    } catch (error) {
      console.log(`✗ ${name}: ERROR - ${error}`);
      return false;
    }
  });

  const allPassed = results.every(result => result);
  console.log(`\nStore initialization test: ${allPassed ? 'PASS' : 'FAIL'}`);
  
  return allPassed;
};

export const testStoreActions = () => {
  console.log('\nTesting store actions...');
  
  // Test adding a table
  store.dispatch(tablesActions.addTable({
    name: 'Users',
    position: { x: 200, y: 150 },
  }));
  
  const stateAfterTable = store.getState();
  console.log('State after adding table:', {
    tableCount: stateAfterTable.tables.allIds.length,
    firstTable: stateAfterTable.tables.allIds[0] ? 
      stateAfterTable.tables.byId[stateAfterTable.tables.allIds[0]] : null,
  });
  
  // Test canvas zoom
  store.dispatch(canvasActions.zoomIn());
  const stateAfterZoom = store.getState();
  console.log('Zoom after zoom in:', stateAfterZoom.canvas.viewport.zoom);
  
  // Test UI tool selection
  store.dispatch({
    type: 'ui/setSelectedTool',
    payload: 'table',
  });
  const stateAfterTool = store.getState();
  console.log('Selected tool:', stateAfterTool.ui.selectedTool);
  
  const actionTests = [
    {
      name: 'Table should be added',
      test: () => stateAfterTable.tables.allIds.length === 1,
    },
    {
      name: 'Table should have correct properties',
      test: () => {
        const tableId = stateAfterTable.tables.allIds[0];
        const table = stateAfterTable.tables.byId[tableId];
        return table && table.name === 'Users' && table.position.x === 200;
      },
    },
    {
      name: 'Zoom should increase',
      test: () => stateAfterZoom.canvas.viewport.zoom > 1,
    },
    {
      name: 'Tool should change',
      test: () => stateAfterTool.ui.selectedTool === 'table',
    },
  ];

  const actionResults = actionTests.map(({ name, test }) => {
    try {
      const passed = test();
      console.log(`✓ ${name}: ${passed ? 'PASS' : 'FAIL'}`);
      return passed;
    } catch (error) {
      console.log(`✗ ${name}: ERROR - ${error}`);
      return false;
    }
  });

  const allActionsPassed = actionResults.every(result => result);
  console.log(`\nStore actions test: ${allActionsPassed ? 'PASS' : 'FAIL'}`);
  
  return allActionsPassed;
};

// Run all tests
export const runAllStoreTests = () => {
  console.log('=== Redux Store Tests ===');
  const initTest = testStoreInitialization();
  const actionTest = testStoreActions();
  
  const allTestsPassed = initTest && actionTest;
  console.log(`\n=== Overall Result: ${allTestsPassed ? 'ALL TESTS PASS' : 'SOME TESTS FAILED'} ===`);
  
  return allTestsPassed;
};

export default TestStoreComponent;