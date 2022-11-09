import { useState } from "react";
import { Navigate } from "react-router-dom";

import { getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const app = getApp();
const db = getFirestore(app);
const auth = getAuth(app);

const addProject = (project) => {
    project.userId = auth.currentUser.uid;
    project.allowedUsers = [];
    addDoc(collection(db, "projects"), project).then(
        (obj) => console.log(obj)
    );
};

const NewProject = () => {
    const [project, setProject] = useState({title: ""});

    const handleSubmit = (event) => {
        // prevents the submit button from refreshing the page
        event.preventDefault();
        addProject(project);
        setProject(null);
    };

    const handleChange = (event) => {
        setProject({ ...project, [event.target.name]: event.target.value });
    };

    if (project === null) {
        return <Navigate to="/projects" replace={true} />;
    }

    return <>
        <h1>Create a new Project</h1>
        <form onSubmit={handleSubmit} onChange={handleChange}>
            <label>Name: </label>
            <input
                type="text"
                name="title"
                placeholder="Name"
                value={project.title}
            />
            <button>Add Project</button>
        </form>
    </>;
};

export default NewProject;
