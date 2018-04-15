import { Meteor } from "meteor/meteor";
import i18n from "meteor/universe:i18n";
import { analytics } from "meteor/okgrow:analytics";
import React, { Component } from "react";
import { compose } from "react-komposer";

import getPlatformId from "/lib/DeviceDetect";
import { Conversation, MessageBox } from "../components";
import { getCategoryBySlug } from "/imports/api/Category";
import { SavedForLater } from "/imports/api/SavedForLater";

class Chat extends Component {
  constructor() {
    super();

    this.state = {
      conversation: [
        { sender: "jina", text: i18n.__("BOT_GREETING") }
      ],
      suggestions: [i18n.__("SUGGESTION_I_AM_MEMBER"), i18n.__("SUGGESTION_I_AM_NEWCOMER")],
      typedMessage: "",
      userName: "",
      email: "",
      gender: "",
      isLongPressMenuOpen: false,
      linkClickCounter: 0,
      discoverLoopCounter: 0,
      showCategoryPicker: false,
      isRecordingPassword: false,
      password: "",
      firstPassword: "",
      isSearchMode: false,
      lastSearchTerm: ""
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
  }

  awaitSuggestionChoice = (suggestions) => new Promise((resolve, reject) => {
    const displayedSuggestions = [];

    for (const suggestionIndex in suggestions) {
      if (suggestions.hasOwnProperty(suggestionIndex)) {
        const delay = (suggestionIndex + 1) * 30;

        // Pre-load image if suggestion is a link for a smoother experience
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

  awaitReply = () => new Promise((resolve, reject) => {
    this.setState({
      onReply: resolve // Passing the resolve reference
    }, () => {
      this.messageInput.focus();
    });
  });

  awaitCategoryPicking = () => new Promise((resolve, reject) => this.setState({
    onCategoriesPicked: resolve,
    showCategoryPicker: true
  }));

  displayAvatars = (resolve) => this.setState({
    suggestions: [
      { type: "image", url: "/avatar/Astronomer_Bright.png" },
      { type: "image", url: "/avatar/Explorer_Bright.png" },
      { type: "image", url: "/avatar/Hacker_Bright.png" },
      { type: "image", url: "/avatar/Musician_Bright.png" },
      { type: "image", url: "/avatar/Scientist_Bright.png" },
      { type: "image", url: "/avatar/Warrior_Bright.png" }
    ],
    onAvatarClick: resolve
  });

  greet = async (isFirstMessage = false) => {
    const partOfDay = await import("humanized-part-of-day");

    // Greet user
    this.sendBotResponse(i18n.__(`BOT_WELCOME_${partOfDay.getCurrent()}`, { name: Meteor.user().username }))
      .then(() => {
        this.showBriefing();
      });
  }

  async getRandomSkill() {
    const sample = await import("lodash/sample");

    const userSkills = Meteor.user().profile.skills;

    const randomSkill = sample.default(userSkills).slug;

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

      this.sendBotResponse(i18n.__("CONTENT_OVER_PRECISE", {
        time: `${unlockTime.getHours()}:${unlockTime.getMinutes()}:${unlockTime.getSeconds()}`
      }));
    } else {
      this.setState({ isSearchMode: true });

      this.sendBotResponse(i18n.__("BOT_BRIEFING_INTRO"))
        .then(() => this.awaitSuggestionChoice([
          i18n.__("SUGGESTION_COURSE"),
          i18n.__("SUGGESTION_VIDEO"),
          i18n.__("SUGGESTION_ARTICLE"),
          i18n.__("SUGGESTION_LECTURE")
        ]))
        .then((message) => {
          this.setState({ onSuggestionChoice: null });

          this.getRandomSkill()
            .then((skill) => {
              if (message.includes(i18n.__("VIDEO"))) {
                this.displayDiscover("video", skill);
              } else if (message.includes(i18n.__("COURSE"))) {
                this.displayDiscover("course", skill);
              } else if (message.includes(i18n.__("ARTICLE"))) {
                this.displayDiscover("article", skill);
              } else if (message.includes(i18n.__("LECTURE"))) {
                this.displayDiscover("lecture", skill);
              } else {
                this.sendBotResponse(i18n.__("BOT_UNDERSTANDING_ERROR"));
              }
            });
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
    this.setState({ lastSearchTerm: "" });

    if (Meteor._localStorage.getItem("contentOverUntil") &&
      parseInt(Meteor._localStorage.getItem("contentOverUntil")) > new Date().getTime()) {
      this.sendBotResponse(i18n.__("CONTENT_OVER"))
    } else {
      Meteor.callPromise("content/getRandomFromCategory", type, skill.split(" ")[0])
        .then((content) => {
          let filteredContent = [];

          if (content) {
            filteredContent = content.map((row) => ({
              id: row.content_id,
              type: row.type_name,
              categories: row.category_name,
              title: row.content_title,
              link: row.content_link,
              image: row.thumbnail_link || "http://via.placeholder.com/150x100",
              community: row.source_name || "",
              isSavedForLater: SavedForLater.findOne({ content: row.content_id })
            }));
          }

          console.dir("filteredContent", filteredContent);

          if (filteredContent.length < 1) {
            this.sendBotResponse(i18n.__("NO_CONTENT_IN_CATEGORY", { skill }), { noDelay: true });

            return this.getRandomSkill().then((nextSkill) => this.displayDiscover(type, nextSkill));
          } else {
            if (Meteor.isProduction) {
              analytics.track("Display discover program", {
                category: skill,
                contentType: type
              });
            }

            this.setState({
              latestDiscover: {
                skill,
                type
              }
            });

            this.sendBotResponse(i18n.__("BEFORE_SHOWING_CONTENT", { skill }), { noDelay: true });
          }

          filteredContent.push(i18n.__("CONTINUE_DISCOVER_PROGRAM"));
          filteredContent.push(i18n.__("CHANGE_CATEGORY"));
          filteredContent.push(i18n.__("START_OVER"));

          return this.awaitSuggestionChoice(filteredContent);
        });
    }
  }

  registerUsernameIfNotTaken = (userName) => new Promise((resolve, reject) => {
    this.setState({
      onReply: null,
      userName
    });

    Meteor.call("user/doesUserExist", userName, (error, result) => {
      if (!error && result) {
        reject();
      } else {
        resolve();
      }
    });
  });

  checkIfUserQuotaNotOver = () => new Promise((resolve, reject) => {
    if (Meteor.users.find().count() > 1000) {
      this.sendBotResponse(i18n.__("BOT_USER_QUOTA_REACHED"))
        .then(() => this.sendBotResponse(i18n.__("BOT_USER_QUOTA_EMAIL_CTA")))
        .then(() => this.setState({
          quotaCtaEmailCapture: true,
          suggestions: [i18n.__("SUGGESTION_EMAIL_CTA_YES"), i18n.__("SUGGESTION_EMAIL_CTA_NO")]
        }));
    } else {
      resolve();
    }
  });

  agreeToPrivacyPolicy = () => new Promise((resolve, reject) => {
    this.sendBotResponse(i18n.__("BOT_REGISTRATION_GREETING"))
      .then(() => this.sendBotResponse(i18n.__("BOT_REGISTRATION_GREETING_2")))
      .then(() => this.awaitSuggestionChoice([
        i18n.__("SUGGESTION_REGISTRATION_PRIVACY_YES"),
        i18n.__("SUGGESTION_REGISTRATION_PRIVACY_NO")
      ]))
      .then((choice) => {
        if (choice.includes(i18n.__("SUGGESTION_REGISTRATION_PRIVACY_YES"))) {
          resolve();
        }
      });
  });

  pickUsername = (isRetry = false, oldResolve = null) => new Promise((resolve, reject) => {
    this.sendBotResponse(i18n.__(isRetry ? "BOT_REGISTRATION_USERNAME_TAKEN" : "BOT_REGISTRATION_PICK_USERNAME", {
      userName: this.state.lastMessage
    }))
      .then(this.awaitReply)
      .then(() => this.registerUsernameIfNotTaken(this.state.lastMessage))
      .then(() => {
        // Username is available

        if (oldResolve) {
          oldResolve();
        } else {
          resolve();
        }
      }, () => {
        // Username is taken

        this.pickUsername(true, resolve);
      })
  });

  pickEmail = () => new Promise((resolve, reject) => {
    this.sendBotResponse(i18n.__("BOT_REGISTRATION_PICK_EMAIL", {
      userName: this.state.userName
    }))
      .then(this.awaitReply)
      .then((email) => {
        this.setState({ email });

        resolve();
      });
  });

  pickGender = () => new Promise((resolve, reject) => {
    this.sendBotResponse(i18n.__("BOT_REGISTRATION_PICK_GENDER"))
      .then(() => this.awaitSuggestionChoice([
        i18n.__("SUGGESTION_GENDER_MALE"),
        i18n.__("SUGGESTION_GENDER_FEMALE")
      ]))
      .then((gender) => {
        this.setState({ gender });

        resolve();
      });
  });

  pickAvatar = () => new Promise((resolve, reject) => {
    this.sendBotResponse(i18n.__("BOT_REGISTRATION_PICK_AVATAR"))
      .then(() => this.displayAvatars(resolve)); // Resolve handler is called when user chooses avatar
  });

  pickPassword = (reason = "", oldResolve = null) => new Promise((resolve, reject) => {
    let message;

    switch (reason) {
      case "LENGTH":
        message = "BOT_REGISTRATION_PASSWORD_LENGTH_ERROR";
        break;

      case "CAPITAL":
        message = "BOT_REGISTRATION_PASSWORD_CAPITAL_ERROR";
        break;

      case "NUMBER":
        message = "BOT_REGISTRATION_PASSWORD_NUMBER_ERROR";
        break;

      case "CONFIRM":
        message = "BOT_REGISTRATION_PASSWORD_CONFIRM";
        break;

      case "NO_MATCH":
        message = "BOT_REGISTRATION_PASSWORD_CONFIRM_NO_MATCH";
        break;

      default:
        message = "UNDERMIND_REGISTRATION_PASSWORD_PROMPT";
        break;
    }

    return this.sendBotResponse(i18n.__(message, { userName: this.state.userName }))
      .then(() => this.setState({ isRecordingPassword: true }))
      .then(this.awaitReply)
      .then(() => {
        const { password } = this.state;

        this.setState({ isRecordingPassword: false });

        if (password.length < 6) {
          this.pickPassword("LENGTH", oldResolve ? oldResolve : resolve);
        } else if (!password.match(/[A-Z]/)) {
          this.pickPassword("CAPITAL", oldResolve ? oldResolve : resolve);
        } else if (!password.match(/[0-9]/)) {
          this.pickPassword("NUMBER", oldResolve ? oldResolve : resolve);
        } else if (reason !== "CONFIRM") {
          this.pickPassword("CONFIRM", oldResolve ? oldResolve : resolve);
        } else if (reason === "CONFIRM" && this.state.firstPassword === this.state.password) {
          if (oldResolve) {
            oldResolve(password);
          } else {
            resolve(password);
          }
        } else {
          this.setState({ firstPassword: "" });
          this.pickPassword("NO_MATCH", oldResolve ? oldResolve : resolve);
        }
      });
  });

  pickAge = () => new Promise((resolve, reject) => {
    this.sendBotResponse(i18n.__("BOT_REGISTRATION_AGE_CHECK"))
      .then(() => this.awaitReply())
      .then((choice) => {
        this.setState({ onReply: null });

        if (parseInt(choice) <= 13) {
          this.sendBotResponse(i18n.__("BOT_REGISTRATION_TOO_YOUNG"));
        } else {
          this.sendBotResponse(i18n.__("BOT_REGISTRATION_AGE_OK"))
            .then(resolve);
        }
      });
  });

  agreeTermsAndConditions = () => new Promise((resolve, reject) => {
    this.sendBotResponse(i18n.__("BOT_REGISTRATION_AGREE_TOC", {
      userName: this.state.userName
    }), {
      link: "http://atlas.undermind.io/terms.html"
    })
      .then(() => this.awaitSuggestionChoice([
        i18n.__("SUGGESTION_AGREE"),
        i18n.__("SUGGESTION_DISAGREE")
      ]))
      .then((choice) => {
        this.setState({ onSuggestionChoice: null });

        if (choice.includes(i18n.__("SUGGESTION_AGREE"))) {
          resolve();
        } else {
          this.sendBotResponse(i18n.__("BOT_REGISTRATION_TOC_NOT_AGREE"));
        }
      });
  });

  finalizeRegistration = () => new Promise(async (resolve, reject) => {
    const { Accounts } = await import("meteor/accounts-base");

    Accounts.createUser({
      username: this.state.userName,
      email: this.state.email,
      password: this.state.password,
      profile: {
        avatar: this.state.avatar,
        level: 1,
        xp: 0,
        tokens: 0
      }
    }, (err) => {
      if (err) {
        this.sendBotResponse(i18n.__("BOT_ERROR_SOMETHING_WENT_WRONG", { err }));
      } else {
        if (Meteor.isProduction) {
          analytics.identify(Meteor.userId(), {
            email: Meteor.user().emails[0].address,
            name: Meteor.user().username
          });
        }

        resolve();
      }
    });
  });

  pickCategories = () => new Promise((resolve, reject) => {
    this.sendBotResponse(i18n.__("BOT_REGISTRATION_CATEGORY_PICK"))
      .then(this.awaitCategoryPicking)
      .then(resolve);
  });

  greetNewUser = () => {
    this.sendBotResponse(i18n.__("BOT_REGISTRATION_WELCOME_1", { userName: this.state.userName }))
      .then(() => this.sendBotResponse(i18n.__("BOT_REGISTRATION_WELCOME_2")))
      .then(() => this.sendBotResponse(i18n.__("BOT_REGISTRATION_WELCOME_3")))
      .then(() => this.awaitSuggestionChoice([i18n.__("SUGGESTION_I_M_READY")]))
      .then(this.greet);
  };

  handleSearch = (term) => {
    const { conversation } = this.state;
    conversation.push({ sender: "me", text: `Search for "${term}"` });

    this.setState({
      conversation,
      typedMessage: "",
      suggestions: [],
      lastSearchTerm: term,
      latestDiscover: null
    });

    return Meteor.callPromise("content/search", term)
      .then((result) => {
        if (result.length < 1) {
          if (Meteor.isProduction) {
            analytics.track("Search", {
              term,
              noResult: true
            });
          }

          this.sendBotResponse(i18n.__("SEARCH_NO_RESULT"), { noDelay: true });
        } else {
          this.sendBotResponse(i18n.__("BEFORE_SHOWING_SEARCH_RESULTS", { term }));

          if (Meteor.isProduction) {
            analytics.track("Search", {
              term
            });
          }
        }

        return result;
      })
      .then((result) => {
        const filteredContent = result.map((row) => ({
          id: row.content_id,
          type: row.type_name,
          categories: row.category_name,
          title: row.content_title,
          link: row.content_link,
          image: row.thumbnail_link || "http://via.placeholder.com/150x100",
          community: row.source_name || "",
          isSavedForLater: SavedForLater.findOne({ content: row.content_id })
        }));

        if (result.length > 0) {
          filteredContent.push(i18n.__("CONTINUE_DISCOVER_PROGRAM"));
        }

        filteredContent.push(i18n.__("START_OVER"));

        return this.awaitSuggestionChoice(filteredContent);
      });
  };

  /**
   * Push typed message into the `conversation` state array, and perform additional operations if needed
   *
   * @param event
   */

  handleMessageSend(event) {
    if (event) event.preventDefault();

    const {
      conversation,
      onSuggestionChoice,
      onReply,
      isRecordingPassword
    } = this.state;

    let typedMessage = this.state.typedMessage;

    this.setState({
      suggestions: [],
      lastMessage: typedMessage
    });

    if (typedMessage.includes(i18n.__("CONTINUE_DISCOVER_PROGRAM")) ||
      typedMessage.includes(i18n.__("CHANGE_CATEGORY")) ||
      typedMessage.includes(i18n.__("START_OVER"))) {

      if (typedMessage.includes(i18n.__("CONTINUE_DISCOVER_PROGRAM")) && this.state.lastSearchTerm.length > 0) {
        return this.handleSearch(this.state.lastSearchTerm);
      }

      this.setState({
        discoverLoopCounter: this.state.discoverLoopCounter + 1
      }, () => {
        if (this.state.discoverLoopCounter === 7) {
          const currentDate = new Date();
          Meteor._localStorage.setItem("contentOverUntil", currentDate.getTime() + 4 * 3600 * 1000);
        }

        if (typedMessage.includes(i18n.__("CONTINUE_DISCOVER_PROGRAM")) && this.state.latestDiscover) {
          this.displayDiscover(this.state.latestDiscover.type, this.state.latestDiscover.skill);
        } else if (typedMessage.includes(i18n.__("CHANGE_CATEGORY"))) {
          this.getRandomSkill().then((skill) => this.displayDiscover(this.state.latestDiscover.type, skill));
        } else if (typedMessage.includes(i18n.__("START_OVER"))) {
          this.setState({ latestDiscover: null });

          this.showBriefing();
        }
      });
    }

    if (isRecordingPassword) {
      if (this.state.password) {
        this.setState({ firstPassword: this.state.password });
      }

      this.setState({ password: typedMessage });

      // If user has typed a password, replace characters by dots before pushing it to conversation

      typedMessage = Array.prototype.map.call(typedMessage, () => "●");
    }

    // Push message to conversation
    conversation.push({ sender: "me", text: typedMessage });

    if (onSuggestionChoice) {
      if (this.state.latestDiscover) {
        if (typedMessage.includes(i18n.__("VIDEO"))) {
          this.displayDiscover("video", this.state.latestDiscover.skill);
        } else if (typedMessage.includes(i18n.__("ARTICLE"))) {
          this.displayDiscover("article", this.state.latestDiscover.skill);
        } else if (typedMessage.includes(i18n.__("COURSE"))) {
          this.displayDiscover("course", this.state.latestDiscover.skill);
        }
      }

      this.setState({ conversation, typedMessage: "" });

      return onSuggestionChoice(typedMessage);
    }

    if (onReply) {
      this.setState({ typedMessage: "" });

      return onReply(typedMessage);
    }

    if (!isRecordingPassword && typedMessage && typedMessage.toLowerCase().includes(i18n.__("STUDENT"))) {
      this.startLoginScript();
    } else if (!isRecordingPassword && typedMessage && typedMessage.toLowerCase().includes(i18n.__("NEWCOMER"))) {
      this.startSignUpScript();
    }

    // If user asks for privacy policy
    if (this.state.privacyPolicyCapture && typedMessage.includes(i18n.__("SUGGESTION_REGISTRATION_PRIVACY_NO"))) {
      this.sendBotResponse(i18n.__("BOT_REGISTRATION_PRIVACY_POLICY"))
        .then(() => this.sendBotResponse(i18n.__("BOT_REGISTRATION_PRIVACY_POLICY_COME_BACK")))
        .then(() => this.setState({
          suggestions: [i18n.__("SUGGESTION_PRIVACY_POLICY_TRUST"), i18n.__("SUGGESTION_PRIVACY_POLICY_NO_TRUST")]
        }));
    }
    // If user doesn't agree to privacy policy
    else if (this.state.privacyPolicyCapture && typedMessage.includes(i18n.__("SUGGESTION_PRIVACY_POLICY_NO_TRUST"))) {
      this.sendBotResponse(i18n.__("BOT_USER_QUOTE_BYE"));

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
   * Send response from Bot
   *
   * @param message
   * @param options : Object (optional)
   */

  sendBotResponse = (message, options = {}) => new Promise(async (resolve, reject) => {
    this.setState({
      isTyping: true,
      onReply: null,
      onSuggestionChoice: null
    });

    const { XmlEntities } = await import("html-entities");

    const entities = new XmlEntities();

    message = entities.decode(message);

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

  getUsername = (oldResolve = null) => new Promise((resolve, reject) => {
    let message = "BOT_LOGIN_USERNAME_PROMPT";

    if (oldResolve) {
      message = "BOT_ERROR_USER_NOT_FOUND";
    }

    this.sendBotResponse(i18n.__(message))
      .then(this.awaitReply)
      .then((username) => {
        this.setState({ onReply: null });

        Meteor.call("user/doesUserExist", username, (error, result) => {
          if (!error && result) {
            // If username exists, store it in state and resolve promise

            this.setState({ userName: username }, () => {
              if (oldResolve) {
                oldResolve();
              } else {
                resolve();
              }
            });
          } else {
            // If username doesn't exist, try again

            this.getUsername(oldResolve ? oldResolve : resolve);
          }
        });
      });
  });

  getPassword = (oldResolve = null) => new Promise(async (resolve, reject) => {
    this.setState({ badPasswordAttempts: 0 });

    let message = "BOT_LOGIN_PASSWORD_PROMPT";

    if (oldResolve) {
      this.setState({ badPasswordAttempts: this.state.badPasswordAttempts + 1 });

      message = "BOT_ERROR_PASSWORD_TRY_AGAIN";
    }

    if (this.state.badPasswordAttempts >= 3) {
      this.sendBotResponse(i18n.__("BOT_ERROR_PASSWORD_FORGOTTEN"));

      const { Accounts } = await import("meteor/accounts-base");

      Meteor.sendResetPasswordEmail(Accounts.findUserByUsername(this.state.userName));
    } else {
      this.sendBotResponse(i18n.__(message, { userName: this.state.userName }))
        .then(() => this.setState({ isRecordingPassword: true }))
        .then(this.awaitReply)
        .then(() => {
          const { password } = this.state;

          this.setState({ onReply: null, isRecordingPassword: false });

          Meteor.loginWithPassword(this.state.userName, password, (err) => {
            if (err) {
              this.sendBotResponse(i18n.__("BOT_ERROR_SOMETHING_WENT_WRONG", { err }))
                .then(() => this.getPassword(oldResolve ? oldResolve : resolve));
            } else {
              if (Meteor.isProduction) {
                analytics.identify(Meteor.userId(), {
                  email: Meteor.user().emails[0].address,
                  name: Meteor.user().username
                });
              }

              if (oldResolve) {
                oldResolve();
              } else {
                resolve();
              }
            }
          });
        });

    }
  });

  /**
   * Start login phase
   */

  startLoginScript() {
    this.getUsername()
      .then(this.getPassword)
      .then(this.greet);
  }

  /**
   * Start sign up phase
   */

  startSignUpScript() {
    this.checkIfUserQuotaNotOver()
      .then(this.pickUsername)
      .then(this.pickEmail)
      .then(this.pickPassword)
      .then(this.pickAge)
      .then(this.pickGender)
      .then(this.pickAvatar)
      .then(this.agreeTermsAndConditions)
      .then(this.finalizeRegistration)
      .then(this.pickCategories)
      .then(this.greetNewUser);
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

  handleLinkClick = (link) => {
    Meteor.call("user/storeAnalyticData", {
      sessionId: Meteor._localStorage.getItem("Meteor.loginToken"),
      contentId: link.id,
      durationSeconds: 1,
      eventStartTime: new Date().toISOString().substr(0, 19).replace('T', ' '),
      eventTypeId: 1, // Open link
      eventMessage: this.state.latestDiscover.type,
      platformId: getPlatformId()
    });

    this.sendBotResponse(i18n.__("BOT_DID_YOU_FINISH"))
      .then(() => this.awaitSuggestionChoice([i18n.__("SUGGESTION_YES"), i18n.__("SUGGESTION_NO")]))
      .then(async (finished) => {
        if (finished === i18n.__("SUGGESTION_YES")) {
          await this.sendBotResponse(i18n.__("BOT_CONGRATULATIONS"))
            .then(() => Meteor.call("user/awardPoints", link.type, link.categories, (error, summary) => {
              this.sendImage("/avatar_win.png")
                .then(async () => await this.sendBotResponse(i18n.__("BOT_POINTS_SUMMARY", summary)));
            }));
        } else {
          await this.sendBotResponse(i18n.__("BOT_SAVE_FOR_LATER"))
            .then(() => this.awaitSuggestionChoice([i18n.__("SUGGESTION_YES"), i18n.__("SUGGESTION_NO")]))
            .then((saveForLater) => {
              if (saveForLater === i18n.__("SUGGESTION_YES")) {
                Meteor.call("content/saveForLater", link.id, async (error) => {
                  await this.sendBotResponse(i18n.__("BOT_SAVED_FOR_LATER"));
                });
              }
            });
        }
      })
      .then(() => this.sendBotResponse(i18n.__("KEEP_LEARNING"), { extraDelay: 500 }))
      .then(() => this.awaitSuggestionChoice([
        i18n.__("SUGGESTION_YES"),
        i18n.__("SUGGESTION_CALL_IT_A_DAY")
      ]))
      .then((choice) => {
        if (choice.includes(i18n.__("SUGGESTION_YES"))) {
          return this.getRandomSkill()
            .then((skill) => this.displayDiscover(this.state.latestDiscover.type, skill));
        } else if (choice.includes(i18n.__("SUGGESTION_CALL_IT_A_DAY"))) {
          return this.sendBotResponse(i18n.__("BYE"));
        } else {
          return this.sendBotResponse(i18n.__("BOT_UNDERSTANDING_ERROR"));
        }
      });
  };

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
      }, () => this.state.onAvatarClick());
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

    this.state.onCategoriesPicked();
  };

  handleSaveForLater = (id) => {
    if (SavedForLater.findOne({ content: id })) {
      Meteor.call("removeSavedForLaterContent", id, (error, result) => {
        if (error) {
          this.sendBotResponse(error);
        }
      });
    } else {
      Meteor.call("content/saveForLater", id, (error, result) => {
        if (error) {
          this.sendBotResponse(error);
        }
      });
    }
  };

  handleReport = () => {
    Meteor.call("content/report", this.state.longPressedLink.link);

    this.setState({
      isLongPressMenuOpen: false,
      longPressedLink: null
    });
  };

  render() {
    return [
      <Conversation
        messages={this.state.conversation}
        suggestions={this.state.suggestions}
        botIsTyping={this.state.isTyping}
        showCategoryPicker={this.state.showCategoryPicker}
        onSuggestionClicked={this.handleSuggestionClicked}
        onAvatarClicked={this.handleAvatarClicked}
        onPickingOver={this.handleCategoryPickingOver}
        onSaveForLaterClick={this.handleSaveForLater}
        onReportClick={this.handleReport}
        onLinkClick={this.handleLinkClick}
        key={"conversation"}
      />,
      <MessageBox
        {...this.props} // Passing history
        message={this.state.typedMessage}
        isRecordingPassword={this.state.isRecordingPassword}
        isSearchMode={this.state.isSearchMode}
        onSend={this.handleMessageSend}
        onChange={this.handleMessageChange}
        onSearch={this.handleSearch}
        setMessageInputRef={(node) => { this.messageInput = node }}
        key={"messageBox"}
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
  if (Meteor.subscribe("users").ready() &&
    Meteor.subscribe("categories").ready() &&
    Meteor.subscribe("savedForLater").ready()) {
    onData(null, {
      user: Meteor.user()
    });
  }
}

export default compose(
  getTrackerLoader(dataLoader)
)(Chat);
