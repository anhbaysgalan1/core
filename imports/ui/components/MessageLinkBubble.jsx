import React from "react";
import styled from "styled-components";

import { BubbleWrapper, Bubble } from "./styled";

const LinkWrapper = styled.a`
  color: black;
  text-decoration: none;
  
  display: flex;
  align-items: center;
`;

const StyledBubble = styled(Bubble)`
  max-width: 86vw;
  padding: .6rem 1rem;
`;

const RightArrow = styled.span`
  &:after {
    content: "⟩";
    color: #0F90D1;
    font-size: 1.2rem;
  }
`;

const MessageLinkBubble = ({ link }) => (
  <BubbleWrapper sender={"jina"} link>
    <LinkWrapper href={link.link} target={"_blank"}>
      <StyledBubble
        sender={"jina"}
        link
      >
        {link.text}
      </StyledBubble>
      <RightArrow />
    </LinkWrapper>
  </BubbleWrapper>
);

export default MessageLinkBubble;
