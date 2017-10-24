import React from "react";
import styled from "styled-components";

import MessageBubble from "./MessageBubble";

const ConversationWrapper = styled.section`
  height: 100vh;
  padding: 1rem .8rem 0 .8rem;
`;

const Conversation = ({ messages }) => (
  <ConversationWrapper>
    {messages.map(message => <MessageBubble message={message} />)}
  </ConversationWrapper>
);

export default Conversation;
