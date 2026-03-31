import React, {useState, useCallback, useEffect} from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Redirect } from 'react-router-dom/cjs/react-router-dom.min';

import Users from './user/pages/Users';
import UserPlaces from './places/pages/UserPlaces';
import NewPlace from './places/pages/NewPlace';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import UpdatePlace from './places/pages/UpdatePlace';
import Auth from './user/pages/Auth';
import { AuthContext } from './shared/context/auth-context-';

let logoutTimer;

const App = () => {
  const [token, setToken] = useState(false);
  const [userId, setUserId] = useState(false);

  const [expirationDate, setExpirationDate] = useState();

  const login =  useCallback((uid, token, expirationDate) => {
    setToken(token);
    setUserId(uid);
    const tokenExpirationDate = expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    setExpirationDate(tokenExpirationDate);
    localStorage.setItem(
      'userData', 
      JSON.stringify({
          userId: uid,
          token: token, 
          expiration: tokenExpirationDate.toISOString()
        }
      )
    );
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    setExpirationDate(null);
    localStorage.removeItem('userData')
  }, []);

  useEffect(() => {
    if (token && expirationDate) {
      const remaingingTime = expirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remaingingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, expirationDate]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData'));

    if (storedData && storedData.token &&  new Date(storedData.expiration) > new Date()) {
      login(storedData.userId, storedData.token, new Date(storedData.expiration));
    }

  }, [login]);

  let routes;

  if (token) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>
        <Route path="/places/new" exact>
          <NewPlace />
        </Route>
        <Route path="/places/:placeId" >
          <UpdatePlace />
        </Route>
        <Redirect to="/"/>
      </Switch>
    );
  }else {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>
        <Route path="/auth" exact >
          <Auth />
        </Route>
        <Redirect to="/auth"/>
      </Switch>
    );
  }

  return (
  <AuthContext.Provider value=
    {{
      isLoggedIn: !!token, 
      token: token,
      userId: userId, 
      login: login, 
      logout: logout
    }}
  >
    <Router>
      <MainNavigation/>
      <main>
        {routes} 
      </main>
    </Router>
  </AuthContext.Provider>
  );
};

export default App;
