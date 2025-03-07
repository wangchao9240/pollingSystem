import AppRouter from './router/index';
import { AlertProvider } from './components/Alert';

function App() {
  return (
    <AlertProvider>
      <AppRouter />
    </AlertProvider>
  );
}

export default App;
