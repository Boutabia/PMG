import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Jumbotron from "react-bootstrap/Jumbotron";
import UserService from "../services/user.service";
import ListGroup from "react-bootstrap/ListGroup";

const Scenarios = () => {
  const [content, setContent] = useState("");

  useEffect(() => {
    UserService.getScenarios().then(
      (response) => {
        setContent(response.data);
      },
      (error) => {
        const _content =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setContent(_content);
      }
    );
  }, []);

  return (
    <Container>
      <Jumbotron>
        <ListGroup>
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