import React, { Component } from "react";
import Slider from "react-slick";
import styled from "styled-components";

const CategoryWrapper = styled.div`
  position: relative;
  
  ${props => props.checked && `
    ::before {
      content: "";
      
      display: block;
      
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      
      height: 100%;
      
      background: rgba(15,144,209, .4);
    }
    
    &::after {
      content: "";
      position: absolute;
      display: block;
      width: 10px;
      height: 20px;
      border: solid #fff;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
      top: 44%;
      left: 46%;
    }
  `}
`;

const Category = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
    
  padding: 1rem .5rem;
  
  text-align: center;
`;

const CategoryIcon = styled.img`
  height: 6rem;
  
  margin-bottom: 2rem;
`;

const CategoryTitle = styled.span`
  height: 2.5rem;
`;

const CategoryCarousel = ({ categories, checkedCategories, onCategoryClick }) => {
  const settings = {
    dots: false,
    slidesToShow: 3,
    swipeToSlide: true
  };

  console.log("checkedCategories", checkedCategories);

  return (
    <div>
      <Slider {...settings}>
        {categories
          .filter(current => !current.hasOwnProperty("hideAtOnboarding"))
          .map((current) => (
          <CategoryWrapper
            key={current.slug}
            onClick={() => onCategoryClick(current.slug)}
            checked={checkedCategories.includes(current.slug)}
          >
            <Category>
              <CategoryIcon src={`/icons/${current.icon}`} />
              <CategoryTitle>{current.title}</CategoryTitle>
            </Category>
          </CategoryWrapper>
        ))}
      </Slider>
      <span>{checkedCategories.length < 6 ? `${6 - checkedCategories.length} categories to go!` : `Well done.`}</span>
    </div>
  );
};

export default CategoryCarousel;
