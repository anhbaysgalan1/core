import React, { Component } from "react";
import styled from "styled-components";
import Truncate from "react-truncate";
import { getCategoryBySlug } from "/imports/api/Category";

const SubjectWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  
  padding: 2rem 1.2rem 0 1.2rem;
`;

const Subject = styled.div`
  flex-basis: 49%;
  
  display: flex;
  align-items: center;
  
  margin: 1rem 0;
`;

const Icon = styled.img`
  height: 3.5rem;
`;

const IconWrapper = styled.div`
  width: 44%;
  text-align: center;
  margin-right: .5rem;
`;

const IconCaption = styled.p`
  font-size: .8rem;
  margin: 0 0 .3rem 0;
`;

const Xp = styled.p`
  margin: 0 0 .3rem 0;
  font-size: .9rem;
`;

const Rank = styled.p`
  margin: 0;
  font-size: .9rem;
`;

const SubjectInfo = styled.div`
  width: 70%;
`;

class UserSubjects extends Component {
  render() {
    const { subjects } = this.props;

    return(
      <SubjectWrapper>
        {subjects.map((subject, index) => {
          const currentCategory = getCategoryBySlug(subject.slug);
          return (
            <Subject key={index}>
              <IconWrapper>
                <Icon src={`/icons/${currentCategory.icon}`}/>
              </IconWrapper>
              <SubjectInfo>
                <IconCaption>
                  <Truncate lines={1} ellipsis={<span>...</span>}>{currentCategory.title}</Truncate>
                </IconCaption>
                <Xp>{subject.xp}/{subject.xpMax}</Xp>
                <Rank>{subject.rank}</Rank>
              </SubjectInfo>
            </Subject>
          );
        })}
      </SubjectWrapper>
    );
  }
}

export default UserSubjects;
