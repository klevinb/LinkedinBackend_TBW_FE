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
    this.setState({ username });
  };
  resetAuthorization = () => {
    localStorage.removeItem('username');
    this.setState({ username: '' });
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (prevState.username !== this.state.username) {
      this.setState({ username: this.state.username });
    }
  };

  render() {
    return (
      <>
        <Router>
          <Route
            path='/'
            exact
            render={(props) => (
              <Login
                getAuthorization={this.getAuthorization}
                resetAuthorization={this.resetAuthorization}
                {...props}
              />
            )}
          />
          <App
            username={this.state.username}
            getAuthorization={this.getAuthorization}
          />
        </Router>
      </>
    );
  }
}

export default MyApp;
