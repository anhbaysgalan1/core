import React, { Component } from "react";
import styled from "styled-components";
import classnames from "classnames";

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
  display: flex;
  align-items: center;
`;

const Icon = styled.i`
  font-size: 1.5rem;
  
  margin: 0 .5rem;
  
  cursor: pointer;
  
  &.active {
    color: #0F90D1;
  }
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
            className={classnames({
              "fa": true,
              "fa-bookmark": true,
              "active": currentPane === "saved"
            })}
            onClick={() => this.props.history.push("/savedForLater")}
          />
          <Icon
            className={classnames({
              "fa": true,
              "fa-comments": true,
              "active": currentPane === "chat"
            })}
            onClick={() => this.props.history.push("/")}
          />
          <Icon
            className={classnames({
              "fa": true,
              "fa-user": true,
              "active": currentPane === "profile"
            })}
            onClick={() => this.props.history.push("/profile")}
          />
        </Switch>
      </HeaderWrapper>
    );
  }
}

export default Header;
