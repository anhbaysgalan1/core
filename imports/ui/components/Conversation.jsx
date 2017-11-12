import React, { Component } from "react";
import styled from "styled-components";

import MessageBubble from "./MessageBubble";

const ConversationWrapper = styled.section`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;

  height: 88vh;
  
  padding: 1rem .8rem 0 .8rem;
  
  overflow-y: scroll;
`;

class Conversation extends Component {
  constructor() {
    super();

    this.conversationWrapper = null;
  }

  componentWillReceiveProps() {
    if (this.conversationWrapper) {
      console.log("Auto-scrolling");

      this.conversationWrapper.scrollTop = this.conversationWrapper.scrollHeight;
    }
  }

  render() {
    const { messages } = this.props;

    return (
      <ConversationWrapper innerRef={wrapper => this.conversationWrapper = wrapper}>
        {messages.map(message => <MessageBubble message={message} />)}
      </ConversationWrapper>
    )
  }
}

export default Conversation;
