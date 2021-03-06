import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import i18n from "meteor/universe:i18n";

const MessageBoxAndSuggestions = styled.div`
  position: fixed;
  bottom: 0;
  
  width: 100%;
  
  @media (min-width: 636px) {
    width: 427px;
  }
`;

const MessageBoxWrapper = styled.form`
  display: flex;
  align-items: center;
  
  width: 100%;
  
  background: white;
  
  padding: .5rem .4rem;
`;

const MessageInput = styled.input`
  border: 1px solid #C7C7CC;
  
  color: black;
  
  border-radius: 30px;
  outline: none;

  padding: .5rem 1rem;
  margin-left: .5rem;
  
  width: 100%;
`;

const RoundButton = styled.a`
  display: block;
  
  border: none;
  border-radius: 50%;
  
  width: 36px;
  height: 36px;
  
  ${props => props.right && `position: absolute;`}
  ${props => props.right ? `right` : `left`}: .9rem;
  bottom: .9rem;
  
  padding: 0;
  
  ${props => props.isOpen && `transform: rotate(-90deg);`}
  
  transition: all 300ms ease;
  
  color: white;
  text-decoration: none;
  
  img {
    height: 100%;
  }
`;

const RoundButtonThatIsActuallyADamnButton = styled.button`
  display: block;
  
  border: none;
  border-radius: 50%;
  
  width: 1.5rem;
  height: 1.5rem;
  
  ${props => props.right && `position: absolute;`}
  ${props => props.right ? `right` : `left`}: .9rem;
  bottom: .9rem;
  
  padding: 0;
  
  ${props => props.isOpen && `transform: rotate(-90deg);`}
  
  transition: all 300ms ease;
  
  background: #0F90D1;
  
  img {
    height: 100%;
    background: white;
  }
  
  i {
    color: white;
  }
`;

const MoreMenu = styled.nav`  
  width: 3rem;
  
  margin-left: .4rem;
  
  text-align: center;
  
  background: transparent;
  
  a {
    opacity: ${props => props.isOpen ? `1` : `0`};
    display: ${props => props.isOpen ? `flex` : `none`};
    align-items: center;
    justify-content: center;
    
    transition-property: all;
    transition-duration: 300ms;
    transition-timing-function: ease;
    
    margin: .3rem 0;
    
    background: #0F90D1;
    
    img {
      height: 52%;
    }
  }
  
  ${Array(10).join(0).split(0).reverse().map((item, index) => `
    button:nth-child(${index}) {
      transition-delay: ${index * 100}ms;
    }
  `)}
`;

class MessageBox extends Component {
  static propTypes = {
    onSend: PropTypes.func,
    onSuggestionClicked: PropTypes.func,
    isRecordingPassword: PropTypes.bool,
    isSearchMode: PropTypes.bool
  };

  constructor() {
    super();

    this.state = {
      isMoreMenuOpen: false
    };
  }

  toggleMoreMenu = (event) => {
    event.preventDefault();

    this.setState({ isMoreMenuOpen: !this.state.isMoreMenuOpen });
  };

  handleSearch = (event) => {
    event.preventDefault();

    this.props.onSearch(this.props.message);
  };

  render() {
    let messageBoxPlaceholder = "MESSAGE_BOX_PLACEHOLDER";

    if (this.props.isRecordingPassword) {
      messageBoxPlaceholder = "MESSAGE_BOX_PASSWORD_PLACEHOLDER";
    }

    if (this.props.isSearchMode) {
      messageBoxPlaceholder = "MESSAGE_BOX_SEARCH_PLACEHOLDER";
    }

    return (
      <MessageBoxAndSuggestions>
        <MoreMenu isOpen={this.state.isMoreMenuOpen}>
          <RoundButton
            href={"#"}
            onClick={() => this.props.history.push("/settings")}
          >
            <i className="fa fa-cogs" />
          </RoundButton>
          <RoundButton
            href={"#"}
            onClick={() => window.open("https://undermind.typeform.com/to/DxEfih", "_system")}
          >
            <img src={`/question.png`} />
          </RoundButton>
          <RoundButton
            href={"#"}
            onClick={() => window.open("https://undermind.typeform.com/to/QgwOAs", "_system")}
          >
            <img src={`/add-course.png`} />
          </RoundButton>
          <RoundButton
            href={"#"}
            onClick={() => window.open("https://undermind.typeform.com/to/ctkhrr", "_system")}
          >
            <img src={`/bug.png`} />
          </RoundButton>
        </MoreMenu>
        <MessageBoxWrapper
          innerRef={node => this.form = node}
          onSubmit={this.props.isSearchMode ? this.handleSearch : this.props.onSend}
        >
          <RoundButton
            onClick={this.toggleMoreMenu}
            isOpen={this.state.isMoreMenuOpen}
          >
            <img src={`/more${this.state.isMoreMenuOpen ? "-blue" : ""}.svg`} />
          </RoundButton>
          <MessageInput
            type={this.props.isRecordingPassword ? `password` : `text`}
            placeholder={i18n.__(messageBoxPlaceholder)}
            value={this.props.message}
            onChange={this.props.onChange}
            innerRef={node => this.props.setMessageInputRef(node)}
          />
          <RoundButtonThatIsActuallyADamnButton type={"submit"} right>
            {this.props.isSearchMode
              ? <i className={"fa fa-search"} />
              : <img src={`/send.svg`} />
            }
          </RoundButtonThatIsActuallyADamnButton>
        </MessageBoxWrapper>
      </MessageBoxAndSuggestions>
    );
  }
}

export default MessageBox;
