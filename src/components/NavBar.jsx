import React, { Component } from 'react';
import {
  Nav,
  Image,
  Navbar,
  NavDropdown,
  Dropdown,
  FormControl,
  Container,
} from 'react-bootstrap';
import './NavBar.css';
import { FaHome, FaSuitcase, FaUserFriends, FaVideo } from 'react-icons/fa';
import { BsChatSquareDots } from 'react-icons/bs';
import { AiOutlineBell } from 'react-icons/ai';
import { Link, withRouter } from 'react-router-dom';

class NavBar extends Component {
  render() {
    return (
      <Container className='m-0 p-0 pb-2' fluid>
        <Navbar bg='dark' expand='lg' className='navBar'>
          <div className='container'>
            <div className='d-flex'>
              <Image
                src='https://image.flaticon.com/icons/png/512/174/174857.png'
                style={{
                  width: '50px',
                  backgroundColor: 'white',
                  borderRadius: '10%',
                }}
              />
              <Navbar.Brand href='#home'></Navbar.Brand>
              <Dropdown
                show={this.props.status}
                onSelect={this.props.changeStatus}
              >
                <Dropdown.Menu>{this.props.users}</Dropdown.Menu>
              </Dropdown>
              <FormControl
                onChange={(event) =>
                  this.props.setSearch(event.currentTarget.value)
                }
                value={this.props.searchValue}
                type='text'
                placeholder='Search'
                className='mr-sm-2'
              />
            </div>
            <div>
              <Navbar.Toggle aria-controls='basic-navbar-nav' />
              <Navbar.Collapse id='basic-navbar-nav'>
                <Nav className='mr-auto text-white'>
                  <Link className='text-white mr-2' to='/feed'>
                    <FaHome />
                    Home
                  </Link>

                  <Link className='text-white mr-2 navHide' to='/my-network'>
                    <FaUserFriends />
                    My Network
                  </Link>
                  <Link className='text-white mr-2 navHide' to='/jobs'>
                    <FaSuitcase />
                    Jobs
                  </Link>
                  <Link className='text-white mr-2 navHide' to='/messaging'>
                    <BsChatSquareDots />
                    Messaging
                  </Link>
                  <Link className='text-white mr-2 navHide' to='/notifications'>
                    <AiOutlineBell />
                    Notifications
                  </Link>

                  {this.props.userImage.length > 0 ? (
                    <Image
                      src={this.props.userImage[0].image}
                      style={{
                        width: '25px',
                        height: '25px',
                        borderRadius: '35%',
                        margin: '0',
                      }}
                    />
                  ) : (
                    <Image
                      src='https://img.icons8.com/officel/2x/user.png'
                      style={{
                        width: '25px',
                        height: '25px',
                        borderRadius: '35%',
                        margin: '0',
                      }}
                    />
                  )}
                  <NavDropdown
                    title='Dropdown'
                    className='basic-nav-dropdown'
                    variant='light'
                    title='Me'
                  >
                    <NavDropdown.Item
                      onSelect={() => this.props.history.push('/profiles/me')}
                    >
                      My Acc
                    </NavDropdown.Item>
                    <NavDropdown.Item
                      onSelect={async () => {
                        await fetch(
                          process.env.REACT_APP_API + '/api/profile/logout',
                          {
                            method: 'POST',
                            credentials: 'include',
                            headers: {
                              'Access-Control-Allow-Origin': '*',
                            },
                          }
                        )(
                          (window.parent.location = window.parent.location.href)
                        );
                      }}
                      style={{ color: 'red' }}
                    >
                      <Link to=''>Log Out</Link>
                    </NavDropdown.Item>
                  </NavDropdown>

                  <NavDropdown
                    title='Dropdown'
                    className='basic-nav-dropdown navHide'
                    title='Work'
                  >
                    <NavDropdown.Item>Action</NavDropdown.Item>
                  </NavDropdown>

                  <Link className='text-white mr-2 navHide' to='/learning'>
                    <FaVideo />
                    Learning
                  </Link>
                </Nav>
              </Navbar.Collapse>
            </div>
          </div>
        </Navbar>
      </Container>
    );
  }
}

export default withRouter(NavBar);
