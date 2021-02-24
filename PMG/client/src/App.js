import 'bootstrap/dist/css/bootstrap.min.css';
import "../node_modules/bootstrap/dist/css/bootstrap.css";
import React, { useState, useEffect } from "react";
import './App.css';
import UserHome from "./components/User/pages/Home";
import NotFound from "./components/User/pages/NotFound";
import AddUser from "./components/User/users/AddUser";
import EditUser from "./components/User/users/EditUser";
import User from "./components/User/users/User";
import Login from './components/Login';
import {
  BrowserRouter as Router,
  Switch, Route, Link
} from "react-router-dom";
import Home from './home';
import AddScenarioForm from "./components/addScenarioForm";
import AuthService from "./services/auth.service";
import Scenarios from "./components/Scenarios";
import Navbar from "react-bootstrap/Navbar";
import AboutUs from './components/AboutUs';
import GameView from "./GameView";

const App = () => {
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentRole, setCurrentRole] = useState(undefined);

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    const role = AuthService.getCurrentRole();
    

    if (user) {
      setCurrentUser(user);
      setCurrentRole(role);
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
                    <Link to={"/addscenario"} className="nav-link">
                      Add New Scenario
                    </Link>
                  </li>
                  {currentRole ==="superuser" && (
                  <li className="nav-item">
                    <Link to={"/users"} className="nav-link">
                      Users
                    </Link>
                  </li>
                  )}
                </div>
              )}

            {currentUser ? (
              <div className="navbar-nav ml-auto">
                <li className="nav-item">
                  <Link to={"/aboutus"} className="nav-link">
                    About Us
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
                  <Link to={"/aboutus"} className="nav-link">
                    About Us
                  </Link>
                </li>
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
              <Route exact path={"/aboutus"} component={AboutUs} />
              <Route exact path="/login" component={Login} />
              <Route path="/scenarios" component={Scenarios} />
              <Route path="/addscenario" component={AddScenarioForm} />
              <Route exact path={"/"} component={GameView} />
              {currentRole ==="superuser" && (
              <Route exact path="/Users" component={UserHome} /> )}
              {currentRole ==="superuser" && (
              <Route exact path="/users/add" component={AddUser} />)}
               {currentRole ==="superuser" && (
              <Route exact path="/users/edit/:id" component={EditUser} />)}
              {currentRole ==="superuser" && (
              <Route exact path="/users/:id" component={User} />)}
              
              <Route component={NotFound} />
            </Switch>
          </div>
        </Router>
      </div>
    </div>
  );
};

export default App;