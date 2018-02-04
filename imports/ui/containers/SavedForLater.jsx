import { Meteor } from "meteor/meteor";
import React, { Component } from "react";
import { compose } from "react-komposer";
import SavedForLaterComponent from "../components/SavedForLater";
import Header from "../components/Header";

class SavedForLater extends Component {
  constructor() {
    super();

    console.log("SavedForLater.constructor");
  }
  render() {
    console.log("Props:", this.props);

    console.log("Got content", this.props.content);
    console.log("Mapping content", this.props.content.map((current) => current.link));

    return [
      <Header {...this.props} />,
      <SavedForLaterComponent
        {...this.props}
        content={this.props.content}
      />
    ];
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

async function dataLoader(props, onData) {
  const saveForLaterContent = await Meteor.callPromise("getSavedForLater");

  console.log("Got da content!", saveForLaterContent);

  onData(null, {
    content: saveForLaterContent,
    test: "Hello World"
  });
}

export default compose(
  getTrackerLoader(dataLoader)
)(SavedForLater);
