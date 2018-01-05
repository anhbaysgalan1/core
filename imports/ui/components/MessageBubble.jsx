import React from "react";
import styled from "styled-components";

const BubbleWrapper = styled.div`
  position: relative;
  
  min-height: 2rem;
  
  display: ${props => props.suggestion ? `inline-block` : `flex`};
  justify-content: ${props => props.sender === "me" ? "flex-end" : "flex-start"};

  padding-bottom: 1rem;
`;

const Bubble = styled.div`
  background: ${props => props.sender === "me" ? "#0F90D1" : "#D8D8D8"};
  ${props => props.suggestion && `background: #0F90D1;`}
  
  max-width: 80%;
    
  border-radius: .6rem .6rem ${props => props.sender === "me" ? "0" : ".6rem"} ${props => props.sender === "me" ? ".6rem" : "0"};
  
  padding: .6rem 1rem;
  
  ${props => props.suggestion && `cursor: pointer`};
  
  &::before {
    content: "";
    
    position: absolute;
    ${props => props.sender === "me" ? "right" : "left"}: -15px;
  }
`;

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
