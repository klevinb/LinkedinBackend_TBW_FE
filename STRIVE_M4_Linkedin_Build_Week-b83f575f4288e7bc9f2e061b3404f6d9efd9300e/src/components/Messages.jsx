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
    const itemArray = [];
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
                  <ListGroup>
                    {this.state.onlineUsers &&
                      this.state.onlineUsers
                        .filter((user) => user !== this.props.username)
                        .map((userName) => (
                          <ListGroupItem>
                            <Row
                              onClick={() =>
                                this.createChat(
                                  this.props.users.filter(
                                    (user) => user.username === userName
                                  )[0].name,
                                  this.props.users.filter(
                                    (user) => user.username === userName
                                  )[0].image
                                )
                              }
                            >
                              <Col sm={3}>
                                <Image
                                  fluid
                                  src={
                                    this.props.users.filter(
                                      (user) => user.username === userName
                                    )[0].image
                                  }
                                />
                              </Col>
                              <Col sm={9}>
                                {
                                  this.props.users.filter(
                                    (user) => user.username === userName
                                  )[0].name
                                }{" "}
                                {
                                  this.props.users.filter(
                                    (user) => user.username === userName
                                  )[0].surname
                                }
                              </Col>
                            </Row>
                          </ListGroupItem>
                        ))}
                  </ListGroup>
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          </Accordion>
          <div>
            {this.state.itemArray.map((item, index) => {
              return (
                <div className='chat-box' key={index}>
                  <Accordion defaultActiveKey='0'>
                    <Card style={{ width: "18rem" }}>
                      <Accordion.Toggle eventKey='0'>
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
                      <Accordion.Collapse eventKey='0'>
                        <Card.Body className='p-0'>
                          <ul id='messages' style={{ listStyle: "none" }}>
                            {this.props.messages.map((msg, i) => (
                              <>
                                {this.props.username === msg.from &&
                                msg.to === "klevinb" ? (
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

        <Modal show={this.props.show} onHide={this.props.toggleModal}>
          <Modal.Title>
            <div className='ml-4 mt-2'>Set Username</div>
          </Modal.Title>
          <Modal.Header>
            <input
              autoComplete='off'
              value={this.state.message}
              onChange={this.setMessage}
            />
            <button onClick={() => this.sendMessage()}>Send</button>
          </Modal.Header>
          <Modal.Body>
            <ul id='messages'>
              {this.props.messages.map((msg, i) => (
                <>
                  <li key={i}>{msg.text}</li>
                </>
              ))}
            </ul>
            <ul>
              {this.state.onlineUsers.map((user) => (
                <li>{user}</li>
              ))}
            </ul>
          </Modal.Body>
          <Modal.Footer>
            <Button
              onClick={() => {
                this.props.toggleModal();
                this.sendMessage();
              }}
            >
              Submit
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Messages);
