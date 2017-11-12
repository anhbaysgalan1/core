import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import i18n from "meteor/universe:i18n";
import { compose } from "react-komposer";

import { Conversation, MessageBox } from "../components";

class Chat extends Component {
  constructor() {
    super();

    this.state = {
      conversation: [
        { sender: "jina", text: i18n.__("JINA_GREETING") }
      ],
      suggestions: ["I'm a student", "I'm a newcomer"],
      typedMessage: "",
      authenticating: false,
      registering: false,
      userName: "",
      email: ""
    };

    this.handleMessageSend = this.handleMessageSend.bind(this);
    this.handleMessageChange = this.handleMessageChange.bind(this);
    this.handleSuggestionClicked = this.handleSuggestionClicked.bind(this);
    this.startLoginScript = this.startLoginScript.bind(this);
  }

  /**
   * Push typed message into the `conversation` state array, and perform additional operations if needed
   *
   * @param event
   */

  handleMessageSend(event) {
    // Prevent the form from handling the submit event
    if (event) event.preventDefault();

    const conversation = this.state.conversation;
    let typedMessage = this.state.typedMessage;

    const userIsTypingPassword = (this.state.authenticating && this.state.userName.length > 0) ||
      (this.state.registering && this.state.userName.length > 0 && this.state.email.length > 0);

    // If user has typed a pasword, replace characters by dots before pushing it to  conversation
    if (userIsTypingPassword) {
      typedMessage = Array.prototype.map.call(typedMessage, () => "●");
    }
    
    // Push message to conversation
    conversation.push({ sender: "me", text: typedMessage });

    // If user is authenticating and has typed password, attempt to log in
    if (this.state.authenticating && userIsTypingPassword) {
      Meteor.loginWithPassword(this.state.userName, this.state.typedMessage, (err) => {
        if (err) {
          this.sendJinaResponse(`Oops, something went wrong: ${err}`);
          
          // Retry password input
          this.sendJinaResponse(`Let's try one more time. What's your password?`);
        } else {
          // Greet user
          this.sendJinaResponse(`Welcome, ${Meteor.user().username}!`, {
            noDelay: true
          });

          // End authentication phase
          this.setState({
            authenticating: false
          }, () => {
            // Should connect to JinaCore here
            this.sendJinaResponse(`I should connect to JinaCore here. This is not implemented yet, so I'm a dumb and useless robot.`);
          });
        }
      });
    }
    // If user is registering and has typed password, attempt to register
    else if (this.state.registering && userIsTypingPassword) {
      Accounts.createUser({
        username: this.state.userName,
        email: this.state.email,
        password: this.state.typedMessage
      }, (err) => {
        if (err) {
          this.sendJinaResponse(`Oops, something went wrong: ${err}`);
        } else {
          // Greet new user
          this.sendJinaResponse(`Welcome, ${Meteor.user().username}!`, {
            noDelay: true
          });

          // End registration phase
          this.setState({
            registering: false
          }, () => {
            this.sendJinaResponse(`I should connect to JinaCore here. This is not implemented yet, so I'm a dumb and useless robot.`);
          });
        }
      });
    }
    // If user has typed username but hasn't typed password yet
    else if (this.state.authenticating) {
      // Check if username is correct

      Meteor.call("user/doesUserExist", typedMessage, (error, result) => {
        if (!error && result) {
          this.setState({ userName: typedMessage }, () => {
            this.sendJinaResponse(`Thanks, ${this.state.userName}. What's your password?`);
          });
        } else {
          this.sendJinaResponse(`Sorry, but user ${typedMessage} doesn't exist. Try again.`);
        }
      });
    }
    // If user is registering, has entered user name and has entered email
    else if (this.state.registering && this.state.userName && this.state.email) {

    }
    // If user is registering and has entered email
    else if (this.state.registering && this.state.userName) {
      this.setState({ email: typedMessage });

      this.sendJinaResponse(`We're getting there! Now, what password do you want to set?`);
    }
    // If user is registering
    else if (this.state.registering) {
      this.setState({ userName: typedMessage });

      this.sendJinaResponse(`Thanks bruh. What's your email address? No spam, I swear.`);
    }

    this.setState({ conversation, typedMessage: "" });
  }

  /**
   * Save typed message to state whenever it changes
   *
   * @param event
   */

  handleMessageChange(event) {
    this.setState({ typedMessage: event.target.value });
  }

  /**
   * Send response from Jina
   *
   * @param message
   */

  sendJinaResponse(message, options = {}) {
    const conversation = this.state.conversation;

    // A semi-random delay to simulate a message being typed
    const delay = 1000 + Math.floor(Math.random() * (2000 - 500)) + 500;

    setTimeout(() => {
      conversation.push({ sender: "jina", text: message });
      this.setState({ conversation });
    }, options.noDelay ? 0 : delay);
  }

  /**
   * Start login phase
   */

  startLoginScript() {
    this.sendJinaResponse(`Nice! What's your username?`);

    // Set `authenticating` state bool value to true and empty suggestions
    this.setState({
      authenticating: true
    });
  }

  /**
   * Start sign up phase
   */

  startSignUpScript() {
    this.sendJinaResponse(`Welcome to Undermind! What username do you want to take?`);

    this.setState({
      registering: true
    });
  }

  /**
   * Push clicked suggestion to state
   *
   * @param suggestion
   */

  handleSuggestionClicked(suggestion) {
    this.setState({ typedMessage: suggestion, suggestions: [] }, () => {
      this.handleMessageSend();

      if (suggestion.includes("student")) {
        this.startLoginScript();
      } else if (suggestion.includes("newcomer")) {
        this.startSignUpScript();
      }
    });
  }

  render() {
    const userIsTypingPassword = (this.state.authenticating && this.state.userName.length > 0) ||
      (this.state.registering && this.state.userName.length > 0 && this.state.email.length > 0);

    return [
      <Conversation messages={this.state.conversation} />,
      <MessageBox
        message={this.state.typedMessage}
        suggestions={this.state.suggestions}
        isRecordingPassword={userIsTypingPassword}
        onSend={this.handleMessageSend}
        onChange={this.handleMessageChange}
        onSuggestionClicked={this.handleSuggestionClicked}
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

function dataLoader(props, onData) {
  if (Meteor.subscribe("users").ready()) {
    const messages =
    onData(null, {
      user: Meteor.user()
    });
  }
}

export default compose(
  getTrackerLoader(dataLoader)
)(Chat);
