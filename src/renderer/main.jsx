import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import 'antd/dist/antd.css';

// 渲染应用
const render = (Component) => {
  ReactDOM.render(
    <BrowserRouter>
      <Component />
    </BrowserRouter>,
    document.getElementById('root')
  );
};

render(App);
