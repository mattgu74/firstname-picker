import { Button, Col, Row } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import { LinkContainer } from 'react-router-bootstrap';

import ProjectsList from '../components/ProjectsList';

import { getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const Home = () => {
    const auth = getAuth(getApp());

    return (
        <>
        <Row>
            <Col className="p-5 mb-4 bg-light rounded-3">
                <h1>Welcome in Firstname-Picker !</h1>
                <br />
                <p>You can <LinkContainer to="/new"><Button variant="outline-success">Create a new project !</Button></LinkContainer> or work in an existing one.</p>
                <p>If your life partner already created one, he/she needs to add your email adress "{auth.currentUser.email}" in order to give you access.</p>
            </Col>
        </Row>
        <ProjectsList />
        </>
    );
};

export default Home;
