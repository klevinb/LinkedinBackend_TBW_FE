import React from "react";
import { Col } from "react-bootstrap";
import { RiPencilLine } from "react-icons/ri";

function UserContent(props) {
  return (
    <>
      <div className='mainContent p-4 mt-5 mb-4 box-shadow '>
        <div className='d-flex justify-content-between'>
          <h4>About</h4>
          <div>
            {props.profileInfo.username === props.username && <RiPencilLine />}
          </div>
        </div>
        <div>
          {props.profileInfo.about ? (
            <p>{props.profileInfo.about}</p>
          ) : (
            <p>This user do not have about infos.</p>
          )}
        </div>
      </div>
    </>
  );
}

export default UserContent;
