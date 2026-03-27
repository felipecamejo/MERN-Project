import React, {useState, useCallback} from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Redirect } from 'react-router-dom/cjs/react-router-dom.min';

import Users from './user/pages/Users';
import UserPlaces from './places/pages/UserPlaces';
import NewPlace from './places/pages/NewPlace';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import UpdatePlace from './places/pages/UpdatePlace';
import Auth from './user/pages/Auth';
import { AuthContext } from './shared/context/auth-context-';

const App = () => {
  const [isLoggedIn, setIsLoggedin] = useState(false);
  const [userId, setUserId] = useState(false);

  const login =  useCallback((uid) => {
    setIsLoggedin(true);
    setUserId(uid);
  }, []);

  const logout = useCallback(() => {
    setIsLoggedin(false);
    setUserId(null);
  }, []);

  let routes;

  if (isLoggedIn) {
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
  <AuthContext.Provider value={{isLoggedIn: isLoggedIn, userId: userId, login: login, logout: logout}}>
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
