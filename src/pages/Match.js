import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getApp } from "firebase/app";
import { getFirestore, doc, collection, getDoc, query, onSnapshot, writeBatch, updateDoc } from "firebase/firestore";
import AddFirstname from "../components/AddFirstname";
import { getEloRank } from "../utils/utils";
import { getAuth } from "firebase/auth";

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
                results.push(result);
          });
          setFirstnames(results.sort((a, b) => b.rankElo - a.rankElo));
        });
    }, [id]);

    if (project === null) {
        return <>Loading...</>;
    }

    if (project === false) {
        return <>Not Found !</>;
    }

    let match = <>Add more firstname first !</>;

    const winBattle = (idx) => {
        let player_0 = getNewRating(battle[0].rankElo, battle[1].rankElo, 1 - idx);
        let player_1 = getNewRating(battle[1].rankElo, battle[0].rankElo, idx);
        let user_player_0 = getNewRating(getEloRank(battle[0], auth.currentUser), getEloRank(battle[1], auth.currentUser), 1 - idx);
        let user_player_1 = getNewRating(getEloRank(battle[1], auth.currentUser), getEloRank(battle[0], auth.currentUser), idx);
        const batch = writeBatch(db);
        const key = "rankEloUser." + auth.currentUser.id;
        batch.update(
            doc(db, "projects", id, "firstnames", battle[0].id),
            {"rankElo": player_0, [key]: user_player_0});
        batch.update(
            doc(db, "projects", id, "firstnames", battle[1].id),
            {"rankElo": player_1, [key]: user_player_1});
        batch.commit();
        setBattle([]);
    };

    const hide = (idx) => {
        const key = "hideUser." + auth.currentUser.id;
        if(idx <= 0.5) {
            updateDoc(
                doc(db, "projects", id, "firstnames", battle[0].id),
                {"hide": true, [key]: true }
            );
        }
        if(idx >= 0.5) {
            updateDoc(
                doc(db, "projects", id, "firstnames", battle[1].id),
                {"hide": true, [key]: true }
            );
        }
        setBattle([])
    }

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
                {battle[0].firstname} <button onClick={() => winBattle(0)}>Win</button><button onClick={() => hide(0)}>X</button><br />
                VS <button onClick={() => winBattle(0.5)}>Tie</button><button onClick={() => hide(0.5)}>X</button><br />
                {battle[1].firstname} <button onClick={() => winBattle(1)}>Win</button><button onClick={() => hide(1)}>X</button><br />
            </>;
        }
    }

    return <>
        <h1>Match for project #{project.title}</h1>
        Nb firstname: {firstnames.length} <br />
        <AddFirstname project={project} /> <br />
        <h2>Play</h2>
        {match}
    </>;
};

export default Match;
