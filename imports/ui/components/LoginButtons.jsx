import React from 'react';
import PropTypes from "prop-types";
import Blaze from 'meteor/gadicc:blaze-react-component';

export default class LoginButtons extends React.Component {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    return <Blaze template="loginButtons" align={this.props.align} />
  }
}

LoginButtons.propTypes = {
  align: PropTypes.string,
}

LoginButtons.defaultProps = {
  align: 'right',
}
