import React from "react";
import styled from "styled-components";

import { BubbleWrapper } from "./styled";

const Avatar = styled.img`
  max-height: 20vw;
  
  ${props => props.big && `max-height: 40vw;`}
  
  cursor: pointer;
`;

const AvatarBubble = ({ avatar, onClick }) => (
  <BubbleWrapper
    sender={avatar.isBot ? "jina" : "me"}
    suggestion={avatar.isBot}
  >
    <Avatar
      src={avatar.url}
      big={avatar.big}
      onClick={(event) => onClick(event, avatar.url)}
    />
  </BubbleWrapper>
);

export default AvatarBubble;
