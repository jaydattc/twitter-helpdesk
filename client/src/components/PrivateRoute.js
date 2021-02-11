import { selectAuth } from "features/auth/authSlice";
import PropTypes from "prop-types";
import React from "react";
import { useSelector } from "react-redux";
import { Redirect, Route, useLocation } from "react-router-dom";

function PrivateRoute({ children, ...rest }) {
  const location = useLocation();
  const { isAuthenticated } = useSelector(selectAuth);
  return (
    <Route
      {...rest}
      render={() =>
        isAuthenticated ? (
          children
        ) : (
          <Redirect to={{ pathname: "/", state: { referrer: location } }} />
        )
      }
    />
  );
}

PrivateRoute.propTypes = {
  children: PropTypes.any,
};

export default PrivateRoute;
