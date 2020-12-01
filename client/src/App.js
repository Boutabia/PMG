import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from "react";
//import './App.css';
import Login from './components/Login';
import {
  BrowserRouter as Router,
  Switch, Route, Link
} from "react-router-dom"
import Home from './home';
import AddScenarioForm from "./addScenarioForm";

function App() {
  return (
    <div className="App">
      <div>
        <Router>
          <div>
            <Link className="nav" to="/">PMG</Link>
            <Link className="nav" to="/forteachers">For Teachers</Link>
            <Link className="nav" to="/addscenario">Add Scenario</Link>
          </div>
          <Switch>
            <Route path="/forteachers">
              <Login/>
            </Route>
            <Route path="/addscenario">
              <AddScenarioForm/>
            </Route>
            <Route path="/">
              <Home/>
            </Route>
          </Switch>
        </Router>
      </div>
    </div>
  );
}

export default App;
