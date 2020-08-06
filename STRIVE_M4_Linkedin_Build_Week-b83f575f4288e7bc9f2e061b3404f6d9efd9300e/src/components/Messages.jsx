import React, { Component } from "react";
import {
  Modal,
  Card,
  Accordion,
  Button,
  ListGroup,
  ListGroupItem,
  Row,
  Col,
  Image,
} from "react-bootstrap";
import io from "socket.io-client";
import { connect } from "react-redux";
import { fetchMessagesThunk } from "../utilities";

const mapStateToProps = (state) => state;
const mapDispatchToProps = (dispatch) => ({
  fetchMesagges: (username) => dispatch(fetchMessagesThunk(username)),
  addMessage: (message) =>
    dispatch({
      type: "ADD_MESSAGES",
      payload: message,
    }),
});

class Messages extends Component {
  socket = null;

  state = {
    message: "",
    to: "",
    onlineUsers: [],
    itemArray: [],
  };

  createChat = (name, img) => {
    const itemArray = this.state.itemArray;
    const chatName = name;
    const src = img;

    itemArray.push({ chatName, src });

    this.setState({ itemArray });
  };

  componentDidMount = () => {
    console.log("HERE");
    const connectionOpt = {
      transports: ["websocket"],
    };
    this.socket = io("https://striveschool.herokuapp.com/", connectionOpt);
    this.socket.on("chatmessage", (msg) => {
      this.props.fetchMesagges(this.props.username);
    });

    this.socket.on("list", (data) => {
      this.setState({ onlineUsers: data });
      console.log(data);
    });
    this.setUsername();
  };

  setUsername = () => {
    this.socket.emit("setUsername", {
      username: this.props.username,
    });
  };
  setSendTo = () => {
    this.setState({
      sendToUser: this.props.sendTo,
    });
  };

  setMessage = (e) => {
    this.setState({
      message: e.currentTarget.value,
    });
  };

  sendMessage = () => {
    // e.preventDefault();

    this.socket.emit("chatmessage", {
      text: this.state.message,
      to: this.state.sendToUser,
    });
    this.props.addMessage({
      from: this.props.username,
      text: this.state.message,
      to: this.props.sendTo,
    });
    this.setState({
      message: "",
    });
  };

  render() {
    return (
      <>
        <div className='App'>
          <Accordion id='chatRoom'>
            <Card style={{ width: "300px" }} className='flex-column-reverse'>
              <Card.Header>
                <Accordion.Toggle eventKey='0'>{`Online (${
                  this.state.onlineUsers.filter(
                    (user) => user !== this.props.username
                  ).length
                })`}</Accordion.Toggle>
              </Card.Header>
              <Accordion.Collapse eventKey='0'>
                <Card.Body className='p-0'>
                  {console.log(this.props.username)}
                  <ListGroup>
                    {this.state.onlineUsers &&
                      this.state.onlineUsers
                        .filter((user) => user !== this.props.username)
                        .map((userName) => {
                          const currentUser = this.props.users.find(
                            (user) => user.username === userName
                          );
                          if (!currentUser) return <div>user not found</div>;

                          return (
                            <ListGroupItem>
                              <Row
                                onClick={() =>
                                  this.createChat(
                                    currentUser.name,
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
              {this.state.itemArray.map((item, index) => {
                return (
                  <div>
                    <Accordion defaultActiveKey={index} key={index}>
                      <Card style={{ width: "18rem" }}>
                        <Accordion.Toggle eventKey={index}>
                          <Card.Header>
                            <Row className='d-flex align-items-center'>
                              <Col sm={3}>
                                <Image fluid src={item.src} />
                              </Col>
                              <Col sm={9}>
                                <h4>{item.chatName}</h4>
                              </Col>
                            </Row>
                          </Card.Header>
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey={index}>
                          <Card.Body className='p-0'>
                            <ul id='messages' style={{ listStyle: "none" }}>
                              {this.props.messages.map((msg, i) => (
                                <>
                                  {this.props.username === msg.from &&
                                  msg.to === "eriseldk" ? (
                                    <li key={i} className='text-right'>
                                      {msg.text}
                                    </li>
                                  ) : (
                                    this.props.username === msg.to &&
                                    msg.from === "klevinb" && (
                                      <li key={i}>{msg.text}</li>
                                    )
                                  )}
                                </>
                              ))}
                            </ul>

                            <Card.Footer>
                              <input
                                autoComplete='off'
                                value={this.state.message}
                                onChange={this.setMessage}
                              />
                              <button onClick={() => this.sendMessage()}>
                                Send
                              </button>
                            </Card.Footer>
                          </Card.Body>
                        </Accordion.Collapse>
                      </Card>
                    </Accordion>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Messages);
