import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import MyApp from './MyApp';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Provider } from 'react-redux';
import configureStore from './store';

ReactDOM.render(
  <Provider store={configureStore()}>
    <MyApp />
  </Provider>,

  document.getElementById('root')
);
