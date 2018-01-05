import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import UserAvatar from "./UserAvatar";

const Wrapper = styled.div`
  padding: 0 .8rem;
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

class UserProfile extends Component {
  static propTypes = {
    avatar: PropTypes.String,
    level: PropTypes.String,
    xp: PropTypes.String,
    xpMax: PropTypes.String,
    tokens: PropTypes.String
  }

  render() {
    return (
      <Wrapper>
        <UserSection>
          <UserAvatar avatarUrl={this.props.avatar} completion={1} />
          <UserInfo>
            <p>Level {this.props.level}</p>
            <p>{this.props.xp}/{this.props.xpMax} XP</p>
            <p>{this.props.tokens} tokens</p>
          </UserInfo>
        </UserSection>
      </Wrapper>
    );
  }
}

export default UserProfile;
