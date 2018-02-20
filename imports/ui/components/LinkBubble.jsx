import React from "react";
import Truncate from "react-truncate";
import styled from "styled-components";

import ClickAndHold from "react-click-n-hold";

import { BubbleWrapper, Bubble } from "./styled";

const LinkWrapper = styled.a`
  color: black;
  text-decoration: none;
`;

const Thumbnail = styled.img`
  border-top-left-radius: .6rem;  
  border-top-right-radius: .6rem;
 
  width: 100%;
  min-height: 8rem;
`;

const Title = styled.span`
  display: block;
  
  font-size: 1rem;
  margin: .2rem .6rem .4rem .6rem;
`;

const Description = styled.span`
  display: block;
  font-size: .9rem;
  margin: 0 .6rem;
`;

const LinkBubble = ({ link, onLongPress, onClickStop }) => (
  <BubbleWrapper sender={"anorak"}>
    <ClickAndHold onEnd={onClickStop} onClickNHold={onLongPress} time={1}>
      <LinkWrapper href={"#"} onClick={() => window.open(link.link, "_system")}>
        <Bubble
          sender={"me"}
          suggestion
          link
        >
          <Thumbnail src={link.image} />
          <Title>
            <Truncate lines={2} ellipsis={<span>...</span>}>
              {link.title}
            </Truncate>
          </Title>
          <Description>
            {link.community}
          </Description>
        </Bubble>
      </LinkWrapper>
    </ClickAndHold>
  </BubbleWrapper>
);

export default LinkBubble;
