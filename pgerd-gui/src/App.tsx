import { useState } from 'react'
import '@radix-ui/themes/styles.css'
import { Theme, Button } from '@radix-ui/themes'
import { ReactFlow, Background } from 'reactflow'
import { configureStore } from '@reduxjs/toolkit'
import { debounce } from 'lodash-es'
import 'reactflow/dist/style.css'
import './App.css'

// Test store configuration - demonstrates Redux Toolkit import works
const testStore = configureStore({
  reducer: {
    test: (state = { value: 0 }) => state
  }
})

// Test debounce function - demonstrates lodash-es import works
const testDebounce = debounce(() => console.log('Debounced!'), 300)

function App() {
  const [count, setCount] = useState(0)

  // Use the test variables to avoid TypeScript warnings
  const handleClick = () => {
    setCount((count) => count + 1)
    testDebounce() // Test debounce function
    console.log('Store state:', testStore.getState()) // Test store
  }

  return (
    <Theme>
      <div className="App">
        <div className="card">
          <Button onClick={handleClick}>
            count is {count}
          </Button>
          <p>Testing core dependencies:</p>
          <ul>
            <li>✅ Radix UI Themes (Button)</li>
            <li>✅ React Flow</li>
            <li>✅ Redux Toolkit</li>
            <li>✅ Lodash-es (debounce)</li>
          </ul>
          <div style={{ height: '200px', width: '100%' }}>
            <ReactFlow nodes={[]} edges={[]}>
              <Background />
            </ReactFlow>
          </div>
        </div>
      </div>
    </Theme>
  )
}

export default App
