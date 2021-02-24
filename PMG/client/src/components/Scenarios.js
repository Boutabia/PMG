import React, { useState, useEffect } from "react";
import Jumbotron from "react-bootstrap/Jumbotron";
import Table from "react-bootstrap/Table";
import "./Scenarios.css";
import Button from "react-bootstrap/Button";
import scenarioService from "../services/scenarios";
import Modal from 'react-bootstrap/Modal';
import AuthService from "../services/auth.service";
import { Redirect } from "react-router-dom";
import DOMPurify from "dompurify";

const Scenarios = () => {

  const [content, setContent] = useState([]);
  const [showDelete, setShowDelete] = useState(false);
  const [showScenario, setShowScenario]= useState(false);
  const [scenario, setScenario] = useState("");
  const [scenarioView, setScenarioView] = useState([]);

  const difficultyLevels = {
    1: "Easy",
    2: "Medium",
    3: "Hard"
  };

  /*For modal window*/
  const handleClose = () => setShowDelete(false);

  const isCorrect = (correct) => {
    if (correct === 1) {
      return "Correct answer"
    }
  }

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

  AuthService.getExpiration()
  if (!AuthService.getCurrentUser()) {
    return <Redirect to="/login" />;
  }

  const deleteScenario = () => {
    scenarioService
      .deleteScenario(scenario)
      .then((deleted) => {
        console.log("deleted " + deleted.data);
        if (deleted.data === 1) {
          console.log("deleted successfully");
          alert("Scenario deleted.");
          setContent(content.filter(item => item.scenarioid !== scenario));
          setScenario("");
        } else {
          alert("Scenario was not deleted.");
        }
      })
      .catch(error => {
        console.log(error)
      })

    handleClose();
  }

  return (
    <Jumbotron fluid>
      <h3>Scenarios</h3>
      <Table responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        {content.map((item, index) => (
          <tbody key={index}>
            <tr>
              <td>
                {item.scenarioname}
              </td>
              <td>
                {item.categoryname}
              </td>
              <td>
                <Button 
                  variant="primary"
                  key={item.scenarioid}
                  onClick={() => {
                    setShowScenario(true);
                    setScenarioView(item);
                  }}>
                  View
                </Button>
              </td>
              <td>
                <Button 
                  variant="secondary"
                  key={item.scenarioid}
                  onClick={() => {
                    setShowDelete(true);
                    setScenario(item.scenarioid);
                  }}>
                  Delete
                </Button>
              </td>
            </tr>
            
            <Modal show={showDelete} onHide={() => setShowDelete(false)}>
              <Modal.Header closeButton>
                <Modal.Title>Delete Scenario?</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                Are you sure you want to delete this scenario?
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={deleteScenario}>
                  Delete Scenario
                </Button>
              </Modal.Footer>
            </Modal>

            <Modal show={showScenario} onHide={() => setShowScenario(false)}>
              <Modal.Header closeButton>
                <Modal.Title>{scenarioView.scenarioname}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p><b>Category:</b> {scenarioView.categoryname}</p> 
                <p><b>Difficulty:</b> {difficultyLevels[scenarioView.scenariodifficulty]}</p>
                <p><b>Description:</b> <span dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(scenarioView.questiontext)}}></span></p>
                <p><b>Option A:</b> {scenarioView.option1} <b>{isCorrect(scenarioView.correct1)}</b></p>
                <p><b>Option B:</b> {scenarioView.option2} <b>{isCorrect(scenarioView.correct2)}</b></p>
                <p><b>Option C:</b> {scenarioView.option3} <b>{isCorrect(scenarioView.correct3)}</b></p>
                <p><b>Option D:</b> {scenarioView.option4} <b>{isCorrect(scenarioView.correct4)}</b></p>
                <p><b>Explanation:</b> <span dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(scenarioView.explanation)}}></span></p>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="primary" onClick={() => setShowScenario(false)}>Close</Button>
              </Modal.Footer>
            </Modal>

          </tbody>
        ))}
      </Table>
    </Jumbotron>
  );
};

export default Scenarios;