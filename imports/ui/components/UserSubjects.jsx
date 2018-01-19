import React, { Component } from "react";
import styled from "styled-components";

const SubjectWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  
  padding: 0 .8rem;
`;

const Subject = styled.div`
  flex-basis: 49%;
  
  display: flex;
  align-items: center;
  
  margin: .5rem 0;
`;

const Icon = styled.img`
  height: 3.5rem;
  margin-right: .5rem;
`;

class UserSubjects extends Component {
  render() {
    const { subjects } = this.props;

    return(
      <SubjectWrapper>
        {subjects.map((subject, index) => (
          <Subject key={index}>
            <Icon src={`/icons/${subject.slug}.png`} />
            <div>
              <p>{subject.xp}/{subject.xpMax}</p>
              <p>{subject.rank}</p>
            </div>
          </Subject>
        ))}
      </SubjectWrapper>
    );
  }
}

export default UserSubjects;
