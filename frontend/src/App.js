import AppRouter from './router/index';
import { AlertProvider } from './components/Alert';
import { Provider } from 'react-redux';
import { store } from './store';

function App() {
  return (
    <Provider store={store}>
      <AlertProvider>
        <AppRouter />
      </AlertProvider>
    </Provider>
  );
}

export default App;