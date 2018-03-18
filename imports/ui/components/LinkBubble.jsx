import React, { Component } from "react";
import Truncate from "react-truncate";
import styled from "styled-components";
import classnames from "classnames";

import { BubbleWrapper, Bubble } from "./styled";

const LinkWrapper = styled.a`
  color: black;
  text-decoration: none;
`;

const Thumbnail = styled.img`
  border-top-left-radius: .6rem;  
  border-top-right-radius: .6rem;
 
  width: 100%;
  min-height: 8rem;
`;

const Title = styled.span`
  display: block;
  
  font-size: 1rem;
  margin: .2rem .6rem .4rem .6rem;
`;

const Description = styled.span`
  display: block;
  font-size: .9rem;
  margin: 0 .6rem;
`;

const LinkActions = styled.div`
  display: flex;
  flex-direction: column;
  
  i {
    cursor: pointer;
    margin-bottom: .5rem;
    font-size: 1.3rem;
    
    &.active {
      color: #0F90D1;
    }
  }
`;

class LinkBubble extends Component {
  constructor(props) {
    super(props);

    this.state = {
      liked: false,
      disliked: false,
      saved: props.link.isSavedForLater
    };
  }

  handleLike = () => {
    this.setState({ liked: !this.state.liked }, () => {
      if (this.state.liked && this.state.disliked) {
        this.setState({ disliked: false });
      }
    });
  };

  handleDislike = () => {
    this.setState({ disliked: !this.state.disliked }, () => {
      if (this.state.disliked && this.state.liked) {
        this.setState({ liked: false });
      }
    });
  };

  handleSaveForLater = () => {
    this.setState({ saved: !this.state.saved });

    this.props.onSaveForLaterClick(this.props.link.id);
  };

  render() {
    const { link } = this.props;

    return (
      <BubbleWrapper sender={"anorak"}>
        <LinkWrapper href={"#"} onClick={() => window.open(link.link, "_system")}>
          <Bubble
            sender={"me"}
            suggestion
            link
          >
            <Thumbnail src={link.image} />
            <Title>
              <Truncate lines={2} ellipsis={<span>...</span>}>
                {link.title}
              </Truncate>
            </Title>
            <Description>
              {link.community}
            </Description>
          </Bubble>
        </LinkWrapper>
        <LinkActions>
          <i
            className={classnames({
              "fa": true,
              "fa-thumbs-up": true,
              "active": this.state.liked
            })}
            onClick={this.handleLike}
          />
          <i
            className={classnames({
              "fa": true,
              "fa-thumbs-down": true,
              "active": this.state.disliked
            })}
            onClick={this.handleDislike}
          />
          <i
            className={classnames({
              "fa": true,
              "fa-bookmark": true,
              "active": this.state.saved
            })}
            onClick={this.handleSaveForLater}
          />
        </LinkActions>
      </BubbleWrapper>
    );
  }
}

export default LinkBubble;
