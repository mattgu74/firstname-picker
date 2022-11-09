import { Outlet, Link } from "react-router-dom";


import { getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const Layout = () => {
    const auth = getAuth(getApp());

    return (
        <>
        <p>Welcome {auth.currentUser.displayName}! You are now signed-in!</p>
        <button onClick={() => auth.signOut()}>Sign-out</button>
        <nav>
            <ul>
            <li>
                <Link to="/">Home</Link>
            </li>
            <li>
                <Link to="/users">Users</Link>
            </li>
            <li>
                <Link to="/projects">Projects</Link>
            </li>
            </ul>
        </nav>

        <Outlet />
        </>
    );
};

export default Layout;
