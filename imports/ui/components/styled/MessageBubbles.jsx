import styled from "styled-components";

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
`;

export const Bubble = styled.div`
  background: ${props => props.sender === "me" ? "#0F90D1" : "#D8D8D8"};
  ${props => props.suggestion && `background: #0F90D1;`}
      
  border-radius: .6rem .6rem ${props => props.sender === "me" ? "0" : ".6rem"} ${props => props.sender === "me" ? ".6rem" : "0"};
  
  padding: ${props => props.link ? "0 0 .6rem 0" : ".6rem 1rem"};
  margin-right: .5rem;
  
  ${props => props.suggestion && `cursor: pointer; `};
  
  ${props => props.link && `max-width: 28vw;` };
  
  &::before {
    content: "";
    
    position: absolute;
    ${props => props.sender === "me" ? "right" : "left"}: -15px;
  }
`;
