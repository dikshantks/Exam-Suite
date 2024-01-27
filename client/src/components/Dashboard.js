import React, { useState, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import axios from "axios";
import { Alert, Button, Card, Form, Modal, Badge } from "react-bootstrap";
import "../componentsStyles/Dashboard.css";
import { useAlert } from "react-alert";
import instance from "./AxiosInstance";

function Dashboard(props) {
  let history = useHistory();
  if (!localStorage.getItem("auth-token")) {
    localStorage.clear();
    history.push("/");
  }
  const [tests, setTests] = useState([]);
  const [modalIsOpen, setmodalIsOpen] = useState(false);
  const [topic, settopic] = useState("");
  const [amount, setamount] = useState("");
  const [time, settime] = useState("");
  const [expiry, setexpiry] = useState(new Date());
  const alert = useAlert();
  const [imageUrl, setImageUrl] = useState("");

  console.log(tests);
  const options = {
    headers: {
      "Content-Type": "application/json",
      "auth-token": localStorage.getItem("auth-token"),
    },
  };
  useEffect(() => {
    instance
      .post("/api/test/gettests", {}, options)
      .then((res) => {
        console.log("this here");
        // console.log(res.data);
        setTests(res.data);
      })
      .catch((err) => {
        if (!localStorage.getItem("auth-token")) history.push("/");
        else alert.show("Couldn't fetch tests. Please reload the page.");
      });
  }, [modalIsOpen]);

  const getResults = (pin) => {
    instance
      .post("/api/test/getresults", { pin }, options)
      .then((res) => {
        console.log(res, "got the results guyss");
        history.push("/test-results", {
          data: res.data,
          testdetails: tests.find((test) => test.pin === pin),
        });
      })
      .catch((err) => {
        console.log("error here buddy", err);
      });
  };
  const getQuestions = (pin) => {
    instance
      .post("/api/test/getquestions", { pin })
      .then((res) => {
        console.log(res, "got the question guys");
        history.push("/Edittest", {
          data: res.data,
          testdetails: tests.find((test) => test.pin === pin),
        });
      })
      .catch((err) => {
        console.log("error here buddy", err);
        if (err.response.status === 405) {
          history.push("/Edittest", {
            data: [],
            testdetails: tests.find((test) => test.pin === pin),
          });
        }
      });
  };

  const onSubmit = (event) => {
    event.preventDefault();
    instance
      .post(
        "/api/test/addtest",
        {
          topic,
          amount,
          time,
          expiry,
          created: new Date(),
          imageUrl: imageUrl,
        },
        options
      )
      .then((res) => {
        console.log("added");
        setmodalIsOpen(false);
        setTests([...tests, res.data]);
      })
      .catch((err) => {
        console.log(err);
        alert.show("Error: Test not added. Please try again.");
      });
  };

  return (
    <div>
      <hr className="hr-custom" />

      <div className="containerrr mt-5">
        <div className="d-flex justify-content-center mb-4">
          <Alert
            variant="custom"
            className="dashboard-badge"
            style={{ maxWidth: "20vw" }}
          >
            Welcome {localStorage.getItem("name")}!
          </Alert>
        </div>
        <div className="d-flex justify-content-end mb-4">
          <Button
            variant="custom"
            className="buttong"
            onClick={() => setmodalIsOpen(true)}
          >
            + Add Test
          </Button>
        </div>
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {tests.map((test, index) => (
            <div className="col" key={test._id}>
              <Card className="marginforCard">
                {/* Add Card Image */}
                <Card.Img
                  variant="top"
                  style={{ width: "100%", height: "20vh" }}
                  src={test.imageUrl}
                  alt="Test Image"
                />

                <Card.Body>
                  <Card.Title className="modallabels">
                    {test.testname}
                  </Card.Title>
                  <hr />
                  <Card.Text>
                    <strong>Category:</strong> {test.topic}
                    <br />
                    <strong>Pin:</strong> {test.pin}
                    <br />
                    <strong>Number of Questions:</strong> {test.amount}
                    <br />
                    <strong>Time Duration (Mins):</strong> {test.time}
                    <br />
                    <strong>Expiry:</strong>{" "}
                    {new Date(test.expiry).toLocaleDateString()}
                  </Card.Text>
                  <Button
                    variant="primary"
                    className="buttonss"
                    onClick={() => getResults(test.pin)}
                  >
                    View Results
                  </Button>
                  <Button
                    variant="primary"
                    className="buttonss"
                    onClick={() => getQuestions(test.pin)}
                    style={{ marginLeft: "10px", marginTop: "2px" }}
                  >
                    Edit Test
                  </Button>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Add Test Modal */}
      <Modal show={modalIsOpen} onHide={() => setmodalIsOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title className="modallabels">Add Test</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={onSubmit}>
            <Form.Group controlId="formBasicNumber">
              <Form.Label className="modallabels">Topic</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name of test"
                value={topic}
                onChange={(event) => settopic(event.target.value)}
              />
            </Form.Group>
            <br />
            <Form.Group controlId="formBasicImageURL">
              <Form.Label className="modallabels">Image URL</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter image URL for the test"
                value={imageUrl}
                onChange={(event) => setImageUrl(event.target.value)}
              />
            </Form.Group>
            <br />
            <Form.Group controlId="formBasicNumber">
              <Form.Label className="modallabels">
                Number of Questions
              </Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter number of questions"
                min="1"
                value={amount}
                onChange={(event) => setamount(event.target.value)}
              />
            </Form.Group>
            <br />
            <Form.Group controlId="formBasicTime">
              <Form.Label className="modallabels">
                Time Duration (in minutes)
              </Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter time duration (in minutes)"
                min="1"
                value={time}
                onChange={(event) => settime(event.target.value)}
              />
            </Form.Group>
            <br />
            <Form.Group controlId="formBasicExpiry">
              <Form.Label className="modallabels">Expiry Date</Form.Label>
              <Form.Control
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={expiry}
                onChange={(event) => setexpiry(event.target.value)}
              />
            </Form.Group>
            <br />
            <Button variant="custom " className="buttonss" type="submit">
              Add Test
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Dashboard;
