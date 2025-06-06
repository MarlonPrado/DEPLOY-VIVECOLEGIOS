import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { thunk } from 'redux-thunk';
import { rootReducer } from './reducers';
import sagas from './sagas';
import createSagaMiddleware from 'redux-saga';

// Múltiples middlewares para operaciones asíncronas.
const sagaMiddleware = createSagaMiddleware();

const middlewares = [sagaMiddleware];

// Implementa Redux Persist para guardar el estado en almacenamiento local.
const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Encapsula toda la lógica de estado en una función donde se crea instancias aisladas del Redux.
export default () => {
  const store = createStore(persistedReducer, {}, composeWithDevTools(applyMiddleware(thunk, ...middlewares)));
  sagaMiddleware.run(sagas);
  const persistor = persistStore(store);
  return { store, persistor };
};