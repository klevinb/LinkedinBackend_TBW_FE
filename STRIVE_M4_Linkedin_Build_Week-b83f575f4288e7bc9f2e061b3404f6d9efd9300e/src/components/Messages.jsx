import React, { Component } from "react";
import { Modal, InputGroup, FormControl, Button } from "react-bootstrap";
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
    onlineUsers: [],
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

    this.socket.on("list", (data) => this.setState({ onlineUsers: data }));
    this.setUsername();
    this.setSendTo();
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
        <div className='App'></div>

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
                  {this.props.username === msg.from &&
                  this.props.sendTo === msg.to ? (
                    <li key={i} className='text-right'>
                      {msg.text}
                    </li>
                  ) : (
                    this.props.username === msg.to &&
                    this.props.sendTo === msg.from && (
                      <li key={i} className='text-left'>
                        {console.log(
                          msg,
                          this.state.sendToUser,
                          this.props.sendTo
                        )}
                        {msg.from} : {msg.text}
                      </li>
                    )
                  )}
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
