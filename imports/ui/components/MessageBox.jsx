import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import i18n from "meteor/universe:i18n";

import Suggestions from "./MessageSuggestions";

const MessageBoxAndSuggestions = styled.div`
  position: fixed;
  bottom: 0;
  
  width: 100%;
  
  background: #eee;
`;

const MessageBoxWrapper = styled.form`
  display: flex;
  width: 100%;
  
  background: #eee;
  border-top: 1px solid #bbb;
  
  padding: 1rem .5rem;
`;

const MessageInput = styled.input`
  background: white;
  
  color: black;
  
  border: none;
  border-radius: 30px;
  outline: none;

  padding: .5rem 1rem;
  
  width: 100%;
`;

const SendButton = styled.input`
  border: none;
  border-radius: 50%;
  
  width: 1.8rem;
  height: 1.8rem;
  
  position: absolute;
  right: .7rem;
  bottom: 1.16rem;
  
  font-family: "FontAwesome";
  font-size: 1rem;
  color: white; 
  
  background: #255F85;
`;

class MessageBox extends Component {
  static propTypes = {
    onSend: PropTypes.func,
    onSuggestionClicked: PropTypes.func,
    isRecordingPassword: PropTypes.bool
  };

  render() {
    return (
      <MessageBoxAndSuggestions>
        <Suggestions
          suggestions={this.props.suggestions}
          onSuggestionClicked={this.props.onSuggestionClicked}
        />
        <MessageBoxWrapper onSubmit={this.props.onSend}>
          <MessageInput
            type={this.props.isRecordingPassword ? `password` : `text`}
            placeholder={i18n.__("MESSAGE_BOX_PLACEHOLDER")}
            value={this.props.message}
            onChange={this.props.onChange}
          />
          <SendButton type={`submit`} value={``}/>
        </MessageBoxWrapper>
      </MessageBoxAndSuggestions>
    );
  }
}

export default MessageBox;
