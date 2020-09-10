import React, { Component } from 'react';
import {
  Card,
  Accordion,
  ListGroup,
  ListGroupItem,
  Row,
  Col,
  Image,
} from 'react-bootstrap';
import io from 'socket.io-client';
import { connect } from 'react-redux';
import { fetchMessagesThunk } from '../utilities';
import ChatBox from './ChatBox';

const mapStateToProps = (state) => state;
const mapDispatchToProps = (dispatch) => ({
  fetchMesagges: (username) => dispatch(fetchMessagesThunk(username)),
  addMessage: (message) =>
    dispatch({
      type: 'ADD_MESSAGES',
      payload: message,
    }),
});

class Messages extends Component {
  socket = null;

  state = {
    onlineUsers: [],
    itemArray: [],
  };

  createChat = (name, username, img) => {
    if (this.state.itemArray.length < 2) {
      const itemArray = this.state.itemArray;
      const user = {
        chatName: name,
        src: img,
        sendToUser: username,
      };

      const find = this.state.itemArray.find(
        (usr) => usr.chatName === user.chatName
      );

      if (!find) {
        itemArray.push(user);
        this.setState({ itemArray });
      }
    } else {
      const itemArray = this.state.itemArray;

      const user = {
        chatName: name,
        src: img,
        sendToUser: username,
      };

      const find = this.state.itemArray.find(
        (usr) => usr.chatName === user.chatName
      );

      if (!find) {
        itemArray[1] = user;
        this.setState({ itemArray });
      }
    }
  };

  removeChat = (chatName) => {
    const itemArray = this.state.itemArray.filter(
      (chat) => chat.chatName !== chatName
    );

    this.setState({ itemArray });
  };

  componentDidMount = () => {
    const connectionOpt = {
      transports: ['websocket'],
    };
    this.socket = io('http://localhost:3008', connectionOpt);
    this.socket.on('message', (msg) => {
      this.props.fetchMesagges(this.props.username);
    });

    this.socket.on('online', (data) => {
      this.setState({ onlineUsers: data });
    });
    this.setUsername();
  };

  setUsername = () => {
    console.log(this.props.username);
    this.socket.emit('setUsername', {
      username: this.props.username,
    });
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState.itemArray !== this.state.itemArray) {
      this.setState({ itemArray: this.state.itemArray });
    }
    if (prevProps.username !== this.props.username) {
      this.setUsername();
    }
  }

  render() {
    return (
      <>
        {this.props.username && (
          <div className='App Chat'>
            <Accordion id='chatRoom'>
              <Card className='flex-column-reverse'>
                <Card.Header>
                  <Accordion.Toggle eventKey='0'>
                    {this.props.userImage[0].image ? (
                      <Image src={this.props.userImage[0].image} />
                    ) : (
                      <Image src='https://img.icons8.com/officel/2x/user.png' />
                    )}
                    {`Messaging `}
                  </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey='0'>
                  <Card.Body className='p-0'>
                    <ListGroup>
                      {this.state.onlineUsers &&
                        this.state.onlineUsers
                          .filter((user) => user !== this.props.username)
                          .map((userName, key) => {
                            const currentUser = this.props.users.find(
                              (user) => user.username === userName
                            );
                            if (!currentUser)
                              return (
                                <ListGroupItem
                                  className='d-flex justify-self-center text-center'
                                  style={{ fontSize: '12px' }}
                                >
                                  user not found
                                </ListGroupItem>
                              );

                            return (
                              <ListGroupItem key={key}>
                                <div
                                  className='onlineUser'
                                  onClick={() =>
                                    this.createChat(
                                      currentUser.name,
                                      currentUser.username,
                                      currentUser.image
                                    )
                                  }
                                >
                                  {currentUser.image ? (
                                    <Image fluid src={currentUser.image} />
                                  ) : (
                                    <Image
                                      fluid
                                      src='https://img.icons8.com/officel/2x/user.png'
                                    />
                                  )}

                                  <p>
                                    {currentUser.name} {currentUser.surname}
                                  </p>
                                </div>
                              </ListGroupItem>
                            );
                          })}
                    </ListGroup>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>
            <div>
              <div className='chat-box d-flex'>
                {this.state.itemArray.map((item, key) => {
                  return (
                    <ChatBox
                      key={key}
                      username={this.props.username}
                      removeChat={this.removeChat}
                      sendToUser={item.sendToUser}
                      chatName={item.chatName}
                      src={item.src}
                      messages={this.props.messages}
                      socket={this.socket}
                      addMessage={this.props.addMessage}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Messages);
