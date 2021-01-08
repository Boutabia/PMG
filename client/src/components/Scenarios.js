import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Jumbotron from "react-bootstrap/Jumbotron";
import AuthService from "../services/auth.service";
import ListGroup from "react-bootstrap/ListGroup";
import UserService from "../services/user.service";
import authHeader from "../services/auth-header";
import Axios from "axios";
import Table from "react-bootstrap/Table";
import "./Scenarios.css";
import Button from "react-bootstrap/Button";
import scenarioService from "../services/scenarios";
import Modal from 'react-bootstrap/Modal';

const Scenarios = () => {
  const [content, setContent] = useState([]);
  const [show, setShow] = useState(false);
  const [scenario, setScenario] = useState("");

  console.log(scenario);

  /*For modal window*/
  const handleClose = () => setShow(false);
  const handleShow = scenarioid => {
    setShow(true);
    console.log(`scenarioid ${scenarioid}`);
    
  }

 /*  const [testContent] = useState([
    {id:1, scenarioname: "scenario1", scenariodifficulty: 3, categoryname: "Meeting Practices"},
    {id:2, scenarioname: "scenario2", scenariodifficulty: 1, categoryname: "Scrum"},
    {id:3, scenarioname: "scenario3", scenariodifficulty: 2, categoryname: "Risk Management"},
    {id:4, scenarioname: "scenario4", scenariodifficulty: 3, categoryname: "Scheduling"},
    {id:5, scenarioname: "scenario5", scenariodifficulty: 2, categoryname: "Meeting Practices"},
  ]); */

  useEffect(() => {
    scenarioService
      .getAll()
      .then(response => {
        setContent(response.data)
      })
      .catch(error => {
        console.log(error)
      })
  }, []);

  const deleteScenarioA = () => {
    console.log("DELEEETE " + scenario);

    scenarioService
      .deleteScenario(scenario)
      .then((deleted) => {
        console.log("deleted " + deleted.data);
        if (deleted.data === 1) {
          setScenario("");
          console.log("deleted successfully");
          alert("Scenario deleted");
        }
      })
      .catch(error => {
        console.log(error)
      })

    handleClose();

    
  }

  return (
    <Container>
      <Jumbotron>
        <h3>Scenarios</h3>
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Difficulty</th>
              <th>Category</th>
              <th></th>
            </tr>
          </thead>
          {content.map((item, index) => (
            <tbody key={index}>
              <tr>
                <td>
                  {item.scenarioname} {item.scenarioid}
                </td>
                <td>
                  {item.scenariodifficulty}
                </td>
                <td>
                  {item.categoryname}
                </td>
                <td>
                  <Button 
                    key={item.scenarioid}
                    onClick={() => {
                      handleShow(item.scenarioid);
                      setScenario(item.scenarioid);
                    }}>
                    Delete
                  </Button>
                </td>
              </tr>
              
              <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                  <Modal.Title>Delete Scenario</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  Are you sure you want to delete this scenario?
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={deleteScenarioA}>
                    Delete Scenario
                  </Button>
                </Modal.Footer>
              </Modal>

            </tbody>
          ))}
        </Table>
      </Jumbotron>
    </Container>
  );
};

export default Scenarios;