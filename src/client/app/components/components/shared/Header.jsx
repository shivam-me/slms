import React from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';

import { GlobalContextConsumer } from '../../ContextHelpers';

const Header = ({ history }) => (
  <GlobalContextConsumer>
    {(context) => {
      const { user } = context;

      const handleLogout = (e) => {
        e.preventDefault();

        window.localStorage.removeItem('token');
        context.setUser(null);

        history.push('/');
      };

      const unauthorizedLinks = (
        <React.Fragment>
          <Link className="sign-in" to="/login">Sign in</Link>
          <a className="btn" href="https://medium.com/m/signin?redirect=https%3A%2F%2Fblog.kentcdodds.com%2F&operation=register" target="_blank" rel="noopener noreferrer">
            Get started
          </a>
        </React.Fragment>
      );

      const authorizedLinks = (
        <React.Fragment>
          <span>user: {user && user.username}</span>
          {' | '}
          <a href="#" onClick={handleLogout}>Sign out</a>
        </React.Fragment>
      );

      return (
        <header className="page">
          <div className="inner">
            <div className="link-set">
              <Link className="logo" to="/" />
            </div>
            <div className="actions">
              {!user ? unauthorizedLinks : authorizedLinks}
            </div>
          </div>
        </header>
      );
    }}
  </GlobalContextConsumer>
);

Header.propTypes = {
  history: PropTypes.object.isRequired,
};

const HeaderWithRouter = withRouter(Header);

export default HeaderWithRouter;

/* eslint max-len: off */
