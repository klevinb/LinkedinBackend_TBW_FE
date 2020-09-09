import React, { Component } from 'react';
import App from './App';
import Login from './components/Login';
import { BrowserRouter as Router, Route } from 'react-router-dom';

class MyApp extends Component {
  state = {
    username: localStorage.getItem('username'),
  };

  getAuthorization = (username) => {
    localStorage.setItem('username', username);
  };
  resetAuthorization = () => {
    localStorage.removeItem('username');
    this.setState({ username: '' });
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (this.state.username && prevState.username !== this.state.username) {
      this.setState(this.state);
    }
  };

  render() {
    return (
      <>
        <Router>
          <Route
            path='/login'
            exact
            render={(props) => (
              <Login
                getAuthorization={this.getAuthorization}
                resetAuthorization={this.resetAuthorization}
                {...props}
              />
            )}
          />
          <App username={this.state.username} />
        </Router>
      </>
    );
  }
}

export default MyApp;
