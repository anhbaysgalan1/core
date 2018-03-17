import styled, { keyframes } from "styled-components";

const fade = keyframes`
  from {
    opacity: 0;
  }
  
  to {
    opacity: 1;
  }
`;

const flexJustify = (sender) => {
  if (sender === "me") {
    return "flex-end";
  }

  return "flex-start";
}

export const BubbleWrapper = styled.div`
  position: relative;
  
  min-height: 2rem;
  
  display: ${props => props.suggestion || props.link ? "inline-block" : "flex"};
  justify-content: ${props => flexJustify(props.sender)};

  padding-bottom: 1rem;
  
  opacity: 0;
  
  animation: ${fade} 300ms ease;
  animation-fill-mode: forwards;
`;

export const Bubble = styled.div`
  background: ${props => props.sender === "me" ? "#0F90D1" : "#D8D8D8"};
  color: ${props => props.sender === "me" ? "white" : "black"};
  ${props => props.suggestion && `background: #0F90D1;`}
  ${props => props.suggestion && `color: white;`}
      
  border-radius: .6rem .6rem ${props => props.sender === "me" ? "0" : ".6rem"} ${props => props.sender === "me" ? ".6rem" : "0"};
  
  padding: ${props => props.link ? "0 0 .6rem 0" : ".6rem 1rem"};
  margin-right: .5rem;
  
  ${props => props.suggestion && `cursor: pointer; `};
  
  ${props => props.link && `max-width: 51vw;` };
  
  &::before {
    content: "";
    
    position: absolute;
    ${props => props.sender === "me" ? "right" : "left"}: -15px;
  }
`;
