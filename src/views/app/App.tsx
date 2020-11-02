import React, { ReactElement } from 'react';
import {Link} from 'react-router-dom';
import logo from './logo.svg';
import './App.less';

function App():ReactElement {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <Link className="App-link" to="/home/native/twod/PlanGeometry">
          开始
        </Link>
      </header>
    </div>
  );
}

export default App;
