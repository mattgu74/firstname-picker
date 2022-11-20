import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getApp } from "firebase/app";
import { getFirestore, doc, collection, getDoc, query, onSnapshot, writeBatch, updateDoc } from "firebase/firestore";
import AddFirstname from "../components/AddFirstname";
import { getEloRank, getHide } from "../utils/utils";
import { getAuth } from "firebase/auth";
import { Button, Col, Row } from "react-bootstrap";

const app = getApp();
const db = getFirestore(app);
const auth = getAuth(app);

/* ELO Algorithm */
function getRatingDelta(myRating, opponentRating, myGameResult) {
    if ([0, 0.5, 1].indexOf(myGameResult) === -1) {
        return null;
    }
    
    var myChanceToWin = 1 / ( 1 + Math.pow(10, (opponentRating - myRating) / 400));

    return Math.round(32 * (myGameResult - myChanceToWin));
}

function getNewRating(myRating, opponentRating, myGameResult) {
    return myRating + getRatingDelta(myRating, opponentRating, myGameResult);
}

const Match = () => {
    const { id } = useParams();

    const [project, setProject] = useState(null);
    const [firstnames, setFirstnames] = useState([]);
    const [battle, setBattle] = useState([]);

    useEffect(() => {
        const docRef = doc(db, "projects", id);
        getDoc(docRef).then((docSnap) => {
            if(docSnap.exists()) {
                setProject({id, ...docSnap.data()});
            } else {
                setProject(false);
            }
        });

        const q = query(collection(db, "projects", id, "firstnames"));
        onSnapshot(q, (querySnapshot) => {
          let results = [];
          querySnapshot.forEach((doc) => {
                let result = doc.data();
                result.id = doc.id;
                if(!getHide(result, auth.currentUser)) {
                    results.push(result);
                }
          });
          setFirstnames(results);
        });
    }, [id]);

    if (project === null) {
        return <>Loading...</>;
    }

    if (project === false) {
        return <>Not Found !</>;
    }

    let match = <>Add more firstname first !</>;

    const winBattle = (idx, hide) => {
        let player_0 = getNewRating(battle[0].rankElo, battle[1].rankElo, 1 - idx);
        let player_1 = getNewRating(battle[1].rankElo, battle[0].rankElo, idx);
        let user_player_0 = getNewRating(getEloRank(battle[0], auth.currentUser), getEloRank(battle[1], auth.currentUser), 1 - idx);
        let user_player_1 = getNewRating(getEloRank(battle[1], auth.currentUser), getEloRank(battle[0], auth.currentUser), idx);
        const batch = writeBatch(db);
        const key = "rankEloUser." + auth.currentUser.uid;
        const hideKey = "hideUser." + auth.currentUser.uid;
        let data_0 = {"rankElo": player_0, [key]: user_player_0};
        let data_1 = {"rankElo": player_1, [key]: user_player_1};
        if (hide) {
            if (idx>=0.5) {
                data_0.hide = true;
                data_0[hideKey] = true;
            }
            if (idx<=0.5) {
                data_1.hide = true;
                data_1[hideKey] = true;
            }
        }
        batch.update(
            doc(db, "projects", id, "firstnames", battle[0].id),
            data_0);
        batch.update(
            doc(db, "projects", id, "firstnames", battle[1].id),
            data_1);
        batch.commit();
        setBattle([]);
    };

    if (firstnames.length > 5) {
        if (battle.length == 0) {
            const a = firstnames.length * Math.random() | 0;
            let b = firstnames.length * Math.random() | 0;
            if (a == b) { b += 1 };
            if (b == firstnames.length) { b = 0 };
            setBattle([
                firstnames[a],
                firstnames[b],
            ])
        } else {
            match = <>
            <Row className="justify-content-md-center">
                <Col className="p-5 bg-light rounded-3 text-center">
                    <Button variant="danger" onClick={() => winBattle(1, true)}>X</Button><br /><br />
                    <strong>{battle[0].firstname}</strong><br /><br />
                    <Button variant="success" onClick={() => winBattle(0, false)}>Win</Button><br />
                </Col>
                <Col className="p-5 bg-light rounded-3 text-center">
                    <Button variant="danger" onClick={() => winBattle(0.5, true)}>X</Button><br /><br />
                    <strong>VS</strong><br /><br />
                    <Button variant="info" onClick={() => winBattle(0.5, false)}>Tie</Button><br />
                </Col>
                <Col className="p-5 bg-light rounded-3 text-center">
                    <Button variant="danger" onClick={() => winBattle(0, true)}>X</Button><br /><br />
                    <strong>{battle[1].firstname}</strong><br /><br />
                    <Button variant="success" onClick={() => winBattle(1, false)}>Win</Button><br />
                </Col>
            </Row>
            <Row>
                <Col>
                </Col>
            </Row>
            </>;
        }
    }

    return <>
        <Row>
            <Col><h1>Match for project #{project.title}</h1></Col>
        </Row>
        {match}
    </>;
};

export default Match;
