import { useState } from "react";

import { getApp } from "firebase/app";
import { getFirestore, setDoc, doc } from "firebase/firestore";

const app = getApp();
const db = getFirestore(app);

const addFirstname = (project, firstname) => {
    setDoc(
        doc(db, "projects", project.id, "firstnames", firstname),
        {rankElo: 1000, firstname}
    );
    return true;
};

const AddFirstname = (props) => {
    const { project } = props;

    const [firstname, setFirstname] = useState("");
    const [error, setError] = useState(null);

    const handleSubmit = (event) => {
        // prevents the submit button from refreshing the page
        event.preventDefault();
        const result = addFirstname(project, firstname);
        if (result === true) {
            setFirstname("");
            setError(null);
        } else {
            setError(result);
        }
    };

    const handleChange = (event) => {
        if(event.target.name == 'firstname') {
            setFirstname(event.target.value);
            setError(null);
        }
    };

    return <>
        <form onSubmit={handleSubmit} onChange={handleChange}>
            <label>Firstname to add: </label>
            <input
                type="text"
                name="firstname"
                placeholder="firstname"
                value={firstname}
            />
            <button>Add this firstname</button> 
            {error !== null && <span className="red">{error}</span>}
        </form>
    </>;
};

export default AddFirstname;
