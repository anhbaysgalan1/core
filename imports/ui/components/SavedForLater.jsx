import React from "react";
import styled from "styled-components";

const NavigationRow = styled.div`
  display: flex;
  
  align-items: center;
  justify-content: center;
  
  position: relative;
`;

const ContentRow = styled.a`
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  width: 100%;
  
  padding: 1rem .6rem;
  
  border-top: 1px solid black;
  
  text-decoration: none;
  
  &:last-child {
    border-bottom: 1px solid black;
  }
`;

const Community = styled.h4`
  color: #BBA896;
  
  font-size: .9rem;
  font-weight: lighter;
  
  margin: 0 0 .2rem 0;
`;

const Title = styled.h3`
  font-size: 1rem;
  font-weight: normal;
  
  margin: 0;
  
  color: black;
`;


const Thumbnail = styled.img`  
  max-width: 30vw;
  
  margin-left: 2rem;
`;

const BackButton = styled.button`
  color: #0F90D1;
  
  font-size: 1rem;
  
  position: absolute;
  left: 1rem;
  
  background: transparent;
  border: none;
`;

const SavedForLater = ({ content, history }) => (
  <div>
    <NavigationRow>
      <BackButton onClick={() => history.push("/")}><i className={"fa fa-chevron-left"} /></BackButton>
      <h2>Saved courses</h2>
    </NavigationRow>
    {content.map((currentContent, index) => (
      <ContentRow key={index} href={currentContent.link}>
        <div>
          <Community>{currentContent.community}</Community>
          <Title>{currentContent.title}</Title>
        </div>
        <div>
          <Thumbnail src={currentContent.image || "http://via.placeholder.com/150x100"} />
        </div>
      </ContentRow>
    ))}
  </div>
);

export default SavedForLater;
