import { configureStore } from '@reduxjs/toolkit';
import reducers from '../reducers';

export default function ConfigureStore(initialState) {
  const store = configureStore({
    reducer: reducers(),
  });

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers/index', () => {
      const nextRootReducer = require('../reducers');
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}
