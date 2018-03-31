import React, { Component } from "react";
import styled from "styled-components";
import CategoryCarousel from "./CategoryCarousel";
import countries from "country-list";

const WarningWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  
  height: ${props => props.loggedIn ? "40vh" : "80vh"};
`;

const Warning = styled.h2`
  font-size: 1.4rem;
  text-align: center;
`;

const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  
  padding-top: 6rem;
  
  background: rgba(0, 0, 0, .15);
`;

const Action = styled.a`
  position: relative;
  display: block;
  width: 100%;
  border-bottom: 1px solid rgba(0, 0, 0, .1);
  padding: 1rem 0 1rem 3rem;
  font-size: 1.2rem;
  background: white;
  
  &::after {
    position: absolute;
    right: 2rem;
    content: "";
    font-family: FontAwesome;
  }
`;

const Pane = styled.div`
  display: ${props => props.currentPane === props.paneName ? "block" : "none"};  
  padding: 1rem 1rem 2rem 1rem;
  background: white;
`;

const Input = styled.input`
  margin: 1rem 0;
  border: none;
  border-bottom: 1px solid #0F90D1;
  padding: .5rem 1rem;
  width: 100%;
`;

const SaveButton = styled.button`
  width: 100%;
  background: #0F90D1;
  color: white;
  padding: .5rem 1rem;
  border: none;
`;

const DeleteButton = styled(SaveButton)`
  background: #DB5461;
`;

const Link = styled.a`
  display: block;
  margin-bottom: .5rem;
  text-decoration: none;
  color: #0F90D1;
`;

const Select = styled.select`
  position: relative;
  border: none;
  border-radius: 0;
  background: transparent;
  width: 100%;
  padding: .5rem 1rem;
`;

const SelectWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #0F90D1;
  padding-right: 1rem;
  margin-bottom: 1rem;
`;

class Settings extends Component {
  constructor() {
    super();

    this.state = {
      currentPane: "",
      checkedCategories: [],
      deleteClickConfirmation: false,
      email: "",
      oldPassword: "",
      newPassword: ""
    };
  }

  handleTogglePane = (currentPane) => {
    if (this.state.currentPane === currentPane) {
      this.setState({ currentPane: "" });
    } else {
      this.setState({ currentPane }, () => window.dispatchEvent(new Event('resize')));
      // Trigger resize event to make Slick recalculate width
    }
  };

  handleToggleCategory = (slug) => {
    let { checkedCategories } = this.state;

    if (checkedCategories.includes(slug)) {
      checkedCategories = checkedCategories.filter(currentSlug => currentSlug !== slug);
    } else if (checkedCategories.length < 6) {
      checkedCategories.push(slug);
    }

    this.setState({ checkedCategories }, () => {
      if (this.state.checkedCategories.length === 6) {
        this.props.onCategoriesPicked(this.state.checkedCategories);
      }
    });
  };

  handleSetField = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSaveEmail = () => {
    this.props.onEmailChange(this.state.email);
    this.setState({ email: "" });
  };

  handleSavePassword = () => {
    this.props.onPasswordChange(this.state.oldPassword, this.state.newPassword);
    this.setState({ oldPassword: "", newPassword: "" });
  };

  handleDeleteAccount = () => {
    if (!this.state.deleteClickConfirmation) {
      this.setState({ deleteClickConfirmation: true });
    } else {
      this.props.onDeleteAccount();
    }
  };

  render() {
    return (
      <Wrapper>
        {this.props.user ?
          <div>
            <Action onClick={() => this.handleTogglePane("categories")}>Content categories</Action>
            <Pane currentPane={this.state.currentPane} paneName="categories">
              <CategoryCarousel
                categories={this.props.categories}
                checkedCategories={this.state.checkedCategories}
                onCategoryClick={this.handleToggleCategory}
              />
            </Pane>
            <Action onClick={() => this.handleTogglePane("email")}>Email</Action>
            <Pane currentPane={this.state.currentPane} paneName="email">
              <span>Your current email address is {this.props.user.emails[0].address}</span>
              <Input
                type="email"
                placeholder="New email address"
                name="email"
                value={this.state.email}
                onChange={this.handleSetField}
              />
              <SaveButton onClick={this.handleSaveEmail}>Save email</SaveButton>
            </Pane>
            <Action onClick={() => this.handleTogglePane("password")}>Password</Action>
            <Pane currentPane={this.state.currentPane} paneName="password">
              <Input
                type="password"
                placeholder="Current password"
                name="oldPassword"
                value={this.state.oldPassword}
                onChange={this.handleSetField}
              />
              <Input
                type="password"
                placeholder="New password"
                name="newPassword"
                value={this.state.newPassword}
                onChange={this.handleSetField}
              />
              <SaveButton onClick={this.handleSavePassword}>Save password</SaveButton>
            </Pane>
            <Action onClick={() => this.handleTogglePane("country")}>Country</Action>
            <Pane currentPane={this.state.currentPane} paneName="country">
              <SelectWrapper>
                <i className="fa fa-chevron-down" />
                <Select>
                  {countries().getNames().map((country) => (
                    <option>{country}</option>
                  ))}
                </Select>
              </SelectWrapper>
              <SaveButton>Save country</SaveButton>
            </Pane>
            <Action onClick={() => this.handleTogglePane("about")}>About Jinaverse</Action>
            <Pane currentPane={this.state.currentPane} paneName="about">
              <Link href="#" onClick={() => window.open("http://atlas.undermind.io/about.html", "_system")}>
                About Atlas
              </Link>
              <Link href="#" onClick={() => window.open("http://atlas.undermind.io/terms.html", "_system")}>
                Terms and Conditions
              </Link>
              <Link href="#" onClick={() => window.open("http://atlas.undermind.io/privacy.html", "_system")}>
                Privacy Policy
              </Link>
              <Link href="#" onClick={() => window.open("http://atlas.undermind.io/mentions.html", "_system")}>
                Company Info
              </Link>
            </Pane>
            <Action style={{ marginTop: "2rem" }} onClick={() => this.handleTogglePane("delete")}>Delete account</Action>
            <Pane currentPane={this.state.currentPane} paneName="delete">
              <p>Deleting your account is irreversible and removes all the data associated with your info from our systems.</p>
              <DeleteButton
                onClick={this.handleDeleteAccount}
              >{this.state.deleteClickConfirmation ? "Are you sure?" : "Delete account"}</DeleteButton>
            </Pane>
          </div>
          :
          <WarningWrapper>
            <Warning>Register or log in to edit settings!</Warning>
          </WarningWrapper>
        }
      </Wrapper>
    );
  }
}

export default Settings;
