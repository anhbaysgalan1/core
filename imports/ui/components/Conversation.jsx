import React, { Component } from "react";
import styled, { keyframes } from "styled-components";
import i18n from "meteor/universe:i18n";

import LinkBubble from "./LinkBubble";

import MessageBubble from "./MessageBubble";
import MessageLinkBubble from "./MessageLinkBubble";
import AvatarBubble from "./AvatarBubble";
import CategoryCarousel from "../containers/CategoryCarousel";

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

  max-height: 92vh;
  
  padding: 7rem .8rem 0rem .8rem;
  
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

  setRef = (wrapper) => {
    this.conversationWrapper = wrapper;
  };

  autoScroll = () => {
    if (this.conversationWrapper) {
      setTimeout(() => {
        this.conversationWrapper.scrollTop = this.conversationWrapper.scrollHeight;
      }, 200);

      // Scrolls conversation 200ms after props update.
      // Hacky way around VirtualDOM/DOM update lag, but couldn't find anything else.
    }
  };

  componentDidUpdate() {
    console.log("Component update");
    this.autoScroll();
  }

  renderSuggestion(suggestion, index) {
    const { onSuggestionClicked } = this.props;

    return (
      <MessageBubble
        key={`suggestion-${index}`}
        message={{ sender: "jina", text: suggestion}}
        onSuggestionClicked={onSuggestionClicked}
        suggestion
      />
    )
  }

  renderLink = (link, index) => {
    return (
      <LinkBubble
        key={`link-${index}`}
        link={link}
        onSaveForLaterClick={this.props.onSaveForLaterClick}
        onReportClick={this.props.onReportClick}
      />
    );
  }

  renderAvatar = (avatar, index, isBot = false) => {
    this.autoScroll();

    return (
      <AvatarBubble
        avatar={{ ...avatar, isBot }}
        onClick={this.props.onAvatarClicked}
        key={index}
      />
    )
  };

  renderSuggestions = (suggestions) => suggestions.map((suggestion, index) => {
    if (typeof suggestion === "object" && suggestion.type && suggestion.type === "image") {
      console.log("Suggestion is avatar", suggestion);
      return this.renderAvatar(suggestion, index, true);
    } else if (typeof suggestion === "object" && suggestion.link) {
      return this.renderLink(suggestion, index);
    }

    return this.renderSuggestion(suggestion, index);
  });

  renderMessage = (message, index) => {
    if (message.link) {
      return (<MessageLinkBubble link={message} key={index} />);
    } else if (message.type && message.type === "image") {
      return this.renderAvatar(message, index, message.hasOwnProperty("isBot") ? message.isBot : false);
    }

    return (<MessageBubble message={message} key={index} />);
  };

  render() {
    const { messages, suggestions, botIsTyping, showCategoryPicker, onPickingOver } = this.props;

    const suggestionComponents = this.renderSuggestions(suggestions);

    return (
      <ConversationWrapper innerRef={(wrapper) => this.setRef(wrapper)}>
        {messages.map((message, index) => this.renderMessage(message, index))}
        {showCategoryPicker && <CategoryCarousel onPickingOver={onPickingOver}/>}
        {suggestionComponents}
        {botIsTyping && <BotIsTyping>{i18n.__("ANORAK_IS_TYPING")}</BotIsTyping>}
      </ConversationWrapper>
    );
  }
}

export default Conversation;
