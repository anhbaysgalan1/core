import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import i18n from "meteor/universe:i18n";

import Suggestions from "./MessageSuggestions";

const MessageBoxAndSuggestions = styled.div`
  position: fixed;
  bottom: 0;
  
  width: 100%;
`;

const MessageBoxWrapper = styled.form`
  display: flex;
  align-items: center;
  
  width: 100%;
  
  background: white;
  
  padding: .5rem .4rem;
`;

const MessageInput = styled.input`
  border: 1px solid #C7C7CC;
  
  color: black;
  
  border-radius: 30px;
  outline: none;

  padding: .5rem 1rem;
  margin-left: .5rem;
  
  width: 100%;
`;

const RoundButton = styled.button`
  border: none;
  border-radius: 50%;
  
  width: 1.8rem;
  height: 1.8rem;
  
  ${props => props.right && `position: absolute;`}
  ${props => props.right ? `right` : `left`}: .7rem;
  bottom: .7rem;
  
  padding: 0;
  
  ${props => props.isOpen && `transform: rotate(-90deg);`}
  
  transition: all 300ms ease;
  
  img {
    width: 100%;
    height: 100%;
  }
`;

const MoreMenu = styled.nav`  
  width: 3rem;
  
  margin-left: .4rem;
  
  background: white;
  
  button {
    opacity: ${props => props.isOpen ? `1` : `0`};
    
    transition-property: opacity;
    transition-duration: 300ms;
    transition-timing-function: ease;
    
    margin: .3rem 0;
  }
  
  //&.visible button {
  //  opacity: 1;
  //}
  
  ${Array(10).join(0).split(0).reverse().map((item, index) => `
    button:nth-child(${index}) {
      transition-delay: ${index * 100}ms;
    }
  `)}
`;

class MessageBox extends Component {
  static propTypes = {
    onSend: PropTypes.func,
    onSuggestionClicked: PropTypes.func,
    isRecordingPassword: PropTypes.bool
  };

  constructor() {
    super();

    this.state = {
      isMoreMenuOpen: false
    };

    this.toggleMoreMenu = this.toggleMoreMenu.bind(this);
  }

  toggleMoreMenu(event) {
    event.preventDefault();

    console.log("Toggle more menu");

    this.setState({ isMoreMenuOpen: !this.state.isMoreMenuOpen });
  }

  render() {
    return (
      <MessageBoxAndSuggestions>
        {/*<Suggestions*/}
          {/*suggestions={this.props.suggestions}*/}
          {/*onSuggestionClicked={this.props.onSuggestionClicked}*/}
        {/*/>*/}
        <MoreMenu isOpen={this.state.isMoreMenuOpen}>
          <RoundButton onClick={this.toggleMoreMenu}>
            <img src={`/settings.svg`} />
          </RoundButton>
          <RoundButton onClick={this.toggleMoreMenu}>
            <img src={`/saveforlater.svg`} />
          </RoundButton>
          <RoundButton onClick={this.toggleMoreMenu}>
            <img src={`/notifications.svg`} />
          </RoundButton>
        </MoreMenu>
        <MessageBoxWrapper onSubmit={this.props.onSend}>
          <RoundButton
            onClick={this.toggleMoreMenu}
            isOpen={this.state.isMoreMenuOpen}
            type={`button`}
          >
            <img src={`/more.svg`} />
          </RoundButton>
          <MessageInput
            type={this.props.isRecordingPassword ? `password` : `text`}
            placeholder={i18n.__("MESSAGE_BOX_PLACEHOLDER")}
            value={this.props.message}
            onChange={this.props.onChange}
          />
          <RoundButton type={`submit`} right>
            <img src={`/send.svg`} />
          </RoundButton>
        </MessageBoxWrapper>
      </MessageBoxAndSuggestions>
    );
  }
}

export default MessageBox;