import React from "react";
import { useState, useRef } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { fb } from "../../service/firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import firebase from "firebase/compat/app";
import RefreshIcon from "@mui/icons-material/Refresh";
import CloseIcon from "@mui/icons-material/Close";

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
  const [problemSelectedID, setProblemSelectedID] = useState("");
  const [daySelected, setDaySelected] = useState("");

  /***************************************************** Day and Problem Statement Submit Handler ********************************************************************************* */
  const fetchDetails = (dayValue, enteredProb) => {
    let tempProbData = {};
    let problems = [];
    let problemData = [];
    fb.firestore
      .collection(`/striver/${dayValue}/problems`)
      .get()
      .then((querySnapshot) => {
        let checkIfProblemAlreadyExists = false;
        querySnapshot.docs.forEach((doc) => {
          if (doc.data().problemStatement.trim() === enteredProb.trim()) {
            checkIfProblemAlreadyExists = true;
            setProblemSelectedID(doc.id);
            setProblemSelected({ ...doc.data() });
          }
        });
        if (checkIfProblemAlreadyExists === false) {
          // If the problem does not exist already, new problem will be added.
          fb.firestore
            .collection(`/striver/${dayValue}/problems`)
            .add({
              comments: [],
              solutions: [],
              problemStatement: enteredProb.trim(),
            })
            .then((docRef) => {
              setProblemSelectedID(docRef.id);
              console.log(docRef.id);
              setProblemSelected({
                comments: [],
                solutions: [],
                problemStatement: enteredProb.trim(),
              });
            });
        }
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

    setDaySelected(
      "d" + selectedDayRef.current.value.replace(/\s/g, "").substr(1)
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

  /*************************************************** Add Details Handling **************************************************************************************************************** */
  const addCommentHandler = (comment) => {
    fb.firestore
      .collection(`/striver/${daySelected}/problems`)
      .doc(problemSelectedID)
      .update({
        comments: firebase.firestore.FieldValue.arrayUnion(comment),
      });
  };
  const addSolutionHandler = (solution) => {
    fb.firestore
      .collection(`/striver/${daySelected}/problems`)
      .doc(problemSelectedID)
      .update({
        solutions: firebase.firestore.FieldValue.arrayUnion(solution),
      });
  };

  const addDetailsSubmitHandler = (e) => {
    e.preventDefault();
    console.log(commentRef.current.value, solutionRef.current.value);

    if (commentRef.current.value.trim().length > 0) {
      addCommentHandler(commentRef.current.value.trim());
    }
    if (solutionRef.current.value.trim().length > 0) {
      addSolutionHandler(solutionRef.current.value.trim());
    }

    commentRef.current.value = "";
    solutionRef.current.value = "";
  };
  /************************************************************* Delete Comment OR Solution *********************************************************************** */

  const deleteCommentHandler = (e) => {
    console.log("I am a comment!", e.target.value);
  };
  const deleteSolutionHandler = (e) => {
    console.log("I am a solution!", e);
  };

  /******************************************** JSX File begins ************************************************************************************************ */
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
                  Please add the EXACT PROBLEM NAME as in the striver sheet.
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
      {problemSelected.hasOwnProperty("problemStatement") && (
        <Container>
          <Row className=" justify-content-center align-self-center mb-2">
            <Col xs={8} className="mx-auto">
              <Card>
                <Card.Body>
                  <Card.Title className="text-center">
                    {problemSelected.problemStatement}
                  </Card.Title>
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button
                      type="button"
                      className="btn btn-default btn-sm border-warning pull-right"
                      onClick={selectedDayProblemSubmitHandler}
                    >
                      <RefreshIcon></RefreshIcon>
                      Refresh
                    </button>
                  </div>

                  <ul>
                    <Card.Text>
                      {problemSelected.comments.map((comment, index) => {
                        return (
                          <li key={index.toString()}>
                            {comment}{" "}
                            <CloseIcon
                              onClick={(e) => {
                                e.preventDefault();
                                fb.firestore
                                  .collection(
                                    `/striver/${daySelected}/problems`
                                  )
                                  .doc(problemSelectedID)
                                  .update({
                                    comments:
                                      firebase.firestore.FieldValue.arrayRemove(
                                        comment
                                      ),
                                  });
                              }}
                            ></CloseIcon>
                          </li>
                        );
                      })}
                    </Card.Text>
                  </ul>
                  <ul>
                    <Card.Text>
                      {problemSelected.solutions.map((solution, index) => {
                        return (
                          <li key={index.toString()}>
                            {solution}
                            <CloseIcon
                              onClick={(e) => {
                                e.preventDefault();
                                fb.firestore
                                  .collection(
                                    `/striver/${daySelected}/problems`
                                  )
                                  .doc(problemSelectedID)
                                  .update({
                                    solutions:
                                      firebase.firestore.FieldValue.arrayRemove(
                                        solution
                                      ),
                                  });
                              }}
                            ></CloseIcon>
                          </li>
                        );
                      })}
                    </Card.Text>
                  </ul>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      )}

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
