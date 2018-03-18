import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import i18n from "meteor/universe:i18n";

import "normalize.css";

import Header from "../components/Header";
import Profile from "./Profile";
import Chat from "./Chat";
import SavedForLater from "./SavedForLater";
import About from '../pages/About.jsx';
import NotFound from '../pages/NotFound.jsx';

function getLang () {
  return (
    // navigator.languages && navigator.languages[0] ||
    // navigator.language ||
    // navigator.browserLanguage ||
    // navigator.userLanguage ||
    'en-US'
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
              <Route exact path='/' component={Chat} />
              <Route path='/profile' component={Profile} />
              <Route path='/about' component={About} />
              <Route path='/savedForLater' component={SavedForLater} />
              <Route component={NotFound} />
            </Switch>
          </main>
        </div>
      </Router>
    );
  }
}
