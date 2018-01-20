import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import i18n from "meteor/universe:i18n";
import { MysqlSubscription } from "meteor/numtel:mysql";

import React, { Component } from "react";
import { compose } from "react-komposer";
import partOfDay from "humanized-part-of-day";

import { Conversation, MessageBox, Header, LongPressMenu } from "../components";

const allContent = new MysqlSubscription("allContent");

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
      gender: "",
      isLongPressMenuOpen: false
    };

    if (Meteor.user()) {

      this.state = {
        ...this.state,
        conversation: [],
        suggestions: []
      };

      this.greet(true);
    }

    this.handleMessageSend = this.handleMessageSend.bind(this);
    this.handleMessageChange = this.handleMessageChange.bind(this);
    this.handleSuggestionClicked = this.handleSuggestionClicked.bind(this);
    this.startLoginScript = this.startLoginScript.bind(this);
    this.handleAvatarClicked = this.handleAvatarClicked.bind(this);
    this.handleLinkLongPress = this.handleLinkLongPress.bind(this);
  }

  awaitSuggestionChoice = (suggestions) => new Promise((resolve, reject) => {
    this.setState({
      onSuggestionChoice: resolve, // Passing the resolve reference
      suggestions: suggestions
    });
  });

  awaitReply = (suggestions) => new Promise((resolve, reject) => {
    this.setState({
      onReply: resolve // Passing the resolve reference
    });
  });

  displayAvatars = () => {
    this.setState({
      suggestions: [
        { type: "image", url: "/avatar/Astronomer_Bright.png" },
        { type: "image", url: "/avatar/Explorer_Bright.png" },
        { type: "image", url: "/avatar/Hacker_Bright.png" },
        { type: "image", url: "/avatar/Musician_Bright.png" },
        { type: "image", url: "/avatar/Scientist_Bright.png" },
        { type: "image", url: "/avatar/Warrior_Bright.png" }
      ]
    });
  };

  greet(isFirstMessage = false) {
    // Greet user
    this.sendJinaResponse(i18n.__(`JINA_WELCOME_${partOfDay.getCurrent()}`, { name: Meteor.user().username }))
      .then(() => {
        if (isFirstMessage) {
          // Should connect to JinaCore here
          this.showBriefing();
        } else {
          // End authentication phase
          this.setState({
            authenticating: false
          }, () => {
            // Should connect to JinaCore here
            this.showBriefing();
          });
        }
      });
  }

  showBriefing() {
    this.sendJinaResponse(i18n.__("ANORAK_BRIEFING_INTRO"))
      .then(() => this.awaitSuggestionChoice([
        i18n.__("SUGGESTION_COURSE"),
        i18n.__("SUGGESTION_VIDEO"),
        i18n.__("SUGGESTION_ARTICLE")
      ]))
      .then((message) => {
        this.setState({ onSuggestionChoice: null });

        if (message.includes(i18n.__("VIDEO"))) {
          this.displayDiscover("video");
        } else if (message.includes(i18n.__("COURSE"))) {
          this.displayDiscover("course");
        } else if (message.includes(i18n.__("ARTICLE"))) {
          this.displayDiscover("article");
        } else {
          this.sendJinaResponse(i18n.__("ANORAK_UNDERSTANDING_ERROR"));
        }
      });
  }

  /**
   * Display data from the Discover Program (random atm)
   *
   * @param type
   */

  displayDiscover(type) {
    this.sendJinaResponse(`Discover program for type ${type} goes here.`)
      .then(() => {
          console.log("content:", this.props.content);

          const filteredContent = this.props.content.map((row) => ({
            id: row.row_id,
            title: row.title,
            link: row.link,
            image: row.image || "http://via.placeholder.com/150x100",
            description: row.description || "Lorem ipsum dolor sit amet..."
          }));

          console.log("filtered content:", filteredContent);

          this.awaitSuggestionChoice(filteredContent);
        });
  }

  /**
   * Push typed message into the `conversation` state array, and perform additional operations if needed
   *
   * @param event
   */

  handleMessageSend(event) {
    if (event) event.preventDefault();

    const {
      authenticating,
      conversation,
      email,
      onSuggestionChoice,
      onReply,
      registering,
      userName,
      gender
    } = this.state;

    let typedMessage = this.state.typedMessage;

    this.setState({ suggestions: [] });

    const userIsTypingPassword = (authenticating && userName.length > 0) ||
      (registering && userName.length > 0 && email.length > 0 && gender.length > 0);

    if (userIsTypingPassword) {
      console.log("User is typing password");
      // If user has typed a pasword, replace characters by dots before pushing it to conversation

      typedMessage = Array.prototype.map.call(typedMessage, () => "●");
    }
    
    // Push message to conversation
    conversation.push({ sender: "me", text: typedMessage });

    console.log("Handling sent message");

    if (onReply) {
      console.log("Got onReply", onReply);
      this.setState({ typedMessage: "" });

      return onReply(typedMessage);
    }

    if (onSuggestionChoice) {
      console.log("Got onSuggestionChoice", onSuggestionChoice);
      console.log("Suggestions", this.state.suggestions);

      this.setState({ conversation, typedMessage: "" });

      return onSuggestionChoice(typedMessage);
    }

    if (!userIsTypingPassword && typedMessage && typedMessage.toLowerCase().includes(i18n.__("STUDENT"))) {
      console.log("Login phase.");
      this.startLoginScript();
    } else if (!userIsTypingPassword && typedMessage && typedMessage.toLowerCase().includes(i18n.__("NEWCOMER"))) {
      this.startSignUpScript();
    }

    // If user is authenticating and has typed password, attempt to log in
    if (authenticating && userIsTypingPassword) {
      Meteor.loginWithPassword(userName, this.state.typedMessage, (err) => {
        if (err) {
          this.sendJinaResponse(i18n.__("JINA_ERROR_SOMETHING_WENT_WRONG", { err }))
            .then(() => this.sendJinaResponse(i18n.__("JINA_ERROR_PASSWORD_TRY_AGAIN")));
        } else {
          this.greet();
        }
      });
    }
    // If user is registering and has typed password, attempt to register
    else if (registering && userIsTypingPassword) {
      console.log("THE PASSWORD IS ", this.state.typedMessage);
      Accounts.createUser({
        username: userName,
        email: email,
        password: this.state.typedMessage, // State reference to typedMessage because local one is obfuscated
        profile: {
          avatar: this.state.avatar,
          level: 1,
          xp: 0,
          tokens: 0,
          skills: [
            {
              "slug": "astronomy",
              "xp": 4500,
              "xpMax": 10000,
              "rank": "First class"
            },
            {
              "slug": "curiosity",
              "xp": 0,
              "xpMax": 10000,
              "rank": "First class"
            },
            {
              "slug": "chemistry",
              "xp": 0,
              "xpMax": 10000,
              "rank": "First class"
            },
            {
              "slug": "startup",
              "xp": 6000,
              "xpMax": 10000,
              "rank": "First class"
            },
            {
              "slug": "philosophy",
              "xp": 0,
              "xpMax": 10000,
              "rank": "First class"
            },
            {
              "slug": "tech",
              "xp": 0,
              "xpMax": 10000,
              "rank": "First class"
            }
          ]
        }
      }, (err) => {
        if (err) {
          this.sendJinaResponse(i18n.__("JINA_ERROR_SOMETHING_WENT_WRONG", { err }));
        } else {
          // Greet new user
          this.sendJinaResponse(i18n.__("JINA_WELCOME", { name: Meteor.user().username }))
            .then(() => this.setState({
              registering: false
            }, () => {
              this.sendJinaResponse(i18n.__("JINA_ERROR_JINACORE"));
            }));
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

      this.sendJinaResponse(i18n.__("ANORAK_REGISTRATION_PICK_GENDER"))
        .then(() => this.awaitSuggestionChoice([i18n.__("SUGGESTION_GENDER_MALE"), i18n.__("SUGGESTION_GENDER_FEMALE")]))
        .then((gender) => {
          this.setState({ gender });

          this.sendJinaResponse(i18n.__("ANORAK_REGISTRATION_PICK_AVATAR"));

          this.displayAvatars();
        });
    }
    // If user is registering
    else if (this.state.registering) {
      this.setState({ userName: typedMessage });

      Meteor.call("user/doesUserExist", typedMessage, (error, result) => {
        if (!error && result) {
          this.setState({ userName: typedMessage }, () => {
            this.sendJinaResponse(i18n.__("ANORAK_REGISTRATION_USERNAME_TAKEN"), { userName: typedMessage });
          });
        } else {
          this.sendJinaResponse(i18n.__("ANORAK_REGISTRATION_AGREE_TOC", { userName: typedMessage }), { link: "https://undermind.typeform.com/to/BJumJz" })
            .then(() => this.awaitSuggestionChoice([i18n.__("SUGGESTION_AGREE"), i18n.__("SUGGESTION_DISAGREE")]))
            .then(() => {
              this.setState({ onSuggestionChoice: null });
              this.sendJinaResponse(i18n.__("ANORAK_REGISTRATION_PICK_EMAIL", { userName: typedMessage }))
            });
        }
      });
    }
    // If user asks for privacy policy
    else if (this.state.privacyPolicyCapture && typedMessage.includes(i18n.__("SUGGESTION_REGISTRATION_PRIVACY_NO"))) {
      this.sendJinaResponse(i18n.__("JINA_REGISTRATION_PRIVACY_POLICY"))
        .then(() => this.sendJinaResponse(i18n.__("JINA_REGISTRATION_PRIVACY_POLICY_COME_BACK")))
        .then(() => this.setState({
          suggestions: [i18n.__("SUGGESTION_PRIVACY_POLICY_TRUST"), i18n.__("SUGGESTION_PRIVACY_POLICY_NO_TRUST")]
        }));
    }
    // If user doesn't agree to privacy policy
    else if (this.state.privacyPolicyCapture && typedMessage.includes(i18n.__("SUGGESTION_PRIVACY_POLICY_NO_TRUST"))) {
      this.sendJinaResponse(i18n.__("JINA_USER_QUOTE_BYE"));

      this.setState({
        suggestions: []
      })
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
   * @param options : Object (optional)
   */

  sendJinaResponse(message, options = {}) {
    return new Promise((resolve, reject) => {
      this.setState({ isTyping: true });

      const conversation = this.state.conversation;

      // Delay to simulate a message being typed
      const delay = 500 + 10 * message.length;

      console.log("Delay ", delay);

      setTimeout(() => {
        if (options.link) {
          conversation.push({ sender: "jina", text: message, link: options.link });
        } else {
          conversation.push({ sender: "jina", text: message });
        }

        this.setState({ conversation }, () => {
          this.setState({ isTyping: false });

          resolve();
        });
      }, options.noDelay ? 0 : delay);
    });
  }

  /**
   * Start login phase
   */

  startLoginScript() {
    this.sendJinaResponse(i18n.__("JINA_LOGIN_USERNAME_PROMPT"))
      .then(() => {
        // Set `authenticating` state bool value to true and empty suggestions
        this.setState({
          authenticating: true,
          suggestions: []
        });
      });
  }

  /**
   * Start sign up phase
   */

  startSignUpScript() {
    if (Meteor.users.find().count() > 100) {
      this.sendJinaResponse(i18n.__("JINA_USER_QUOTA_REACHED"))
        .then(() => this.sendJinaResponse(i18n.__("JINA_USER_QUOTA_EMAIL_CTA")))
        .then(() => this.setState({
          quotaCtaEmailCapture: true,
          suggestions: [i18n.__("SUGGESTION_EMAIL_CTA_YES"), i18n.__("SUGGESTION_EMAIL_CTA_NO")]
        }));
    } else {
      this.sendJinaResponse(i18n.__("JINA_REGISTRATION_GREETING"))
        .then(() => this.sendJinaResponse(i18n.__("JINA_REGISTRATION_GREETING_2")))
        .then(() => this.awaitSuggestionChoice([i18n.__("SUGGESTION_REGISTRATION_PRIVACY_YES"), i18n.__("SUGGESTION_REGISTRATION_PRIVACY_NO")]))
        .then((choice) => {
          if (choice.includes(i18n.__("SUGGESTION_REGISTRATION_PRIVACY_YES"))) {
            this.sendJinaResponse(i18n.__("ANORAK_REGISTRATION_AGE_CHECK"))
              .then(() => this.awaitReply())
              .then((choice) => {
                this.setState({ onReply: null, onSuggestionChoice: null });

                console.log("Got choice", choice);

                if (parseInt(choice) <= 13) {
                  this.sendJinaResponse(i18n.__("ANORAK_REGISTRATION_TOO_YOUNG"));
                } else {
                  this.sendJinaResponse(i18n.__("ANORAK_REGISTRATION_AGE_OK"))
                    .then(() => {
                      this.sendJinaResponse(i18n.__("ANORAK_REGISTRATION_PICK_USERNAME"));
                      this.setState({ registering: true, onReply: null });
                    });
                }
              });
          }
        });
    }
  }

  /**
   * Push clicked suggestion to state
   *
   * @param event
   * @param message
   */

  handleSuggestionClicked(event, message) {
    this.setState({ typedMessage: message.text, suggestions: [] }, () => {
      this.handleMessageSend(event);
    });
  }

  handleAvatarClicked(event, url) {
    console.log("Clicked avatar with url:", url);

    this.setState({
      avatar: url,
      suggestions: [],
      onSuggestionChoice: null,
      conversation: [
        ...this.state.conversation,
        { type: "avatar", url }
      ]
    }, () => this.sendJinaResponse(i18n.__("UNDERMIND_REGISTRATION_PASSWORD_PROMPT")));
  }

  handleLinkLongPress(link) {
    this.setState({
      isLongPressMenuOpen: true,
      longPressedLink: link
    });

    console.log("handleLinkLongPress for link", link);
  }

  handleSaveForLater = () => {
    console.log("handleSaveForLater for link id", this.state.longPressedLink.id);

    Meteor.call("content/saveForLater", this.state.longPressedLink.id, (error, result) => {
      if (error) {
        this.sendJinaResponse(error);
      }

      this.setState({
        isLongPressMenuOpen: false,
        longPressedLink: null
      });
    });
  };

  handleReport = () => {
    console.log("handleReport for link id", this.state.longPressedLink.id);

    this.setState({
      isLongPressMenuOpen: false,
      longPressedLink: null
    });
  };

  render() {
    const userIsTypingPassword = (this.state.authenticating && this.state.userName.length > 0) ||
      (this.state.registering && this.state.userName.length > 0 && this.state.email.length > 0 && this.state.gender.length > 0);

    return [
      <Header {...this.props} />,
      <Conversation
        messages={this.state.conversation}
        suggestions={this.state.suggestions}
        botIsTyping={this.state.isTyping}
        onSuggestionClicked={this.handleSuggestionClicked}
        onAvatarClicked={this.handleAvatarClicked}
        onLinkLongPress={this.handleLinkLongPress}
      />,
      <LongPressMenu
        visible={this.state.isLongPressMenuOpen}
        onSaveForLaterClick={this.handleSaveForLater}
        onReportClick={this.handleReport}
      />,
      <MessageBox
        {...this.props} // Passing history
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
  allContent.depend();

  if (Meteor.subscribe("users").ready() && allContent.ready()) {
    onData(null, {
      user: Meteor.user(),
      content: allContent
    });
  }
}

export default compose(
  getTrackerLoader(dataLoader)
)(Chat);
