import React, { lazy, Suspense } from "react";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import PrivateRoute from "components/PrivateRoute";
import FullscreenLoader from "components/FullscreenLoader";
import Layout from "components/Layout";
import { useSelector } from "react-redux";
import { selectAuth } from "features/auth/authSlice";

const Dashboard = lazy(() => import("features/dashboard/Dashboard"));
const Login = lazy(() => import("features/auth/Login"));

function App() {
  const { isAuthenticating, isLoggingOut } = useSelector(selectAuth);
  return (
    <Router>
      {isAuthenticating || isLoggingOut ? (
        <FullscreenLoader open />
      ) : (
        <Layout>
          <Suspense fallback={<FullscreenLoader open />}>
            <Switch>
              <Route path="/" exact component={Login} />
              <PrivateRoute path="/d">
                <Route path="/d" exact component={Dashboard} />
              </PrivateRoute>
            </Switch>
          </Suspense>
        </Layout>
      )}
    </Router>
  );
}
export default App;
