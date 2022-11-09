import { useState } from "react";
import { Link, Navigate } from "react-router-dom";

import { getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, deleteDoc } from "firebase/firestore";

const app = getApp();
const db = getFirestore(app);
const auth = getAuth(app);

export default function Project({project}) {
    const deleteProject = (project) => {
        deleteDoc(doc(db, "projects", project.id));
    };

    return <>
        <h3>#{project.id} - {project.title}</h3>
        {project.userId === auth.currentUser.uid && 
            <><button onClick={() => deleteProject(project)}>Delete</button><br /></>
        }
        <Link to={"/projects/" + project.id + "/match"}>Launch a match</Link>
    </>;
}
