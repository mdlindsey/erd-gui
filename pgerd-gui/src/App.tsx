import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes';
import 'reactflow/dist/style.css';
import './App.css';

import { Canvas } from './components/canvas';
import { ServiceProvider, initializeDefaultService } from './services';
import { store } from './store';

// Initialize the service layer
const stateService = initializeDefaultService(store);

function App() {
  return (
    <ServiceProvider service={stateService}>
      <Theme>
        <div className="App">
          <h1>Postgres ERD GUI</h1>
          <div
            style={{
              height: '600px',
              width: '100%',
              border: '1px solid #ddd',
              borderRadius: '8px',
              overflow: 'hidden',
            }}
          >
            <Canvas />
          </div>
        </div>
      </Theme>
    </ServiceProvider>
  );
}

export default App;
