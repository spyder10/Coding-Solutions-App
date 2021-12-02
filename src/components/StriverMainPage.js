import React from "react";
import { Card } from "react-bootstrap";
import { fb } from "../service/firebase";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";

export default function StriverMainPage(props) {
  console.log(props.dayValue);
  const [problems, setProblems] = useState([]);
  const [problemData, setProblemData] = useState([]);

  useEffect(() => {
    const fetchDataOfDay1 = () => {
      let problemsOnDay1 = [];
      let problemDataOnDay1 = [];
      fb.firestore
        .collection(`/striver/${props.dayValue}/problems`)
        .get()
        .then((querySnapshot) => {
          querySnapshot.docs.forEach((doc) => {
            problemsOnDay1.push(doc.data().problemStatement);
            problemDataOnDay1.push(doc.data());
          });
          setProblemData(problemDataOnDay1);
          setProblems(problemsOnDay1);
        });
    };
    fetchDataOfDay1();
  }, [props.dayValue]);

  if (problems.length === 0) {
    return <h6>No problems added yet</h6>;
  }

  return (
    <>
      {/* <ul>
        {problems.map((prob) => {
          return <li>{prob}</li>;
        })}
      </ul> */}
      {/* <SyntaxHighlighter language="javascript" style={docco}>
        {codeString}
      </SyntaxHighlighter> */}
      {problemData.map((probData) => {
        return (
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
                    return (
                      <li key={index.toString()}>
                        <SyntaxHighlighter language="javascript" style={docco}>
                          {solution}
                        </SyntaxHighlighter>
                      </li>
                    );
                  })}
                </Card.Text>
              </ul>
            </Card.Body>
          </Card>
        );
      })}
    </>
  );
}
