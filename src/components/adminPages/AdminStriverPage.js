import React from "react";
import { useState, useRef } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { fb } from "../../service/firebase";

export default function AdminStriverPage() {
  const selectedDayRef = useRef();
  const problemStatementRef = useRef();
  const commentRef = useRef();
  const solutionRef = useRef();
  const [
    isDayAndProblemStatementSelected,
    setIsDayAndProblemStatementSelected,
  ] = useState(false);
  const [problemSelected, setProblemSelected] = useState({});
  const [problemsSelected, setProblemsSelected] = useState([]);
  const [problemDataSelected, setProblemDataSelected] = useState([]);

  const fetchDetails = (dayValue, enteredProb) => {
    let tempProbData = {};
    let problems = [];
    let problemData = [];
    fb.firestore
      .collection(`/striver/${dayValue}/problemsDay1`)
      .get()
      .then((querySnapshot) => {
        querySnapshot.docs.forEach((doc) => {
          if (doc.data().problemStatement === enteredProb) {
            tempProbData = { ...doc.data() };
          }
          problems.push(doc.data().problemStatement);
          problemData.push(doc.data());
        });
        setProblemSelected(tempProbData);
        setProblemDataSelected(problemData);
        setProblemsSelected(problems);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const selectedDayProblemSubmitHandler = (e) => {
    e.preventDefault();
    console.log(
      "d" + selectedDayRef.current.value.replace(/\s/g, "").substr(1),
      problemStatementRef.current.value
    );

    fetchDetails(
      "d" + selectedDayRef.current.value.replace(/\s/g, "").substr(1),
      problemStatementRef.current.value
    );

    setIsDayAndProblemStatementSelected(true);
  };
  const listOptions = [];
  for (let i = 1; i <= 30; i++) {
    listOptions.push("Day " + i);
  }

  const addDetailsSubmitHandler = (e) => {
    e.preventDefault();
    console.log(commentRef.current.value, solutionRef.current.value);

    commentRef.current.value = "";
    solutionRef.current.value = "";
  };

  return (
    <>
      <Container>
        <Row className=" justify-content-center align-self-center">
          <Col xs={8} className="mx-auto">
            <Form onSubmit={selectedDayProblemSubmitHandler}>
              <Form.Group className="mb-4 my-3" id="day">
                <Form.Label>Select the day in the striver sheet</Form.Label>
                <Form.Select
                  required
                  aria-label="Default select example"
                  ref={selectedDayRef}
                >
                  {listOptions.map((option) => {
                    return <option value={option}>{option}</option>;
                  })}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3" id="problemStatement">
                <Form.Label>Problem Statement</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  type="text"
                  ref={problemStatementRef}
                  required
                />
                <Form.Text className="text-muted">
                  Please add the exact problem name as in the striver sheet.
                </Form.Text>
              </Form.Group>
              <Container className="d-flex justify-content-center my-2 mb-4">
                <Button variant="danger" type="submit">
                  Submit
                </Button>
              </Container>
            </Form>
          </Col>
        </Row>
      </Container>
      {isDayAndProblemStatementSelected &&
        problemDataSelected.map((probData) => {
          return (
            <Container>
              <Row className=" justify-content-center align-self-center mb-2">
                <Col xs={8} className="mx-auto">
                  <Card>
                    <Card.Body>
                      <Card.Title>{probData.problemStatement}</Card.Title>
                      <ul>
                        <Card.Text>
                          {probData.comments.map((comment, index) => {
                            return <li key={index.toString()}>{comment}</li>;
                          })}
                        </Card.Text>
                      </ul>
                      <ul>
                        <Card.Text>
                          {probData.solutions.map((solution, index) => {
                            return <li key={index.toString()}>{solution}</li>;
                          })}
                        </Card.Text>
                      </ul>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Container>
          );
        })}
      <Container>
        <Row className=" justify-content-center align-self-center">
          <Col xs={8} className="mx-auto">
            <Card className="mt-4">
              <Card.Body>
                <Card.Title className="mv-3 text-center font-weight-bold mb-4">
                  Add something (Problem/Comment/Solution){" "}
                </Card.Title>
                <Card.Text className="text-muted" style={{ fontSize: 12 }}>
                  You can add any new comment / solution to a new / existing
                  problem. Fill the form with just the details you need to add
                  after selecting the day and problem.
                </Card.Text>
                <Form onSubmit={addDetailsSubmitHandler}>
                  <Form.Group className="mb-3" id="comment">
                    <Form.Label>Comment</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      type="text"
                      ref={commentRef}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" id="solution">
                    <Form.Label>Solution</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      type="text"
                      ref={solutionRef}
                    />
                  </Form.Group>

                  <Button
                    variant="danger text-light"
                    disabled={!isDayAndProblemStatementSelected}
                    className="w-100 mt-3"
                    type="submit"
                  >
                    Submit
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}
