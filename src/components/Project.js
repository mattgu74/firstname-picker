import { useState } from "react";
import { Link, Navigate } from "react-router-dom";

import { getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, deleteDoc, updateDoc } from "firebase/firestore";

import AddAllowedUser from "./AddAllowedUser";
import { LinkContainer } from "react-router-bootstrap";
import { Button } from "react-bootstrap";

const app = getApp();
const db = getFirestore(app);

export default function Project({project}) {
    const deleteProject = (project) => {
        deleteDoc(doc(db, "projects", project.id));
    };

    return <>
        <h3>{project.title}</h3>
        <LinkContainer className="d-flex float-end" to={"/projects/"+project.id}><Button variant="outline-info">Access this project !</Button></LinkContainer>
        <br />
        <p>Shared with {project.allowedUsers.length} other user</p>
    </>;
}

/*
<h3>Actions</h3>
        <ul>
        {(project.userId === auth.currentUser.uid) && 
            <>
                <li><button onClick={() => deleteProject(project)}>Delete</button></li>
            </>
        }
*/