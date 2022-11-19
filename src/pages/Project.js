import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getApp } from "firebase/app";
import { getFirestore, doc, collection, getDoc, query, onSnapshot, writeBatch, updateDoc } from "firebase/firestore";
import AddFirstname from "../components/AddFirstname";
import { LinkContainer } from "react-router-bootstrap";
import { Button, Col, Container, Row } from "react-bootstrap";
import AddAllowedUser from "../components/AddAllowedUser";
import { getAuth } from "firebase/auth";

const app = getApp();
const db = getFirestore(app);
const auth = getAuth(app);

const removeAllowedUser = (project, email) => {
    const index = project.allowedUsers.indexOf(email);

    if (index > -1) {
        project.allowedUsers.splice(index, 1);
    }
    updateDoc(
        doc(db, "projects", project.id),
        {allowedUsers: project.allowedUsers}
    );
};

const Project = () => {
    const { id } = useParams();

    const [project, setProject] = useState(null);
    const [firstnames, setFirstnames] = useState([]);
    const [totalCount, setTotalCount] = useState([]);

    useEffect(() => {
        const docRef = doc(db, "projects", id);
        onSnapshot(docRef, (docSnap) => {
            if(docSnap.exists()) {
                setProject({id, ...docSnap.data()});
            } else {
                setProject(false);
            }
        });

        const q = query(collection(db, "projects", id, "firstnames"));
        onSnapshot(q, (querySnapshot) => {
          let results = [];
          let _totalCount = 0;
          querySnapshot.forEach((doc) => {
                let result = doc.data();
                result.id = doc.id;
                _totalCount += 1;
                if(!result.hide) {
                    results.push(result);
                }
          });
          setTotalCount(_totalCount);
          setFirstnames(results.sort((a, b) => b.rankElo - a.rankElo));
        });
    }, [id]);

    if (project === null) {
        return <>Loading...</>;
    }

    if (project === false) {
        return <>Not Found !</>;
    }

    return <>
        <Container className="p-3">
            <Row className="p-5 mb-4 bg-light rounded-3">
                <h1>Project #{project.title}</h1>
                <br />
                <LinkContainer to={"/projects/"+project.id+"/match"}><Button variant="primary">Launch battle !</Button></LinkContainer><br />
                <br />
                Nb firstname loaded : {totalCount} <br />
                Nb firstname still in competition : {firstnames.length}
            </Row>
            <Row>
                <Col>
                    <h2>Add a firstname</h2><br />
                    <AddFirstname project={project} /> <br />
                </Col>
                <Col>
                    <h2>Users</h2><br />
                    {(project.userId === auth.currentUser.uid || true) && <AddAllowedUser project={project}/>}
                    <ul>
                        {project.allowedUsers?.map(email => 
                            <li>{email} {(project.userId === auth.currentUser.uid) && <button onClick={() => removeAllowedUser(project, email)}>X</button>}</li>
                        )}
                    </ul>
                </Col>
            </Row>
        </Container>

        
        <h2>Rank</h2>
        <ul>
        {firstnames.map(firstname => <li>{firstname.firstname} - {firstname.rankElo} ({firstname.hide ? 1 : 0})</li>)}
        </ul>
    </>;
};

export default Project;
