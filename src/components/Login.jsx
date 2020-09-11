import React, { Component } from 'react';
import {
  Container,
  FormControl,
  Button,
  FormGroup,
  Image,
  Alert,
  Row,
  Col,
} from 'react-bootstrap';

import { FiUpload } from 'react-icons/fi';
import { GrFacebook, GrLinkedin } from 'react-icons/gr';

const apiKey = process.env.REACT_APP_API;

class Login extends Component {
  state = {
    photo: null,
    user: {
      credentials: '',
      password: '',
    },
    signup: false,
    login: true,
    newUser: {
      username: '',
      email: '',
      password: '',
    },
    profile: {
      name: '',
      surname: '',
      email: '',
      bio: '',
      title: '',
      about: '',
      area: '',
      image: '',
      username: '',
    },
    token: '',
    fromLogin: false,
  };

  setName = (e) => {
    const user = this.state.user;
    user.credentials = e;
    this.setState({
      user,
    });
  };

  handleUpload = async () => {
    const photo = new FormData();
    photo.append('profile', this.state.photo);

    await fetch(
      apiKey + '/api/profile/' + this.state.profile.username + '/upload',
      {
        method: 'POST',
        body: photo,
        headers: new Headers({
          Authorization: 'Bearer ' + this.state.token,
        }),
      }
    );
  };

  setPassword = (e) => {
    const user = this.state.user;
    user.password = e;
    this.setState({
      user,
    });
  };

  handleChange = (e) => {
    const newUser = this.state.newUser;
    newUser[e.currentTarget.id] = e.currentTarget.value;
    this.setState({
      newUser,
    });
  };

  handleChangeProfile = (e) => {
    const profile = this.state.profile;
    profile[e.currentTarget.id] = e.currentTarget.value;
    this.setState({
      profile,
    });
  };

  fetchUser = async () => {
    let resp = await fetch(apiKey + '/api/profile/login', {
      method: 'POST',
      body: JSON.stringify(this.state.user),
      credentials: 'include',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    });
    if (resp.ok) {
      this.props.getAuthorization(this.state.user.credentials);

      this.props.history.push('/profiles/me?' + this.state.user.credentials);
    } else {
      this.setState({ signup: true, fromLogin: true });
    }
  };

  componentDidMount() {
    this.props.resetAuthorization();
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.fetchUser();
  };

  addPhoto = (e) => {
    const photo = e.target.files[0];

    this.setState({
      photo,
    });
  };

  addNewProfile = async (e) => {
    e.preventDefault();
    const resp = await fetch(apiKey + '/api/profile', {
      method: 'POST',
      body: JSON.stringify({
        ...this.state.profile,
        ...this.state.newUser,
      }),
      credentials: 'include',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    });
    const photo = new FormData();
    photo.append('profile', this.state.photo);
    const id = await resp.json();

    await fetch(apiKey + '/api/profile/' + id + '/upload', {
      method: 'POST',
      body: photo,
      credentials: 'include',
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });

    this.setState({ signup: false, login: true });
  };

