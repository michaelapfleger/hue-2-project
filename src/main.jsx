import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import loggerMiddleware from 'redux-logger';
import injectTapEventPlugin from 'react-tap-event-plugin';
import App from './App.jsx';
import reducers from './reducers';
import './styles.css';

injectTapEventPlugin();
const root = document.querySelector('#root');

const middleware = applyMiddleware(loggerMiddleware);
const store = createStore(reducers, middleware);

ReactDOM.render(
    <Provider store={store}>
      <App/>
    </Provider>,
    root,
);
