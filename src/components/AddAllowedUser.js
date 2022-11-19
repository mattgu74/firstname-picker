import { useState } from "react";

import { getApp } from "firebase/app";
import { getFirestore, doc, updateDoc } from "firebase/firestore";

const app = getApp();
const db = getFirestore(app);

// RFC 5322
const emailRegexp = new RegExp("([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\"\(\[\]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\[[\t -Z^-~]*])");

const addAllowedUser = (project, email) => {
    if(!emailRegexp.test(email)) {
        return "This is not a valid email adress !";
    }

    if(project.allowedUsers.includes(email)) {
        return "Email already allowed for this project !";
    }
        
    project.allowedUsers.push(email);
    updateDoc(
        doc(db, "projects", project.id),
        {allowedUsers: project.allowedUsers}
    );
    return true;
};

const AddAllowedUser = (props) => {
    const { project } = props;

    const [email, setEmail] = useState("");
    const [error, setError] = useState(null);

    const handleSubmit = (event) => {
        // prevents the submit button from refreshing the page
        event.preventDefault();
        const result = addAllowedUser(project, email);
        if (result === true) {
            setEmail("");
            setError(null);
        } else {
            setError(result);
        }
    };

    const handleChange = (event) => {
        if(event.target.name == 'email') {
            setEmail(event.target.value);
            setError(null);
        }
    };

    return <>
        <form onSubmit={handleSubmit} onChange={handleChange}>
            <label>Email to add: </label>
            <input
                type="text"
                name="email"
                placeholder="email@gmail.com"
                value={email}
                onChange={handleChange}
            />
            <button>Add this email</button> 
            {error !== null && <span className="red">{error}</span>}
        </form>
    </>;
};

export default AddAllowedUser;
