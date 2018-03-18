import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import UserAvatar from "./UserAvatar";

const Wrapper = styled.div`
  padding: 7rem .8rem 0 .8rem;
`;

const UserInfo = styled.div`
  background: #D8D8D8;
  width: 100%;
  height: 4.5rem;
  margin-left: 2rem;
  text-align: center;
  line-height: .3rem;
  font-size: 1rem;
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
`;

const Progress = styled.progress`
  margin-top: 4px;
  
  &[value] {
    height: 10px;
    background: transparent;
    border-radius: 4px;
    border: 1px solid #0F90D1;
  }
  
  &[value]::-webkit-progress-value {
    background: #0F90D1;
  }
`;

class UserProfile extends Component {
  static propTypes = {
    avatar: PropTypes.string,
    level: PropTypes.number,
    xp: PropTypes.number,
    xpMax: PropTypes.number,
    tokens: PropTypes.number
  };

  render() {
    return (
      <Wrapper>
        <UserSection>
          <UserAvatar avatarUrl={this.props.avatar} completion={1} />
          <UserInfo>
            <p>Level {this.props.level}</p>
            <p style={{ marginBottom: "10px" }}>{this.props.xp}/{this.props.xpMax} XP — {this.props.tokens} tokens</p>
            <Progress value={parseInt(this.props.xp) * 100 / parseInt(this.props.xpMax)} max={100}>
              {parseInt(this.props.xp) * 100 / parseInt(this.props.xpMax)}%
            </Progress>
          </UserInfo>
        </UserSection>
      </Wrapper>
    );
  }
}

export default UserProfile;
