import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import queryString from 'query-string';

import { contextShape } from '../../../utils/context';
import storageHelper from '../../../utils/storageHelper';
import MarkupWrapper from './MarkupWrapper';

class LoginScreen extends React.Component {
  state = {
    username: '',
    password: '',
    error: null,
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  handleInputChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();

    axios.post('/api/auth/login', {
      username: this.state.username,
      password: this.state.password,
    })
      .then((response) => {
        storageHelper.setData({
          user: response.data.user,
          token: response.data.token,
        });
        axios.defaults.headers.common.Authorization = `Bearer ${response.data.token}`;
        this.props.context.setUser(response.data.user);

        const decodedParams = queryString.parse(window.location.search);
        this.props.history.push(decodedParams.redirectUrl);
      }, (error) => {
        const isValidationError = error.response.status >= 400 && error.response.status < 500;
        if (isValidationError) {
          this.setState({ error: error.response.data.error });
        } else {
          // eslint-disable-next-line no-alert
          window.alert(error);
        }
      });
  }

  render() {
    const errorBox = (
      <div className="error">
        {this.state.error}
      </div>
    );

    return (
      <MarkupWrapper>
        <form onSubmit={this.handleSubmit}>
          <input type="text" value={this.state.username} onChange={this.handleInputChange} name="username" placeholder="Username" />
          <input type="password" value={this.state.password} onChange={this.handleInputChange} name="password" placeholder="Password" />
          <div className="button-box">
            <button className="btn btn--inverted">Sign in</button>
          </div>
          {this.state.error && errorBox}
        </form>
      </MarkupWrapper>
    );
  }
}

LoginScreen.propTypes = {
  history: PropTypes.object.isRequired,
  context: contextShape.isRequired,
};

export default LoginScreen;
