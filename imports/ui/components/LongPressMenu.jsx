import React from "react";
import styled from "styled-components";

const Overlay = styled.div`
  &.visible {
    background-color: rgba(0, 0, 0, .3);
    -webkit-backdrop-filter: blur(10px);
    backdrop-filter: blur(10px);
    
    top: 0;
  }
  
  background-color: transparent;
  -webkit-backdrop-filter: blur(0);
  backdrop-filter: blur(0);
  
  transition: all 300ms ease;
  
  position: fixed;
  top: 120vh;
  bottom: 0;
  right: 0;
  left: 0;
  
  width: 100vw;
  height: 100vh;
  
  z-index: 1000;
`;

const MenuWrapper = styled.div`
  position: relative;
  top: 70vh;
  left: 50%;
  
  transform: translateX(-50%);
  
  width: 90vw;
  
  z-index: 1001;
  
  background: white;
  
  border-radius: 10px;
  
  padding: 2rem 3rem 1rem 1rem;
`;

const Link = styled.a`
  display: block;
  
  color: #0F90D1;
  text-decoration: none;
  
  padding-bottom: .8rem;
  margin-bottom: .8rem;
  
  border-bottom: 1px solid black;
  
  &:last-child {
    border: none;
  }
`;

const LongPressMenu = ({ visible, onSaveForLaterClick, onReportClick }) => (
  <span>
    <Overlay className={visible ? "visible" : ""}>
      <MenuWrapper>
        <Link href={"#"} onClick={onSaveForLaterClick}>Save for Later</Link>
        <Link href={"#"} onClick={onReportClick}>Report</Link>
      </MenuWrapper>
    </Overlay>
  </span>
);

export default LongPressMenu;
