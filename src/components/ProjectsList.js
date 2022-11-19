import React from 'react';
import { useEffect, useState } from "react";

import { getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, query, where, or, onSnapshot } from "firebase/firestore";

const app = getApp();
const db = getFirestore(app);
const auth = getAuth(app);

import Project from './Project';
import { Col } from 'react-bootstrap';

export default function ProjectsList() {
    const [projects, setProjects] = React.useState([]);
    const [allowedProjects, setAllowedProjects] = React.useState([]);

    useEffect(() => {
        const q = query(collection(db, "projects"), where("userId", "==", auth.currentUser.uid));
        onSnapshot(q, (querySnapshot) => {
          let results = [];
          querySnapshot.forEach((doc) => {
                let result = doc.data();
                result.id = doc.id;
                results.push(result);
          });
          setProjects(results);
        });
    }, [auth]);

    useEffect(() => {
        if(auth && auth.currentUser.emailVerified) {
            const q = query(collection(db, "projects"), where("allowedUsers", "array-contains", auth.currentUser.email));
            onSnapshot(q, (querySnapshot) => {
            let results = [];
            querySnapshot.forEach((doc) => {
                    let result = doc.data();
                    result.id = doc.id;
                    results.push(result);
            });
            setAllowedProjects(results);
            });
        }
    }, [auth]);

    return <>
        {projects.length > 0 && <h2>Your projects</h2>}
        {
            projects.map(p => (
                <Col key={p.id} className="p-5 mb-4 bg-light rounded-1"><Project project={p} /></Col>
            ))
        }
        {allowedProjects.length > 0 && <h2>Projects shared with you</h2>}
        {
            allowedProjects.map(p => (
                <Col key={p.id} className="p-5 mb-4 bg-light rounded-1"><Project project={p} /></Col>
            ))
        }
    </>;
}
