import React, { Component } from "react";
import styled from "styled-components";

const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  
  height: 6rem;
  
  position: fixed;
  z-index: 9;
  width: 100%;
  
  background: white;
`;

const Switch = styled.div`
  margin-top: .6rem;
`;

const Icon = styled.img`
  height: 1.5rem;
  
  margin: 0 .5rem;
  
  cursor: pointer;  
`;

const Anorak = styled.img`
  display: ${props => props.visible ? `block` : `none`};
  width: 3rem;
`;

class Header extends Component {
  render() {
    const { location } = this.props;

    let currentPane = "chat";

    if (location.pathname === "/profile") {
      currentPane = "profile";
    } else if (location.pathname === "/savedForLater") {
      currentPane = "saved";
    }

    return (
      <HeaderWrapper>
        <Anorak src={`/anorak.png`} visible={currentPane === "chat"} />
        <Switch>
          <Icon
            src={`/saveforlater${currentPane === "saved" ? `_active` : ``}.png`}
            onClick={() => this.props.history.push("/savedForLater")}
          />
          <Icon
            src={`/chat${currentPane === "chat" ? `_active` : ``}.png`}
            onClick={event => this.props.history.push("/")}
          />
          <Icon
            src={`/user${currentPane === "profile" ? `_active` : ``}.png`}
            onClick={event => this.props.history.push("/profile")}
          />
        </Switch>
      </HeaderWrapper>
    );
  }
}

export default Header;
