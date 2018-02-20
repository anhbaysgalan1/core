import { Meteor } from "meteor/meteor";
import i18n from "meteor/universe:i18n";
import { analytics } from "meteor/okgrow:analytics";

import React, { Component } from "react";
import { compose } from "react-komposer";

import { Conversation, MessageBox, Header, LongPressMenu } from "../components";
import { getCategoryBySlug } from "/imports/api/Category";

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
      isLongPressMenuOpen: false,
      linkClickCounter: 0,
      discoverLoopCounter: 0,
      showCategoryPicker: false
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
    const displayedSuggestions = [];

    for (const suggestionIndex in suggestions) {
      if (suggestions.hasOwnProperty(suggestionIndex)) {
        const delay = (suggestionIndex + 1) * 30;

        if (suggestions[suggestionIndex].image) {
          (new Image()).src = suggestions[suggestionIndex].image;
        }

        setTimeout(() => {
          displayedSuggestions.push(suggestions[suggestionIndex]);

          this.setState({
            suggestions: displayedSuggestions
          });
        }, delay);
      }
    }

    this.setState({
      onSuggestionChoice: resolve // Passing the resolve reference
    });
  });

  awaitReply = (suggestions) => new Promise((resolve, reject) => {
    this.setState({
      onReply: resolve // Passing the resolve reference
    }, () => {
      this.messageInput.focus();
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
    import partOfDay from "humanized-part-of-day";

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

  getRandomSkill() {
    import sample from "lodash/sample";

    const userSkills = Meteor.user().profile.skills;

    const randomSkill = sample(userSkills).slug;

    const skillTitle = getCategoryBySlug(randomSkill).title;

    if (this.state.latestDiscover && skillTitle === this.state.latestDiscover.skill) {
      return this.getRandomSkill();
    }

    return skillTitle;
  }

  showBriefing() {
    if (Meteor._localStorage.getItem("contentOverUntil") > new Date().getTime()) {
      const unlockTime = new Date();
      unlockTime.setTime(Meteor._localStorage.getItem("contentOverUntil"));

      this.sendJinaResponse(i18n.__("CONTENT_OVER_PRECISE", {
        time: `${unlockTime.getHours()}:${unlockTime.getMinutes()}:${unlockTime.getSeconds()}`
      }));
    } else {
      this.sendJinaResponse(i18n.__("ANORAK_BRIEFING_INTRO"))
        .then(() => this.awaitSuggestionChoice([
          i18n.__("SUGGESTION_COURSE"),
          i18n.__("SUGGESTION_VIDEO"),
          i18n.__("SUGGESTION_ARTICLE")
        ]))
        .then((message) => {
          this.setState({ onSuggestionChoice: null });

          const skill = this.getRandomSkill();

          if (message.includes(i18n.__("VIDEO"))) {
            this.displayDiscover("video", skill);
          } else if (message.includes(i18n.__("COURSE"))) {
            this.displayDiscover("classes", skill);
          } else if (message.includes(i18n.__("ARTICLE"))) {
            this.displayDiscover("article", skill);
          } else {
            this.sendJinaResponse(i18n.__("ANORAK_UNDERSTANDING_ERROR"));
          }
        });
    }
  }

  /**
   * Display data from the Discover Program (random atm)
   *
   * @param type
   * @param skill
   */

  displayDiscover(type, skill) {
    if (Meteor._localStorage.getItem("contentOverUntil") && Meteor._localStorage.getItem("contentOverUntil") > new Date().getTime()) {
      this.sendJinaResponse(i18n.__("CONTENT_OVER"))
    } else {
        Meteor.callPromise("content/getRandomFromCategory", type, skill)
        .then((content) => {
          const filteredContent = content.map((row) => ({
            id: row.row_id,
            type: row.material_type,
            categories: row.categories,
            title: row.title,
            link: row.link,
            image: row.image || "http://via.placeholder.com/150x100",
            description: row.description || "Lorem ipsum dolor sit amet..."
          }));

          if (filteredContent.length < 1) {
            return this.displayDiscover(type, this.getRandomSkill());
          } else {
            this.setState({
              latestDiscover: {
                skill,
                type
              }
            });

            import { AllHtmlEntities } from "html-entities";

            const entities = new AllHtmlEntities();

            this.sendJinaResponse(i18n.__("BEFORE_SHOWING_CONTENT", { skill: entities.decode(skill) }), { noDelay: true });
          }

          filteredContent.push(i18n.__("CONTINUE_DISCOVER_PROGRAM"));
          filteredContent.push(i18n.__("CHANGE_CATEGORY"));
          filteredContent.push(i18n.__("START_OVER"));

          return this.awaitSuggestionChoice(filteredContent);
        });
    }
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

    if (typedMessage.includes(i18n.__("CONTINUE_DISCOVER_PROGRAM")) ||
      typedMessage.includes(i18n.__("CHANGE_CATEGORY")) ||
      typedMessage.includes(i18n.__("START_OVER"))) {
      this.setState({
        discoverLoopCounter: this.state.discoverLoopCounter + 1
      }, () => {
        if (this.state.discoverLoopCounter === 7) {
          const currentDate = new Date();
          Meteor._localStorage.setItem("contentOverUntil", currentDate.getTime() + 4 * 3600 * 1000);
        }

        if (typedMessage.includes(i18n.__("CONTINUE_DISCOVER_PROGRAM"))) {
          this.displayDiscover(this.state.latestDiscover.type, this.state.latestDiscover.skill);
        } else if (typedMessage.includes(i18n.__("CHANGE_CATEGORY"))) {
          this.displayDiscover(this.state.latestDiscover.type, this.getRandomSkill());
        } else if (typedMessage.includes(i18n.__("START_OVER"))) {
          this.setState({ latestDiscover: null });

          this.showBriefing();
        }
      });
    }

    const userIsTypingPassword = (authenticating && userName.length > 0) ||
      (registering && userName.length > 0 && email.length > 0 && gender.length > 0);

    if (userIsTypingPassword) {
      // If user has typed a pasword, replace characters by dots before pushing it to conversation

      typedMessage = Array.prototype.map.call(typedMessage, () => "●");
    }

    // Push message to conversation
    conversation.push({ sender: "me", text: typedMessage });

    if (onReply) {
      this.setState({ typedMessage: "" });

      return onReply(typedMessage);
    }

    if (onSuggestionChoice) {
      if (this.state.latestDiscover) {
        if (typedMessage.includes(i18n.__("VIDEO"))) {
          this.displayDiscover("video", this.state.latestDiscover.skill);
        } else if (typedMessage.includes(i18n.__("ARTICLE"))) {
          this.displayDiscover("article", this.state.latestDiscover.skill);
        } else if (typedMessage.includes(i18n.__("COURSE"))) {
          this.displayDiscover("classes", this.state.latestDiscover.skill);
        }
      }

      this.setState({ conversation, typedMessage: "" });

      return onSuggestionChoice(typedMessage);
    }

    if (!userIsTypingPassword && typedMessage && typedMessage.toLowerCase().includes(i18n.__("STUDENT"))) {
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
          if (Meteor.isProduction) {
            analytics.identify(Meteor.userId(), {
              email: Meteor.user().emails[0].address,
              name: Meteor.user().username
            });
          }

          this.greet();
        }
      });
    }
    // If user is registering and has typed password, attempt to register
    else if (registering && userIsTypingPassword) {
      import { Accounts } from "meteor/accounts-base";

      Accounts.createUser({
        username: userName,
        email: email,
        password: this.state.typedMessage, // State reference to typedMessage because local one is obfuscated
        profile: {
          avatar: this.state.avatar,
          level: 1,
          xp: 0,
          tokens: 0
        }
      }, (err) => {
        if (err) {
          this.sendJinaResponse(i18n.__("JINA_ERROR_SOMETHING_WENT_WRONG", { err }));
        } else {
          // Greet new user

          if (Meteor.isProduction) {
            analytics.identify(Meteor.userId(), {
              email: Meteor.user().emails[0].address,
              name: Meteor.user().username
            });
          }

          this.sendJinaResponse(i18n.__("ANORAK_REGISTRATION_CATEGORY_PICK"))
            .then(() => this.setState({ showCategoryPicker: true }));
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

  sendImage(url) {
    return new Promise((resolve, reject) => {
      const conversation = this.state.conversation;

      conversation.push({
        sender: "jina",
        type: "image",
        big: true,
        isBot: true,
        url
      });

      this.setState({ conversation }, () => resolve());
    });
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
      let delay = 500 + 10 * message.length;

      if (options.extraDelay && parseInt(options.extraDelay)) {
        delay = delay + options.extraDelay;
      }

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
        this.messageInput.focus();

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
    if (url !== "/avatar_win.png") {
      this.setState({
        avatar: url,
        suggestions: [],
        onSuggestionChoice: null,
        conversation: [
          ...this.state.conversation,
          { type: "image", url }
        ]
      }, () => this.sendJinaResponse(i18n.__("UNDERMIND_REGISTRATION_PASSWORD_PROMPT", { userName: this.state.userName })));
    }
  }

  handleLinkLongPress(link) {
    this.setState({
      isLongPressMenuOpen: true,
      longPressedLink: link
    });
  }

  handleLinkClickStop = (enough, link) => {
    if (!enough) {
      this.setState({
        linkClickCounter: this.state.linkClickCounter + 1 // For some reason, the click event is fired twice. Here we wait for the second one.
      }, () => {
        if (this.state.linkClickCounter >= 2) {
          this.sendJinaResponse(i18n.__("ANORAK_DID_YOU_FINISH"))
            .then(() => this.awaitSuggestionChoice([i18n.__("SUGGESTION_YES"), i18n.__("SUGGESTION_NO")]))
            .then(async (finished) => {
              if (finished === i18n.__("SUGGESTION_YES")) {
                await this.sendJinaResponse(i18n.__("ANORAK_CONGRATULATIONS"))
                  .then(() => Meteor.call("user/awardPoints", link.type, link.categories, (error, summary) => {
                    this.sendImage("/avatar_win.png")
                      .then(async () => await this.sendJinaResponse(i18n.__("ANORAK_POINTS_SUMMARY", summary)));
                  }));
              } else {
                await this.sendJinaResponse(i18n.__("ANORAK_SAVE_FOR_LATER"))
                  .then(() => this.awaitSuggestionChoice([i18n.__("SUGGESTION_YES"), i18n.__("SUGGESTION_NO")]))
                  .then((saveForLater) => {
                    if (saveForLater === i18n.__("SUGGESTION_YES")) {
                      Meteor.call("content/saveForLater", link.id, async (error) => {
                        await this.sendJinaResponse(i18n.__("ANORAK_SAVED_FOR_LATER"));
                      });
                    }
                  });
              }
            })
            .then(() => this.sendJinaResponse(i18n.__("KEEP_LEARNING"), { extraDelay: 500 }))
            .then(() => this.awaitSuggestionChoice([
              i18n.__("SUGGESTION_YES"),
              i18n.__("SUGGESTION_CALL_IT_A_DAY")
            ]))
            .then((choice) => {
              if (choice.includes(i18n.__("SUGGESTION_YES"))) {
                const skill = this.getRandomSkill();

                return this.displayDiscover(this.state.latestDiscover.type, skill);
              } else if (choice.includes(i18n.__("SUGGESTION_CALL_IT_A_DAY"))) {
                return this.sendJinaResponse(i18n.__("BYE"));
              } else {
                return this.sendJinaResponse(i18n.__("ANORAK_UNDERSTANDING_ERROR"));
              }
            });

          this.setState({ linkClickCounter: 0 });
        }
      });
    }
  }

  handleCategoryPickingOver = (categories) => {
    this.setState({ showCategoryPicker: false });

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

    this.sendJinaResponse(i18n.__("ANORAK_REGISTRATION_WELCOME_1"))
      .then(() => this.sendJinaResponse(i18n.__("ANORAK_REGISTRATION_WELCOME_2")))
      .then(() => {
        this.setState({ registering: false });

        return this.sendJinaResponse(i18n.__("ANORAK_REGISTRATION_WELCOME_3"));
      })
      .then(() => this.awaitSuggestionChoice([i18n.__("SUGGESTION_I_M_READY")]))
      .then(() => this.greet());
  }

  handleSaveForLater = () => {
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
    Meteor.call("content/report", this.state.longPressedLink.link);

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
        showCategoryPicker={this.state.showCategoryPicker}
        onSuggestionClicked={this.handleSuggestionClicked}
        onAvatarClicked={this.handleAvatarClicked}
        onLinkLongPress={this.handleLinkLongPress}
        onLinkClickStop={this.handleLinkClickStop}
        onPickingOver={this.handleCategoryPickingOver}
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
        setMessageInputRef={(node) => { this.messageInput = node }}
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
  if (Meteor.subscribe("users").ready() && Meteor.subscribe("categories").ready()) {
    onData(null, {
      user: Meteor.user()
    });
  }
}

export default compose(
  getTrackerLoader(dataLoader)
)(Chat);
