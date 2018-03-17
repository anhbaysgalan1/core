import { Meteor } from "meteor/meteor";
import React, { Component } from "react";
import { compose } from "react-komposer";
import SavedForLaterComponent from "../components/SavedForLater";
import Header from "../components/Header";

class SavedForLater extends Component {
  constructor(props) {
    super();

    console.log("SavedForLater.constructor");

    this.state = {
      content: props.content
    };
  }

  handleDeleteSavedCourse = (content, stateIndex) => {
    console.log("handleDeleteSavedCourse", stateIndex);

    const stateContent = this.state.content;
    stateContent.splice(stateIndex, 1);

    this.setState({ content: stateContent });

    Meteor.call("removeSavedForLaterContent", content.row_id);
  }

  render() {
    console.log("State:", this.state);
    console.log("Props:", this.props);

    console.log("Got content", this.state.content);
    console.log("Mapping content", this.state.content.map((current) => current.link));

    return [
      <Header {...this.props} key="header" />,
      <SavedForLaterComponent
        {...this.props}
        content={this.state.content}
        onDelete={this.handleDeleteSavedCourse}
        key="savedForLaterComponent"
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
    content: saveForLaterContent
  });
}

export default compose(
  getTrackerLoader(dataLoader)
)(SavedForLater);
