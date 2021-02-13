import React, { lazy, Suspense, useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import PrivateRoute from "components/PrivateRoute";
import FullscreenLoader from "components/FullscreenLoader";
import Layout from "components/Layout";
import { useSelector } from "react-redux";
import { selectAuth, useCheck } from "features/auth/authSlice";

const Dashboard = lazy(() => import("features/dashboard/Dashboard"));
const Login = lazy(() => import("features/auth/Login"));

function App() {
  const { isAuthenticating, isLoggingOut } = useSelector(selectAuth);
  const check = useCheck();

  useEffect(() => {
    check();
  }, []);

  return (
    <>
      {isAuthenticating || isLoggingOut ? (
        <FullscreenLoader open />
      ) : (
        <Layout>
          <Suspense fallback={<FullscreenLoader open />}>
            <Switch>
              <Route path="/" exact>
                <Login />
              </Route>
              <PrivateRoute path="/d">
                <Route path="/d" component={Dashboard} />
              </PrivateRoute>
            </Switch>
          </Suspense>
        </Layout>
      )}
    </>
  );
}
export default App;
