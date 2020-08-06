import React, { Component } from "react";
import { Container, Row } from "react-bootstrap";
import Jumbotron from "./Jumbotron";
import SideContent from "./SideContent";
import UserContent from "./UserContent";
import Experiences from "./Experiences";
import { Col, Spinner, Button } from "react-bootstrap";
import "./MainCss.css";

const apiKey = process.env.REACT_APP_API;

class Content extends Component {
  state = {
    userInfo: "",
    userId: this.props.match.params.userID,
    loading: true,
  };

  fetchFunction = async () => {
    let resp = await fetch(apiKey + "/api/profile/" + this.state.userId, {
      headers: new Headers({
        "Authorization": "Bearer " + this.props.authoKey,
        "Content-Type": "application/json",
      }),
    });

    if (resp.ok) {
      let respObj = await resp.json();
      this.setState({
        userInfo: respObj,
        loading: false,
      });
      this.props.getUserImg(this.state.userInfo.image);
    }
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (prevState.userId !== this.props.match.params.userID) {
      this.setState(
        {
          userId: this.props.match.params.userID,
        },
        () => {
          this.fetchFunction();
          this.props.getUserImg(this.state.userInfo.image);
        }
      );
      // doing the fetch again
      // save userInfo in the state
    } else if (prevState.userInfo !== this.state.userInfo) {
      this.setState({
        userInfo: this.state.userInfo,
      });
    }
  };

  refetch = async () => {
    await this.fetchFunction();
    this.props.getUserImg(this.state.userInfo.image);
  };

  componentDidMount = () => {
    this.fetchFunction();
  };

  render() {
    return (
      <Container className='content mt-4 mb-4'>
        {this.state.loading && (
          <div
            className='d-flex justify-content-center align-items-center'
            style={{ width: "100%", height: "100vh" }}
          >
            <Spinner
              style={{ fontSize: "200px" }}
              animation='grow'
              variant='secondary'
            />
          </div>
        )}
        <Row>
          {this.state.userInfo && (
            <>
              <Col md={9} className='d-flex flex-column mb-3 '>
                <Jumbotron
                  refetch={this.refetch}
                  username={this.props.username}
                  authoKey={this.props.authoKey}
                  profileInfo={this.state.userInfo}
                />
                <UserContent
                  username={this.props.username}
                  profileInfo={this.state.userInfo}
                />
                {this.state.userId === "me" ? (
                  <Experiences
                    username={this.props.username}
                    authoKey={this.props.authoKey}
                    userID={this.props.username}
                  />
                ) : (
                  <Experiences
                    username={this.props.username}
                    authoKey={this.props.authoKey}
                    userID={this.state.userId}
                  />
                )}
              </Col>
              <Col md={3} className='sideContent pl-4 pt-4'>
                <SideContent
                  props={this.props}
                  username={this.props.username}
                  authoKey={this.props.authoKey}
                />
              </Col>
            </>
          )}
        </Row>
      </Container>
    );
  }
}
export default Content;
