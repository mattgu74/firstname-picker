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

const fixProjectUsers = (project) => {
    // Ensure we have all info we need updated for this user in this project
    if(project.users === undefined || project.users[auth.currentUser.uid] === undefined) {
        const docRef = doc(db, "projects", project.id);
        updateDoc(docRef, {
            ["users." + auth.currentUser.uid]: {
                "uid": auth.currentUser.uid,
                "email": auth.currentUser.email,
                "displayName": auth.currentUser.displayName
            }
        });
    }
}

const Project = () => {
    const { id } = useParams();

    const [project, setProject] = useState(null);
    const [users, setUsers] = useState(null);
    const [ranks, setRanks] = useState({"global": []});
    const [totalCount, setTotalCount] = useState([]);

    useEffect(() => {
        const docRef = doc(db, "projects", id);
        return onSnapshot(docRef, (docSnap) => {
            if(docSnap.exists()) {
                const _project = {id, ...docSnap.data()}
                setProject(_project);
                fixProjectUsers(_project);
                let _users = [];
                Object.keys(_project.users).forEach((value) => { _users.push(value) });
                setUsers(_users);
            } else {
                setProject(false);
            }
        });
    }, [id]);

    useEffect(() => {
        if(users === null) { return; }
        const q = query(collection(db, "projects", id, "firstnames"));
        return onSnapshot(q, (querySnapshot) => {
          let newRanks = {
            'global': []
          };
          let _totalCount = 0;
          querySnapshot.forEach((doc) => {
                let result = doc.data();
                result.id = doc.id;
                _totalCount += 1;
                if(!result.hide) {
                    newRanks['global'].push(result);
                }

                users.forEach((value) => { 
                    if (newRanks[value] === undefined) {
                        newRanks[value] = [];
                    }
                    if(!getHide(result, value)) {
                        newRanks[value].push(result);
                    }
                 });
          });
          setTotalCount(_totalCount);
          newRanks['global'] = newRanks['global'].sort((a, b) => b.rankElo - a.rankElo);
          users.forEach((value) => { 
            if (newRanks[value] !== undefined) {
                newRanks[value] = newRanks[value].sort((a, b) => getEloRank(b, value) - getEloRank(a, value));
            }
          });
          setRanks(newRanks);
        });
    }, [id, users]);

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
                Nb firstname still in competition : {ranks["global"].length}
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
                    <h2>Global Rank (Top 20/{ranks["global"].length})</h2>
                    <ul>
                        {ranks["global"].slice(0,20).map(firstname => <li>{firstname.firstname} - {firstname.rankElo}</li>)}
                    </ul>
                </Col>
                {users.map((userId) => (
                    <Col>
                        <h2>Rank {project.users[userId].displayName} (Top 20/{(ranks[userId] || []).length})</h2>
                        <ul>
                            {(ranks[userId] || []).slice(0,20).map(firstname => <li>{firstname.firstname} - {getEloRank(firstname, userId)}</li>)}
                        </ul>
                    </Col>
                ))}
            </Row>
        </Container>
    </>;
};

export default Project;
