import React from "react";
import styled from "styled-components";

import { BubbleWrapper } from "./styled";

const Avatar = styled.img`
  max-height: 20vw;
  
  cursor: pointer;
`;

const AvatarBubble = ({ avatar, onClick }) => (
  <BubbleWrapper sender={"me"} suggestion>
    <Avatar src={avatar.url} onClick={(event) => onClick(event, avatar.url)} />
  </BubbleWrapper>
);

export default AvatarBubble;
