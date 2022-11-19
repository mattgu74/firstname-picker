import { Outlet, Link } from "react-router-dom";

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';


import { getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { LinkContainer } from "react-router-bootstrap";

const Layout = () => {
    const auth = getAuth(getApp());

    return (
        <>
        <Navbar bg="light" expand="lg">
            <Container>
            <LinkContainer to="/"><Navbar.Brand>Firstname-Picker</Navbar.Brand></LinkContainer>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Button variant="danger" className="d-flex" onClick={() => auth.signOut()}>Sign-out</Button>
            </Container>
        </Navbar>
        <Container className="p-3">
            <Outlet />
        </Container>
        </>
    );
};

export default Layout;
