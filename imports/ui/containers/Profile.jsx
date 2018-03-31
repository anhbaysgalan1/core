import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import { compose } from "react-komposer";

import { UserProfile, UserSubjects, LeaderboardNavigation } from "../components";
import { WarningWrapper, Warning } from "../components/Warning";

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
        {profile ?
          <div>
            <UserProfile
              avatar={profile.avatar}
              level={profile.level}
              xp={profile.xp}
              xpMax={parseInt(profile.level) * 1000}
              tokens={profile.tokens}
            />
            {this.state.activeLeaderboardPane === "skills" &&
              <UserSubjects
                subjects={profile.skills.sort((a, b) => parseInt(b.xp) - parseInt(a.xp))}
                // categories={this.props.categories}
              />
            }
            {this.state.activeLeaderboardPane === "contentProviders" &&
              <WarningWrapper loggedIn>
                <Warning>Coming soon!</Warning>
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
  if (Meteor.subscribe("users").ready() && Meteor.subscribe("categories").ready()
  ) {
    onData(null, {
      userProfile: Meteor.user() && Meteor.user().profile
    });
  }
}

export default compose(
  getTrackerLoader(dataLoader)
)(Profile);
