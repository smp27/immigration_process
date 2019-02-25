import React, { Component } from 'react';
import { Provider } from 'react-redux'
import Routes from './routes';
import store from './stores';
import './App.css';

class App extends Component {
  render() {
    return (
      <Provider store = {store}>
        <div className="App">
          <Routes />
        </div>
      </Provider>
    );
  }
}

export default App;
