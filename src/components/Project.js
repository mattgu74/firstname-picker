import { useState } from "react";
import { Link, Navigate } from "react-router-dom";

import { getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, deleteDoc, updateDoc } from "firebase/firestore";

import AddAllowedUser from "./AddAllowedUser";

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
    ).then(
        (obj) => console.log(obj)
    );
};

export default function Project({project}) {
    const deleteProject = (project) => {
        deleteDoc(doc(db, "projects", project.id));
    };

    return <>
        <h2>{project.title}</h2>
        <h3>Actions</h3>
        <ul>
        {(project.userId === auth.currentUser.uid) && 
            <>
                <li><button onClick={() => deleteProject(project)}>Delete</button></li>
            </>
        }
            <li><Link to={"/projects/" + project.id + "/match"}>Launch a match</Link></li>
        </ul>
        <h3>User list</h3>
        <ul>
            <li><strong>{project.userEmail} (OWNER)</strong></li>
            {project.allowedUsers?.map(email => 
                <li>{email} {(project.userId === auth.currentUser.uid) && <button onClick={() => removeAllowedUser(project, email)}>X</button>}</li>
            )}
            {(project.userId === auth.currentUser.uid || true) && 
                <li><AddAllowedUser project={project}/></li>
            }
        </ul>
    </>;
}
