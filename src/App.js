import React, { Component } from 'react';
import Content from './components/Content';
import { Container, Dropdown } from 'react-bootstrap';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Feed from './components/Feed';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchMessagesThunk } from './utilities';
import Messages from './components/Messages';

const apiKey = process.env.REACT_APP_API;

const mapDispatchToProps = (dispatch) => ({
  fetchMesagges: (username) => dispatch(fetchMessagesThunk(username)),
});

class App extends Component {
  state = {
    userImg: '',
    users: [],
    search: '',
    show: false,
    authoKey: this.props.authoKey,
  };

  fetchUser = async () => {
    await fetch(apiKey + '/api/profile/', {
      credentials: 'include',
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    })
      .then((resp) => resp.json())
      .then((respObj) =>
        this.setState({
          users: respObj.data,
        })
      );
  };

  componentDidMount() {
    console.log('HERE');
    this.fetchUser();
    this.props.fetchMesagges(this.props.username);
  }

  setSearch = (search) => {
    if (search) {
      this.setState({
        search,
        show: true,
      });
    } else {
      this.setState({
        search: '',
        show: false,
      });
    }
  };

  changeStatus = () => {
    console.log('test');
    this.setState({
      show: !this.state.show,
      search: '',
    });
  };

  getUserImg = (src) => {
    if (src) {
      this.setState({
        userImg: src,
      });
    } else {
      this.setState({
        userImg: '',
      });
    }
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (prevState.userImg !== this.state.userImg) {
      this.setState({
        userImg: this.state.userImg,
      });
      this.fetchUser();
    }
  };

  render() {
    return (
      // <Router>
      <div className='App'>
        <Container className='m-0 p-0' fluid>
          <NavBar
            setSearch={this.setSearch}
            searchValue={this.state.search}
            status={this.state.show}
            userImage={
              this.state.users.length > 0 &&
              this.state.users.filter(
                (user) => user.username === this.props.username
              )
            }
            changeStatus={this.changeStatus}
            users={
              this.state.users &&
              this.state.search &&
              this.state.users.filter((user) =>
                user.name
                  .toLowerCase()
                  .startsWith(this.state.search.toLowerCase())
              ).length > 0 ? (
                this.state.users
                  .filter((user) =>
                    user.name
                      .toLowerCase()
                      .startsWith(this.state.search.toLowerCase())
                  )
                  .map((user, i) => (
                    <Dropdown.Item key={i}>
                      <Link to={'/profiles/' + user.username}>{user.name}</Link>
                    </Dropdown.Item>
                  ))
              ) : (
                <Dropdown.Item>No user with that name</Dropdown.Item>
              )
            }
          />
          <Route
            path='/feed'
            exact
            render={(props) => (
              <Feed
                {...props}
                authoKey={this.props.authoKey}
                username={this.props.username}
                users={this.state.users}
                userImage={
                  this.state.users.length > 0 &&
                  this.state.users.filter(
                    (user) => user.username === this.props.username
                  )
                }
              />
            )}
          />
          <Route
            path='/profiles/:userID'
            render={(props) => (
              <Content
                {...props}
                username={this.props.username}
                authoKey={this.props.authoKey}
                getUserImg={this.getUserImg}
              />
            )}
          />
          <Footer />
          {this.state.users.length > 1 && (
            <Messages
              users={this.state.users}
              username={this.props.username}
              userImage={
                this.state.users.length > 0 &&
                this.state.users.filter(
                  (user) => user.username === this.props.username
                )
              }
            />
          )}
        </Container>
      </div>
      // </Router>
    );
  }
}

export default connect(null, mapDispatchToProps)(App);
