import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import i18n from "meteor/universe:i18n";

import "normalize.css";

import Chat from "./Chat";
import About from '../pages/About.jsx';
import NotFound from '../pages/NotFound.jsx';

function getLang () {
  return (
    navigator.languages && navigator.languages[0] ||
    navigator.language ||
    navigator.browserLanguage ||
    navigator.userLanguage ||
    'en-US'
  );
}

i18n.setLocale(getLang());

export default class MainLayout extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path='/' component={Chat} />
          <Route path = '/about' component={About} />
          <Route component={NotFound} />
        </Switch>
      </Router>
    );
  }
}
