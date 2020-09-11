import React, { useState, useEffect } from 'react';
import { Card, Badge, Image } from 'react-bootstrap';
import { connect } from 'react-redux';

const mapStateToProps = (state) => state;
const mapDispatchToProps = (dispatch) => ({
  addMessage: (message) =>
    dispatch({
      type: 'ADD_MESSAGES',
      payload: message,
    }),
});

function ChatBox(props) {
  const [message, setMessage] = useState('');
  const [show, setShow] = useState(true);
  const [showNotification, setShowNotification] = useState(false);
  const [nrOfNotifications, setNrOfNotifications] = useState(0);

  const sendMessage = () => {
    // e.preventDefault();
    props.socket.emit('sendMessage', {
      from: props.username,
      text: message,
      to: props.sendToUser,
    });
    props.addMessage({
      from: props.username,
      text: message,
      to: props.sendToUser,
    });
    setMessage('');
  };
  const handleEnter = (e) => {
    if (e.key === 'Enter' && message.length > 1) {
      sendMessage();
    }
  };

  const changeState = () => {
    setNrOfNotifications(0);
    setShowNotification(false);
  };

  useEffect(() => {
    props.socket.on('message', (msg) => {
      const user = props.users.find((us) => us.username === msg.from);
      if (user) {
        props.createChat(user.name, user.username, user.image);
        if (!show && msg.from === props.sendToUser) {
          setNrOfNotifications(nrOfNotifications + 1);
          setShowNotification(true);
        }
      }
    });
    var elem = document.getElementById('messages');
    if (elem) {
      elem.scrollTo(0, document.getElementById('messages').scrollHeight);
    }
  });

  return (
    <>
      <div className='d-flex align-self-end'>
        <Card style={{ width: '18rem' }}>
          <Card.Header
            style={{ backgroundColor: '#283e4a', color: 'white' }}
            className='d-flex align-items-center justify-content-between p-1 pointer'
          >
            <div
              className='d-flex align-items-center justify-content-between p-1 pointer'
              onClick={() => {
                changeState();
                setShow(!show);
              }}
              style={{
                width: '80%',
                height: '45px',
              }}
            >
              <div>
                {props.src ? (
                  <Image
                    fluid
                    src={props.src}
                    style={{
                      borderRadius: '25px',
                      height: '40px',
                      width: '40px',
                    }}
                  />
                ) : (
                  <Image
                    fluid
                    src='https://img.icons8.com/officel/2x/user.png'
                    style={{
                      borderRadius: '25px',
                      height: '40px',
                      width: '40px',
                    }}
                  />
                )}
              </div>
              <div>
                <h4>{props.chatName}</h4>
              </div>
              <div>
                {showNotification && !show && (
                  <Badge variant='warning'>{nrOfNotifications}</Badge>
                )}
              </div>
            </div>
            <div
              style={{
                zIndex: '99',
                paddingRight: '30px',
              }}
            >
              <div onClick={() => props.removeChat(props.chatName)}>X</div>
            </div>
          </Card.Header>

          {show && (
            <Card.Body className='p-0'>
              <ul id='messages' style={{ listStyle: 'none' }}>
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
                  onKeyDown={(e) => handleEnter(e)}
                />
                <button onClick={() => sendMessage()}>Send</button>
              </Card.Footer>
            </Card.Body>
          )}
        </Card>
      </div>
      <div style={{ width: '10px' }}></div>
    </>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatBox);
