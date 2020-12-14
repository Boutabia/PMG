import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Jumbotron from "react-bootstrap/Jumbotron";
import UserService from "../services/user.service";
import ListGroup from "react-bootstrap/ListGroup";

const Scenarios = () => {
  const [content, setContent] = useState([]);

 /*  const [testContent] = useState([
    {id:1, scenarioname: "scenario1", scenariodifficulty: 3, categoryname: "Meeting Practices"},
    {id:2, scenarioname: "scenario2", scenariodifficulty: 1, categoryname: "Scrum"},
    {id:3, scenarioname: "scenario3", scenariodifficulty: 2, categoryname: "Risk Management"},
    {id:4, scenarioname: "scenario4", scenariodifficulty: 3, categoryname: "Scheduling"},
    {id:5, scenarioname: "scenario5", scenariodifficulty: 2, categoryname: "Meeting Practices"},
  ]); */

  useEffect(() => {
    UserService.getScenarios().then(
      (response) => {
        setContent([response.data]);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <Container>
      <Jumbotron>
        <h3>Scenarios</h3>
        <ListGroup variant="flush">
          {content.map((item, index) => (
            <ListGroup.Item
              key={index}
            >
              {item.scenarioname}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Jumbotron>
    </Container>
  );
};

export default Scenarios;