import React, { Component } from "react";
import styled from "styled-components";
import classnames from "classnames";
import { Link, withRouter } from "react-router-dom";

const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  
  height: 6rem;
  
  position: fixed;
  z-index: 9;
  width: 100%;
  
  @media (min-width: 636px) {
    width: 427px;
  }
  
  background: white;
`;

const Switch = styled.div`
  margin-top: .6rem;
  display: flex;
  align-items: center;
`;

const StyledLink = styled(Link)`
  color: black;
  text-decoration: none;
`;

const Icon = styled.i`
  font-size: 1.5rem;
  
  margin: 0 .5rem;
  
  cursor: pointer;
  
  &.active {
    color: #0F90D1;
  }
`;

const Bot = styled.img`
  display: ${props => props.visible ? `block` : `none`};
  width: 3rem;
`;

class Header extends Component {
  render() {
    const { location } = this.props;

    let currentPane = "";

    if (location.pathname === "/profile") {
      currentPane = "profile";
    } else if (location.pathname === "/savedForLater") {
      currentPane = "saved";
    } else if (location.pathname === "/") {
      currentPane = "chat";
    }

    return (
      <HeaderWrapper>
        <Bot src={`/anorak.png`} visible={currentPane === "chat"} />
        <Switch>
          <StyledLink to="/savedForLater">
            <Icon
              className={classnames({
                "fa": true,
                "fa-bookmark": true,
                "active": currentPane === "saved"
              })}
            />
          </StyledLink>
          <StyledLink to="/">
            <Icon
              className={classnames({
                "fa": true,
                "fa-comments": true,
                "active": currentPane === "chat"
              })}
            />
          </StyledLink>
          <StyledLink to="/profile">
            <Icon
              className={classnames({
                "fa": true,
                "fa-user": true,
                "active": currentPane === "profile"
              })}
            />
          </StyledLink>
        </Switch>
      </HeaderWrapper>
    );
  }
}

export default withRouter(Header);
