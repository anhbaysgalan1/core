import React from "react";
import styled from "styled-components";

const BubbleWrapper = styled.div`
  position: relative;
  
  min-height: 2rem;
  
  display: flex;
  justify-content: ${props => props.sender === "me" ? "flex-end" : "flex-start"};

  padding-bottom: 1rem;
`;

const Bubble = styled.div`
  background: ${props => props.sender === "me" ? "#255F85" : "#C5283D"};
    
  max-width: 80%;
  
  color: white;
  font-family: "Open Sans", sans-serif;
  
  border-radius: .3rem;
  
  padding: .3rem 1rem;
  
  &::before {
    content: "";
    
    position: absolute;
    ${props => props.sender === "me" ? "right" : "left"}: -15px;
    
    border-left: solid 10px ${props => props.sender === "me" ? "#255F85" : "transparent"};
    border-right: solid 10px ${props => props.sender === "me" ? "transparent" : "#C5283D"};
    border-top: solid 10px transparent;
    border-bottom: solid 10px transparent;
  }
`;

const MessageBubble = ({ message }) => (
  <BubbleWrapper sender={message.sender}>
    <Bubble sender={message.sender}>{message.text}</Bubble>
  </BubbleWrapper>
);

export default MessageBubble;
