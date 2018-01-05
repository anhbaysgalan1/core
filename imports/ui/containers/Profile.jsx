import React, { Component } from "react";

import { Header, UserProfile, UserSubjects } from "../components";

class Profile extends Component {
  constructor() {
    super();

    this.userSubjects = [
      {
        image: "graph",
        xp: "1,600",
        xpMax: "10,000",
        rank: "First class"
      },
      {
        image: "microscope",
        xp: "1,600",
        xpMax: "10,000",
        rank: "First class"
      }
    ]
  }
  render() {
    return (
      <div>
        <Header {...this.props} />
        <UserProfile
          avatar={`/avatar.png`}
          level={`23`}
          xp={`23,798`}
          xpMax={`100,000`}
          tokens={`493`}
        />
        <UserSubjects subjects={this.userSubjects} />
      </div>
    );
  }
}

export default Profile;
