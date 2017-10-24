import React, { Component } from "react";

import { Conversation, MessageBox } from "../components";

class Chat extends Component {
  constructor() {
    super();

    this.state = {
      conversation: [
        { sender: "jina", text: "Hey there, fellow learner! Who are you?" }
      ],
      suggestions: ["I'm a student", "I'm a newcomer"],
      typedMessage: ""
    };

    this.handleMessageSend = this.handleMessageSend.bind(this);
    this.handleMessageChange = this.handleMessageChange.bind(this);
    this.handleSuggestionClicked = this.handleSuggestionClicked.bind(this);
  }

  handleMessageSend(event) {
    if (event) event.preventDefault();

    const conversation = this.state.conversation;
    const typedMessage = this.state.typedMessage;
    conversation.push({ sender: "me", text: typedMessage });

    setTimeout(() => {
      conversation.push({ sender: "jina", text: typedMessage });
      this.setState({
        conversation
      });
    }, 1000);

    this.setState({
      conversation,
      typedMessage: ""
    });
  }

  handleMessageChange(event) {
    this.setState({ typedMessage: event.target.value });
  }

  handleSuggestionClicked(suggestion) {
    this.setState({ typedMessage: suggestion }, () => {
      this.handleMessageSend()
    });
  }

  render() {
    return [
      <Conversation messages={this.state.conversation} />,
      <MessageBox
        message={this.state.typedMessage}
        suggestions={this.state.suggestions}
        onSend={this.handleMessageSend}
        onChange={this.handleMessageChange}
        onSuggestionClicked={this.handleSuggestionClicked}
      />
    ];
  }
}

export default Chat;
