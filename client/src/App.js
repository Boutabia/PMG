import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from "react";
import './App.css';
import Login from './components/Login';
import {
  BrowserRouter as Router,
  Switch, Route, Link
} from "react-router-dom";
import Home from './home';
import AddScenarioForm from "./addScenarioForm";
import AuthService from "./services/auth.service";
import Profile from "./components/Profile";
import Scenarios from "./components/Scenarios";
import Navbar from "react-bootstrap/Navbar";

const App = () => {
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    const user = AuthService.getCurrentUser();

    if (user) {
      setCurrentUser(user);
    }
  }, []);

  useEffect(() => {
    let d = new Date();
    const expired = localStorage.getItem("expiration") <  d.getTime();
    if (expired) {
      logOut();
    } 
  }, []);

  const logOut = () => {
    AuthService.logout();
  };

  return (
    <div className="App">
      <div>
        <Router>
          <Navbar variant="dark">
            <Link to={"/"} className="navbar-brand">
              PMG
            </Link>
            

              {currentUser && (
                <div className="navbar-nav mr-auto">
                  <li className="nav-item">
                    <Link to={"/scenarios"} className="nav-link">
                      Scenarios
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to={"/addScenario"} className="nav-link">
                      Add New Scenario
                    </Link>
                  </li>
                </div>
              )}

            {currentUser ? (
              <div className="navbar-nav ml-auto">
                <li className="nav-item">
                  <Link to={"/profile"} className="nav-link">
                    {currentUser.username}
                  </Link>
                </li>
                <li className="nav-item">
                  <a href="/login" className="nav-link" onClick={logOut}>
                    Log Out
                  </a>
                </li>
              </div>
            ) : (
              <div className="navbar-nav ml-auto">
                <li className="nav-item">
                  <Link to={"/login"} className="nav-link">
                    For Teachers
                  </Link>
                </li>
              </div>
            )}
          </Navbar>

          <div className="container mt-3">
            <Switch>
              <Route exact path={"/"} component={Home} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/profile" component={Profile} />
              <Route path="/scenarios" component={Scenarios} />
              <Route path="/addScenario" component={AddScenarioForm} />
            </Switch>
          </div>
        </Router>
      </div>
    </div>
  );
};

export default App;
