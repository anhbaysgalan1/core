import React from "react";
import styled from "styled-components";

const NavigationRow = styled.div`
  display: flex;
  
  align-items: center;
  justify-content: center;
  
  position: relative;
`;

const ContentRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  width: 100%;
  
  padding: 1rem .6rem;
  
  border-top: 1px solid black;
  
  &:last-child {
    border-bottom: 1px solid black;
  }
`;

const Link = styled.a`
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  text-decoration: none;
  
  width: 100%;
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
  top: -52px;
  
  z-index: 10;
  
  background: transparent;
  border: none;
`;

const TrashButton = styled.button`
  width: 3rem;
  text-align: right;
  
  background: transparent;
  border: none;
`;

const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  
  padding-top: 6rem;
`;

const NavigationTitle = styled.h2`
  margin: 0;
`;

const SavedForLater = ({ content, history, onDelete }) => (
  <Wrapper>
    <NavigationRow>
      <BackButton onClick={() => history.push("/")}><i className={"fa fa-chevron-left"} /></BackButton>
      <NavigationTitle>Saved courses</NavigationTitle>
    </NavigationRow>
    {content.map((currentContent, index) => (
      <ContentRow key={index}>
        <Link href={"#"} onClick={() => window.open(currentContent.link, "_system")}>
          <div>
            <Community>{currentContent.community}</Community>
            <Title>{currentContent.title}</Title>
          </div>
          <div>
            <Thumbnail src={currentContent.image || "http://via.placeholder.com/150x100"} />
          </div>
        </Link>
        <TrashButton onClick={() => onDelete(currentContent, index)}>
          <i className="fa fa-trash-o" />
        </TrashButton>
      </ContentRow>
    ))}
  </Wrapper>
);

export default SavedForLater;
