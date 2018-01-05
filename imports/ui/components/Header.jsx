import React, { Component } from "react";
import ReactSVG from "react-svg";
import styled from "styled-components";

const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  
  height: 6rem;
`;

const Switch = styled.div`
  margin-top: .6rem;
`;

const Icon = styled.img`
  width: 1.5rem;
  
  margin: 0 .5rem;
  
  cursor: pointer;  
`;

const Anorak = styled.img`
  display: ${props => props.visible ? `block` : `none`};
`;

class Header extends Component {
  render() {
    console.log(this.props);

    const { location } = this.props;

    const currentPane = location.pathname === "/profile" ? "profile" : "chat";

    return (
      <HeaderWrapper>
        <Anorak src={`/anorak.png`} visible={currentPane === "chat"} />
        <Switch>
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
