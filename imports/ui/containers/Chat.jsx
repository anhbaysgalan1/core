import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import i18n from "meteor/universe:i18n";
import { compose } from "react-komposer";

import { Conversation, MessageBox, Header } from "../components";

class Chat extends Component {
  constructor() {
    super();

    this.state = {
      conversation: [
        { sender: "jina", text: i18n.__("JINA_GREETING") }
      ],
      suggestions: [i18n.__("SUGGESTION_I_AM_MEMBER"), i18n.__("SUGGESTION_I_AM_NEWCOMER")],
      typedMessage: "",
      authenticating: false,
      registering: false,
      userName: "",
      email: "",
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


    if (typedMessage.includes(i18n.__("STUDENT"))) {
      this.startLoginScript();
    } else if (typedMessage.includes(i18n.__("NEWCOMER"))) {
      this.startSignUpScript();
    }

    // If user is authenticating and has typed password, attempt to log in
    if (this.state.authenticating && userIsTypingPassword) {
      Meteor.loginWithPassword(this.state.userName, this.state.typedMessage, (err) => {
        if (err) {
          this.sendJinaResponse(i18n.__("JINA_ERROR_SOMETHING_WENT_WRONG", { err }));
          
          // Retry password input
          this.sendJinaResponse(i18n.__("JINA_ERROR_PASSWORD_TRY_AGAIN"));
        } else {
          // Greet user
          this.sendJinaResponse(i18n.__("JINA_WELCOME", { name: Meteor.user().username }), {
            noDelay: true
          });

          // End authentication phase
          this.setState({
            authenticating: false
          }, () => {
            // Should connect to JinaCore here
            this.sendJinaResponse(i18n.__("JINA_ERROR_JINACORE"));
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
          this.sendJinaResponse(i18n.__("JINA_ERROR_SOMETHING_WENT_WRONG", { err }));
        } else {
          // Greet new user
          this.sendJinaResponse(i18n.__("JINA_WELCOME", { name: Meteor.user().username }), {
            noDelay: true
          });

          // End registration phase
          this.setState({
            registering: false
          }, () => {
            this.sendJinaResponse(i18n.__("JINA_ERROR_JINACORE"));
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
            this.sendJinaResponse(i18n.__("JINA_LOGIN_PASSWORD_PROMPT", { userName: this.state.userName }));
          });
        } else {
          this.sendJinaResponse(i18n.__("JINA_ERROR_USER_NOT_FOUND", { userName: typedMessage }));
        }
      });
    }
    // If user is registering, has entered user name and has entered email
    else if (this.state.registering && this.state.userName && this.state.email) {

    }
    // If user is registering and has entered email
    else if (this.state.registering && this.state.userName) {
      this.setState({ email: typedMessage });

      this.sendJinaResponse(i18n.__("JINA_REGISTRATION_PASSWORD_PROMPT"));
    }
    // If user is registering
    else if (this.state.registering) {
      this.setState({ userName: typedMessage });

      this.sendJinaResponse(i18n.__("JINA_REGISTRATION_EMAIL_PROMPT"));
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
    this.sendJinaResponse(i18n.__("JINA_LOGIN_USERNAME_PROMPT"));

    // Set `authenticating` state bool value to true and empty suggestions
    this.setState({
      authenticating: true,
      suggestions: []
    });
  }

  /**
   * Start sign up phase
   */

  startSignUpScript() {
    this.sendJinaResponse(i18n.__("JINA_REGISTRATION_USERNAME_PROMPT"));

    this.setState({
      registering: true,
      suggestions: []
    });
  }

  /**
   * Push clicked suggestion to state
   *
   * @param event
   * @param message
   */

  handleSuggestionClicked(event, message) {
    this.setState({ typedMessage: message.text, suggestions: [] }, () => {
      this.handleMessageSend();
    });
  }

  render() {
    const userIsTypingPassword = (this.state.authenticating && this.state.userName.length > 0) ||
      (this.state.registering && this.state.userName.length > 0 && this.state.email.length > 0);

    return [
      <Header {...this.props} />,
      <Conversation
        messages={this.state.conversation}
        suggestions={this.state.suggestions}
        onSuggestionClicked={this.handleSuggestionClicked}
      />,
      <MessageBox
        message={this.state.typedMessage}
        isRecordingPassword={userIsTypingPassword}
        onSend={this.handleMessageSend}
        onChange={this.handleMessageChange}
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
