import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import styled from "styled-components";
import { compose } from "react-komposer";

import { Header, UserProfile, UserSubjects } from "../components";

const WarningWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  
  height: 80vh;
`;

const Warning = styled.h2`
  font-size: 1.4rem;
  text-align: center;
`;

class Profile extends Component {
  constructor() {
    super();
  }

  render() {
    const profile = this.props.userProfile;

    return (
      <div>
        <Header {...this.props} />
        {profile ?
          <div>
            <UserProfile
              avatar={`/avatar.png`}
              level={profile.level}
              xp={profile.xp}
              xpMax={`100,000`}
              tokens={profile.tokens}
            />
            <UserSubjects subjects={profile.skills} />
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
  if (Meteor.subscribe("users").ready()) {
    onData(null, {
      userProfile: Meteor.user() && Meteor.user().profile
    });
  }
}

export default compose(
  getTrackerLoader(dataLoader)
)(Profile);
