import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, HashRouter} from 'react-router-dom';
import App from './App';
import 'antd/dist/antd.css';

// 渲染应用
const render = (Component) => {
  ReactDOM.render(
    <HashRouter>
      <Component />
    </HashRouter>,
    document.getElementById('root')
  );
};

render(App);
