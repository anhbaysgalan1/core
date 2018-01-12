import React from "react";

import { BubbleWrapper, Bubble } from "./styled";

const MessageBubble = ({ message, suggestion, onSuggestionClicked }) => (
  <BubbleWrapper sender={message.sender} suggestion={suggestion}>
    <Bubble
      sender={message.sender}
      suggestion={suggestion}
      onClick={event => onSuggestionClicked(event, message)}
    >{message.text}</Bubble>
  </BubbleWrapper>
);

export default MessageBubble;
