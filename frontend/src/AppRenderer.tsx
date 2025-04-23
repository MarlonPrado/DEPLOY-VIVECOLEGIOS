import React, { Suspense } from 'react';
import * as ReactDOMClient from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import App from './routes/App';
import configureStore from './stores/configureStore';

// const App = React.lazy(()=> {return import(/* webpackChunkName: "App" */ './routes/App')})
const { store, persistor } = configureStore();
const container = document.getElementById('app');
// Create a root.
const root = ReactDOMClient.createRoot(container);

import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';

root.render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <Suspense fallback={<div className="loading" />}>
        <App />
      </Suspense>
    </PersistGate>
  </Provider>,
);

// reportWebVitals();
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
// serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals("");

// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker.register('/service-worker.js')
//       .then(registration => {
//         console.log('SW registered: ', registration);
//       }).catch(registrationError => {
//         console.log('SW registration failed: ', registrationError);
//       });
//   });
// }