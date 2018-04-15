import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import i18n from "meteor/universe:i18n";

import "normalize.css";

import Header from "../components/Header";
import Profile from "./Profile";
import Chat from "./Chat";
import SavedForLater from "./SavedForLater";
import Settings from "./SettingsContainer";
import NotFound from "../pages/NotFound.jsx";

function getLang () {
  return (
    // navigator.languages && navigator.languages[0] ||
    // navigator.language ||
    // navigator.browserLanguage ||
    // navigator.userLanguage ||
    "en-US"
  );
}

i18n.setLocale(getLang());

export default class MainLayout extends React.Component {
  render() {
    return (
      <Router>
        <div>
          <Header />
          <main>
            <Switch>
              <Route exact path="/" name="Chat" component={Chat} />
              <Route path="/profile" name="Profile" component={Profile} />
              <Route path="/savedForLater" name="Bookmarks" component={SavedForLater} />
              <Route path="/settings" name="Settings" component={Settings} />
              <Route name="404 Not Found" component={NotFound} />
            </Switch>
          </main>
        </div>
      </Router>
    );
  }
}
