import React, { Component } from "react";
import PropTypes from "prop-types";
import styled, { keyframes } from "styled-components";

const rightSpin = keyframes`
  from {
   transform: rotate(0deg);
  }
  to {
    transform: rotate(180deg);
  }
`;

const leftSpin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const closeWrapper = keyframes`
  to {
    clip: rect(auto, auto, auto, auto);
  }
`;

const Wrapper = styled.div`
  background: white;
  
  width: 5rem;
  height: 5rem;
  
  position: absolute;
  
  clip: rect(0, 5rem, 5rem, 0);
  
  border-radius: 50%;
  
  animation-iteration-count: 1;  /* Only run once */
  animation-fill-mode: forwards; /* Hold the last keyframe */
  animation-timing-function: ease; /* Linear animation */
  
  animation-duration: 0.01s; /* Complete keyframes asap */
  animation-delay: .5s; /* Wait half of the animation */
  animation-name: ${closeWrapper}; /* Keyframes name */
`;

const Circle = styled.div`
  width: 5rem;
  height: 5rem;
  border: 2px solid #0F90D1;
  border-radius: 50%;
  position: absolute;
  clip: rect(0, 3rem, 5rem, 0);
  
  animation-iteration-count: 1;  /* Only run once */
  animation-fill-mode: forwards; /* Hold the last keyframe */
  animation-timing-function: ease; /* Linear animation */
  
  ${props => props.left && `
    animation-duration: 1s; /* Full animation time */
    animation-name: ${leftSpin};
  `}
  
  ${props => props.right && `
    animation-duration: .5s; /* Half animation time */
    animation-name: ${rightSpin};
  `}
`;

const Avatar = styled.img`
  width: 5rem;
`;

class UserAvatar extends Component {
  static propTypes = {
    avatarUrl: PropTypes.string,
    completion: PropTypes.number
  }

  render() {
    return (
      <Wrapper>
        <Circle left />
        <Circle right />
        <Avatar src={this.props.avatarUrl} />
      </Wrapper>
    );
  }
}

export default UserAvatar;
