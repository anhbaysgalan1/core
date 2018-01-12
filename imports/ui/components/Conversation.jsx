import React, { Component } from "react";
import styled, { keyframes } from "styled-components";
import i18n from "meteor/universe:i18n";

import MessageBubble from "./MessageBubble";
import LinkBubble from "./LinkBubble";

const ellipsis = keyframes`
  to {
    width: 1.25rem;
    opacity: 1;    
  }
`;

const ConversationWrapper = styled.section`
  position: absolute;
  left: 0;
  right: 0;

  max-height: 88vh;
  
  padding: 1rem .8rem 2rem .8rem;
  
  overflow-y: scroll;
`;

const BotIsTyping = styled.p`
  position: fixed;
  bottom: 3rem;
  left: 1rem;
  
  font-size: .9rem;
  
  &:after {
    opacity: 0;
    overflow: hidden;
    display: inline-block;
    vertical-align: bottom;
    animation: ${ellipsis} 1200ms infinite;
    content: "\\2026"; // Ascii code for the ellipsis character
    width: 0;
  }
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

  renderSuggestion(suggestion) {
    const { onSuggestionClicked } = this.props;

    return (
      <MessageBubble
        message={{ sender: "jina", text: suggestion}}
        onSuggestionClicked={onSuggestionClicked}
        suggestion
      />
    )
  }

  renderLink = (link) => (
    <LinkBubble link={link} />
  )

  render() {
    const { messages, suggestions, botIsTyping } = this.props;

    return [
      <ConversationWrapper innerRef={wrapper => this.conversationWrapper = wrapper}>
        {messages.map(message => <MessageBubble message={message} />)}
        {suggestions.map(suggestion =>
          typeof suggestion === "string" ? this.renderSuggestion(suggestion) : this.renderLink(suggestion)
        )}
        {botIsTyping && <BotIsTyping>{i18n.__("ANORAK_IS_TYPING")}</BotIsTyping>}
      </ConversationWrapper>
    ]
  }
}

export default Conversation;
