import { useState } from "react";
import { Navigate } from "react-router-dom";

import { getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc, setDoc, doc } from "firebase/firestore";
import { Button, Col, Form, Row } from "react-bootstrap";

const app = getApp();
const db = getFirestore(app);
const auth = getAuth(app);

const addProject = (project) => {
    project.userId = auth.currentUser.uid;
    project.userEmail = auth.currentUser.email;
    project.allowedUsers = [];
    addDoc(collection(db, "projects"), project).then(
        (obj) => {
            let data = require('./../dataset.json');
            let firstnames = [];
            if(project.gender === "boy") {
                firstnames = data["boys"];
            } else if (project.gender === "girl") {
                firstnames = data["girls"];
            }
            firstnames.map((firstname) => {
                setDoc(
                    doc(db, "projects", obj.id, "firstnames", firstname),
                    {rankElo: 1000, firstname}
                );
            });
        }
    );
};

const NewProject = () => {
    const [project, setProject] = useState({title: "", gender: "undefined"});

    const handleSubmit = (event) => {
        // prevents the submit button from refreshing the page
        event.preventDefault();
        addProject(project);
        setProject(null);
    };

    const handleChange = (event) => {
        setProject({ ...project, [event.target.name]: event.target.value });
    };

    if (project === null) {
        return <Navigate to="/" replace={true} />;
    }

    return <>
        <Row>
            <Col className="p-5 mb-4 bg-light rounded-3">
                <h1>Create a new Project</h1>
                <br />
                <p>Give us a name for this project and select if you want to rank firstname for a boy or a girl !</p>
            </Col>
        </Row>
        <Row>
            <Col>
                <Form onSubmit={handleSubmit} onChange={handleChange}>
                    <Form.Group className="mb-3" controlId="title">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" placeholder="Project name" name="title" value={project.title} />
                        <Form.Text className="text-muted">
                            The name of your project.
                        </Form.Text>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="gender">
                        <Form.Label>Firstname gender</Form.Label>
                        <Form.Check
                            type="radio"
                            label="Girl"
                            id="gender-girl"
                            value="girl"
                            name="gender"
                            onChange={handleChange}
                            checked={project.gender === "girl"}
                        />
                        <Form.Check
                            type="radio"
                            label="Boy"
                            id="gender-boy"
                            value="boy"
                            name="gender"
                            onChange={handleChange}
                            checked={project.gender === "boy"}
                        />
                        <Form.Check
                            type="radio"
                            label="- (do not preload data)"
                            id="gender-undefined"
                            value="undefined"
                            name="gender"
                            onChange={handleChange}
                            checked={project.gender === "undefined"}
                        />
                        <Form.Text className="text-muted">
                            Gender your are looking for, in order for us to pre-load a dataset.
                        </Form.Text>
                    </Form.Group>
                    <Button variant="primary" type="submit">Add Project</Button>
                </Form>
            </Col>
        </Row>
    </>;
};

export default NewProject;
