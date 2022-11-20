import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getApp } from "firebase/app";
import { getFirestore, doc, collection, getDoc, query, onSnapshot, writeBatch, updateDoc } from "firebase/firestore";
import AddFirstname from "../components/AddFirstname";
import { LinkContainer } from "react-router-bootstrap";
import { Button, Col, Container, Row } from "react-bootstrap";
import AddAllowedUser from "../components/AddAllowedUser";
import { getAuth } from "firebase/auth";
import { getEloRank, getHide } from "../utils/utils";

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
    const [userFirstnames, setUserFirstnames] = useState([]);
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
          let userResults = [];
          let _totalCount = 0;
          querySnapshot.forEach((doc) => {
                let result = doc.data();
                result.id = doc.id;
                _totalCount += 1;
                if(!result.hide) {
                    results.push(result);
                }
                if(!getHide(result, auth.currentUser)) {
                    userResults.push(result);
                }
          });
          setTotalCount(_totalCount);
          setFirstnames(results.sort((a, b) => b.rankElo - a.rankElo));
          setUserFirstnames(userResults.sort((a, b) => getEloRank(b, auth.currentUser) - getEloRank(a, auth.currentUser)));
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
            <Row>
                <Col>
                    <h2>Global Rank (Top 20)</h2>
                    <ul>
                        {firstnames.slice(0,20).map(firstname => <li>{firstname.firstname} - {firstname.rankElo}</li>)}
                    </ul>
                </Col>
                <Col>
                    <h2>Your Rank (Top 20)</h2>
                    <ul>
                        {userFirstnames.slice(0,20).map(firstname => <li>{firstname.firstname} - {getEloRank(firstname, auth.currentUser)}</li>)}
                    </ul>
                </Col>
            </Row>
        </Container>
    </>;
};

export default Project;
