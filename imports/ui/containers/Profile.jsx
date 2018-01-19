import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import styled from "styled-components";
import { compose } from "react-komposer";

import { getAllCategories } from "../../api/Category";
import { Header, UserProfile, UserSubjects, LeaderboardNavigation } from "../components";

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

class Profile extends Component {
  constructor() {
    super();

    this.state = {
      activeLeaderboardPane: "skills"
    };
  }

  handleLeaderboardIconClicked = (activeLeaderboardPane) => {
    this.setState({ activeLeaderboardPane });
  };

  render() {
    const profile = this.props.userProfile;

    return (
      <div>
        <Header {...this.props} />
        {profile ?
          <div>
            <UserProfile
              avatar={profile.avatar}
              level={profile.level}
              xp={profile.xp}
              xpMax={`100,000`}
              tokens={profile.tokens}
            />
            {this.state.activeLeaderboardPane === "skills" &&
              <UserSubjects
                subjects={profile.skills.sort((a, b) => parseInt(b.xp) - parseInt(a.xp))}
                categories={this.props.categories}
              />
            }
            {this.state.activeLeaderboardPane === "contentProviders" &&
              <WarningWrapper loggedIn>
                <Warning>¡La página no existe!</Warning>
              </WarningWrapper>
            }
            <LeaderboardNavigation
              onIconClick={this.handleLeaderboardIconClicked}
              currentPane={this.state.activeLeaderboardPane}
            />
          </div>
          :
          <WarningWrapper>
            <Warning>Register or log in to see your profile!</Warning>
          </WarningWrapper>
        }
      </div>
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
      userProfile: Meteor.user() && Meteor.user().profile,
      categories: getAllCategories()
    });
  }
}

export default compose(
  getTrackerLoader(dataLoader)
)(Profile);
