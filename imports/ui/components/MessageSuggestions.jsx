import React from "react";
import styled from "styled-components";

const SuggestionWrapper = styled.div`
  width: 100%;
  
  display: flex;
`;

const Button = styled.button`
  flex-basis: 0;
  flex-grow: 1;
  
  padding: .5rem 0;
  
  border: none;
  border-right: 1px solid #bbb;
  
  &:last-child {
    border-right: none;
  }
  
  background: #eee;
`;

const MessageSuggestions = ({ suggestions, onSuggestionClicked }) => (
  <SuggestionWrapper>
    {suggestions.map((suggestion, index) => (
      <Button key={`suggestion-${index}`} onClick={() => onSuggestionClicked(suggestion)}>{suggestion}</Button>
    ))}
  </SuggestionWrapper>
);

export default MessageSuggestions;
