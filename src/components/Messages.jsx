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
    console.log(this.state.onlineUsers);
    const itemArray = this.state.itemArray;

    const chatName = name;
    const src = img;
    const sendToUser = username;
    itemArray.push({ chatName, sendToUser, src });
    this.setState({ itemArray });
  };

  componentDidMount = () => {
    const connectionOpt = {
      transports: ['websocket'],
    };
    this.socket = io('https://striveschool.herokuapp.com/', connectionOpt);
    this.socket.on('chatmessage', (msg) => {
      this.props.fetchMesagges(this.props.username);
    });

    this.socket.on('list', (data) => {
      this.setState({ onlineUsers: data });
    });
    this.setUsername();
  };

  setUsername = () => {
    this.socket.emit('setUsername', {
      username: this.props.username,
    });
  };

  render() {
    return (
      <>
        {this.props.username && (
          <div className='App Chat'>
            <Accordion id='chatRoom'>
              <Card className='flex-column-reverse'>
                <Card.Header>
                  <Accordion.Toggle eventKey='0'>
                    <Image src={this.props.userImage[0].image} />
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
                            if (!currentUser) return <div>user not found</div>;

                            return (
                              <ListGroupItem key={key}>
                                <Row
                                  onClick={() =>
                                    this.createChat(
                                      currentUser.name,
                                      currentUser.username,
                                      currentUser.image
                                    )
                                  }
                                >
                                  <Col sm={3}>
                                    <Image fluid src={currentUser.image} />
                                  </Col>
                                  <Col sm={9}>
                                    {currentUser.name} {currentUser.surname}
                                  </Col>
                                </Row>
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