  render() {
    return (
      <Container id='logingPage' className='d-flex justify-content-center '>
        {this.state.login ? (
          <div className='Login'>
            <Image
              className='mb-3'
              src='https://cdn.worldvectorlogo.com/logos/linkedin.svg'
            />
            <form onSubmit={this.handleSubmit}>
              <FormGroup controlId='name'>
                <label>Email</label>
                <FormControl
                  autoFocus
                  type='name'
                  value={this.state.name}
                  onChange={(e) => this.setName(e.target.value)}
                />
              </FormGroup>
              <FormGroup controlId='password'>
                <label>Password</label>
                <FormControl
                  value={this.state.password}
                  onChange={(e) => this.setPassword(e.target.value)}
                  type='password'
                />
              </FormGroup>
              <Button block type='submit'>
                Login
              </Button>
              <div className='logins'>
                <a
                  href={
                    process.env.REACT_APP_API + '/api/profile/auth/facebook'
                  }
                >
                  <div className='LoginButtons'>
                    <GrFacebook className='mr-2' /> Facebook
                  </div>
                </a>
                <a
                  href={
                    process.env.REACT_APP_API + '/api/profile/auth/linkedin'
                  }
                >
                  <div className='LoginButtons'>
                    <GrLinkedin className='mr-2' /> Linkedin
                  </div>
                </a>
              </div>
              <br />

              <div className='d-flex justify-content-center mt-2'>
                <Button
                  id='createAccLink'
                  onClick={() =>
                    this.setState({
                      signup: !this.state.signup,
                      fromLogin: false,
                    })
                  }
                >
                  Create an account
                </Button>
              </div>
              {this.state.signup ? (
                <>
                  <div className='mt-5'>
                    {this.state.fromLogin ? (
                      <Alert variant='warning'>
                        "We cannot find users with this credentials"
                      </Alert>
                    ) : (
                      <div className='d-flex justify-content-center'>
                        <Button
                          variant='info'
                          onClick={() =>
                            this.setState({ login: false, signup: true })
                          }
                        >
                          Create a new User
                        </Button>
                      </div>
                    )}
                  </div>
                </>
              ) : null}
            </form>
          </div>
        ) : (
          <>
            {this.state.signup ? (
              <div className='Login'>
                <Image
                  className='mb-3'
                  src='https://cdn.worldvectorlogo.com/logos/linkedin.svg'
                />
                <form>
                  <FormGroup>
                    <label>Username</label>
                    <FormControl
                      autoFocus
                      id='username'
                      type='text'
                      value={this.state.newUser.username}
                      onChange={(e) => this.handleChange(e)}
                    />
                  </FormGroup>
                  <FormGroup>
                    <label>Email</label>
                    <FormControl
                      value={this.state.newUser.email}
                      onChange={(e) => this.handleChange(e)}
                      type='text'
                      id='email'
                    />
                  </FormGroup>
                  <FormGroup>
                    <label>Password</label>
                    <FormControl
                      value={this.state.newUser.password}
                      onChange={(e) => this.handleChange(e)}
                      type='password'
                      id='password'
                    />
                  </FormGroup>
                  <Button
                    block
                    onClick={() => this.setState({ signup: false })}
                  >
                    Sign Up
                  </Button>
                </form>
              </div>
            ) : (
              <div style={{ marginTop: '35vh' }}>
                <Container className='d-flex justify-content-center'>
                  <Row>
                    <Col className='d-flex align-items-center mr-5'>
                      <label htmlFor='profilePhoto'>
                        <FiUpload
                          style={{ fontSize: '55px', color: '#0073B1' }}
                        />
                      </label>
                    </Col>
                    <form onSubmit={this.addNewProfile}>
                      <input
                        style={{ display: 'none' }}
                        type='file'
                        id='profilePhoto'
                        profile='file'
                        onChange={(e) => this.addPhoto(e)}
                        accept='image/*'
                      />
                      <Container>
                        <Image
                          src='https://cdn.worldvectorlogo.com/logos/linkedin.svg'
                          className='mb-3'
                          style={{ width: '150px' }}
                        />
                        <Row>
                          <Col>
                            <FormGroup>
                              <label>Name</label>
                              <FormControl
                                autoFocus
                                id='name'
                                type='text'
                                value={this.state.profile.name}
                                onChange={(e) => this.handleChangeProfile(e)}
                              />
                            </FormGroup>
                            <FormGroup>
                              <label>Surname</label>
                              <FormControl
                                autoFocus
                                id='surname'
                                type='text'
                                value={this.state.profile.surname}
                                onChange={(e) => this.handleChangeProfile(e)}
                              />
                            </FormGroup>
                            <FormGroup>
                              <label>About You</label>
                              <FormControl
                                autoFocus
                                id='about'
                                type='text'
                                value={this.state.profile.about}
                                onChange={(e) => this.handleChangeProfile(e)}
                              />
                            </FormGroup>
                          </Col>
                          <Col>
                            <FormGroup>
                              <label>Bio</label>
                              <FormControl
                                autoFocus
                                id='bio'
                                type='text'
                                value={this.state.profile.bio}
                                onChange={(e) => this.handleChangeProfile(e)}
                              />
                            </FormGroup>
                            <FormGroup>
                              <label>Title</label>
                              <FormControl
                                autoFocus
                                id='title'
                                type='text'
                                value={this.state.profile.title}
                                onChange={(e) => this.handleChangeProfile(e)}
                              />
                            </FormGroup>
                            <FormGroup>
                              <label>Area</label>
                              <FormControl
                                autoFocus
                                id='area'
                                type='text'
                                value={this.state.profile.area}
                                onChange={(e) => this.handleChangeProfile(e)}
                              />
                            </FormGroup>
                          </Col>
                        </Row>
                        <Button block type='submit'>
                          Add Info
                        </Button>
                      </Container>
                    </form>
                  </Row>
                </Container>
              </div>
            )}
          </>
        )}
      </Container>
    );
  }
}

export default Login;
