import React, { useState } from "react";
import { Card, Accordion, Row, Col, Image } from "react-bootstrap";

function ChatBox(props) {
  const [message, setMessage] = useState("");

  const sendMessage = () => {
    // e.preventDefault();
    props.socket.emit("chatmessage", {
      text: message,
      to: props.sendToUser,
    });
    props.addMessage({
      from: props.username,
      text: message,
      to: props.sendToUser,
    });
    setMessage("");
  };

  return (
    <div>
      <Accordion defaultActiveKey={props.key} key={props.key}>
        <Card style={{ width: "18rem" }}>
          <Accordion.Toggle eventKey={props.key}>
            <Card.Header>
              <Row className='d-flex align-items-center'>
                <Col sm={3}>
                  <Image fluid src={props.src} />
                </Col>
                <Col sm={9}>
                  <h4>{props.chatName}</h4>
                </Col>
              </Row>
            </Card.Header>
          </Accordion.Toggle>
          <Accordion.Collapse eventKey={props.key}>
            <Card.Body className='p-0'>
              <ul id='messages' style={{ listStyle: "none" }}>
                {props.messages.map((msg, i) => (
                  <>
                    {props.username === msg.from &&
                    msg.to === props.sendToUser ? (
                      <li key={i} className='text-right'>
                        {msg.text}
                      </li>
                    ) : (
                      props.username === msg.to &&
                      msg.from === props.sendToUser && (
                        <li key={i}>{msg.text}</li>
                      )
                    )}
                  </>
                ))}
              </ul>

              <Card.Footer>
                <input
                  autoComplete='off'
                  value={message}
                  onChange={(e) => setMessage(e.currentTarget.value)}
                />
                <button onClick={() => sendMessage()}>Send</button>
              </Card.Footer>
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
    </div>
  );
}

export default ChatBox;
