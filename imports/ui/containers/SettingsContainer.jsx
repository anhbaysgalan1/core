import React, { Component } from "react";
import { compose } from "react-komposer";
import { Meteor } from "meteor/meteor";
import SettingsComponent from "../components/Settings";
import { getAllCategories } from "/imports/api/Category";
import { withRouter } from "react-router-dom";

class SettingsContainer extends Component {
  handleCategoryPickingOver = (categories) => {
    const skills = categories.map(currentCategory => {
      return {
        "slug": currentCategory,
        "xp": 0,
        "xpMax": 10000,
        "rank": "First class"
      };
    });

    Meteor.users.update(Meteor.userId(), {
      $set: {
        "profile.skills": skills
      }
    });
  };

  handleChangeEmail = (email) => {
    Meteor.call("user/replaceEmail", email);
  };

  handleChangePassword = async (oldPassword, newPassword) => {
    const { Accounts } = await import("meteor/accounts-base");

    Accounts.changePassword(oldPassword, newPassword);
  };

  handleDeleteAccount = () => {
    Meteor.call("user/deleteAccount", Meteor.userId(), () => {
      this.props.history.push("/");
    });
  };

  render() {
    return (
      <SettingsComponent
        {...this.props}
        onCategoriesPicked={this.handleCategoryPickingOver}
        onEmailChange={this.handleChangeEmail}
        onPasswordChange={this.handleChangePassword}
        onDeleteAccount={this.handleDeleteAccount}
      />
    );
  }
}

function getTrackerLoader(reactiveMapper) {
  return (props, onData, env) => {
    let trackerCleanup = null;
    const handler = Tracker.nonreactive(() => {
      return Tracker.autorun(() => {
        // assign the custom clean-up function.
        trackerCleanup = reactiveMapper(props, onData, env);
      });
    });

    return () => {
      if (typeof trackerCleanup === "function") trackerCleanup();
      return handler.stop();
    };
  };
}

function dataLoader(props, onData) {
  if (Meteor.subscribe("users").ready() && Meteor.subscribe("categories").ready()) {
    onData(null, {
      user: Meteor.user(),
      categories: getAllCategories()
    });
  }
}

export default compose(
  getTrackerLoader(dataLoader),
  withRouter
)(SettingsContainer);
