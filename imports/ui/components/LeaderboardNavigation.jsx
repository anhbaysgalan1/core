import React from "react";
import styled from "styled-components";

const IconWrapper = styled.div`
  width: 5rem;
  
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  position: absolute;
  bottom: 4rem;
  left: 50%;
  transform: translateX(-50%);
`;

const Icon = styled.img`
  height: 2rem;
`;

const LeaderboardNavigation = ({ onIconClick, currentPane }) => (
  <IconWrapper>
    <Icon
      src={`/leaderboard_skills${currentPane === "skills" ? "_active" : ""}.png`}
      onClick={() => onIconClick("skills")}
    />
    <Icon
      src={`/leaderboard_content_providers${currentPane === "contentProviders" ? "_active" : ""}.png`}
      onClick={() => onIconClick("contentProviders")}
    />
  </IconWrapper>
);

export default LeaderboardNavigation;
