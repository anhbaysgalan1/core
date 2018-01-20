import React, { Component } from "react";
import styled from "styled-components";

const Overlay = styled.div`
  background-color: rgba(0, 0, 0, .3);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  
  width: 100vw;
  height: 100vh;
  
  z-index: 1000;
`;

const Wrapper = styled.div`
  position: fixed;
  
  top: 50%;
  left: 50%;
  
  transform: translate(-50%, -50%);
  
  width: 95vw;
  height: 95vh;
  
  z-index: 1100;
  
  background: white;
`;

const Header = styled.div`
  display: flex;
  
  background: #0C87B6;
`;

const CloseButton = styled.button`
  font-size: 2rem;
  
  padding: 0 .6rem;
  
  background: transparent;
  
  border: none;
  border-right: 1px solid black;
`;

const Url = styled.p`
  text-align: center;
  width: 100%;
`;

class InAppBrowser extends Component {
  render() {
    return (
      <Overlay>
        <Wrapper>
          <Header>
            <CloseButton><i className={"fa fa-times"} /></CloseButton>
            <Url>{this.props.link}</Url>
          </Header>
          <iframe src={this.props.link} height={"100%"} width={"100%"} />
        </Wrapper>
      </Overlay>
    );
  }
}

export default InAppBrowser;
