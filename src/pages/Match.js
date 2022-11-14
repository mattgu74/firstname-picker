import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const app = getApp();
const db = getFirestore(app);

const Match = () => {
    const { id } = useParams();

    const [project, setProject] = useState(null);

    useEffect(() => {
        const docRef = doc(db, "projects", id);
        getDoc(docRef).then((docSnap) => {
            if(docSnap.exists()) {
                setProject(docSnap.data());
            } else {
                setProject(false);
            }
        });
    }, [id]);

    if (project === null) {
        return <>Loading...</>;
    }

    if (project === false) {
        return <>Not Found !</>;
    }

    return <>
        <h1>Match for project #{project.title}</h1>
    </>;
};

export default Match;
