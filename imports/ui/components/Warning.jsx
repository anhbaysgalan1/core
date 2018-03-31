import styled from "styled-components";

export const WarningWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  
  height: ${props => props.loggedIn ? "40vh" : "80vh"};
`;

export const Warning = styled.h2`
  font-size: 1.4rem;
  text-align: center;
  color: #595757;
  font-weight: lighter;
`;
