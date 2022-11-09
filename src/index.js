import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import {loading} from "./utils/loaders";

// FIREBASE
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, GoogleAuthProvider, EmailAuthProvider } from "firebase/auth";
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

const firebaseConfig = {
  apiKey: "AIzaSyCbcdXfS268AHSO0AUip9y8quNdueMWLpU",
  authDomain: "firstname-picker.firebaseapp.com",
  projectId: "firstname-picker",
  storageBucket: "firstname-picker.appspot.com",
  messagingSenderId: "439642825922",
  appId: "1:439642825922:web:710c149680e6ee6234c75b",
  measurementId: "G-Q9FFTJ2Q7Q"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
// END FIREBASE

const Layout = React.lazy(() => import('./pages/Layout'));
const Home = React.lazy(() => import('./pages/Home'));
const Users = React.lazy(() => import('./pages/Users'));
const Project = React.lazy(() => import('./pages/Project'));
const Projects = React.lazy(() => import('./pages/Projects'));
const NewProject = React.lazy(() => import('./pages/NewProject'));
const Match = React.lazy(() => import('./pages/Match'));
const Error404 = React.lazy(() => import('./pages/Error404'));

// Configure FirebaseUI.
const uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: 'popup',
    // We will display Google and Email as auth providers.
    signInOptions: [
        GoogleAuthProvider.PROVIDER_ID,
        EmailAuthProvider.PROVIDER_ID
    ],
    callbacks: {
      // Avoid redirects after sign-in.
      signInSuccessWithAuthResult: () => false,
    },
};

export default function App() {
    const [isSignedIn, setIsSignedIn] = useState(null); // Local signed-in state.

    // Listen to the Firebase Auth state and set the local state.
    useEffect(() => {
        const unregisterAuthObserver = onAuthStateChanged(auth, (user) => {
            setIsSignedIn(!!user);
        });
        return () => unregisterAuthObserver();
      }, []);

    if (isSignedIn === null) {
        return <>Loading ...</>;
    }

    if (!isSignedIn) {
        return (
            <div>
            <h1>Firstname Picker !</h1>
            <p>Please sign-in:</p>
            <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
            </div>
        );
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={loading(<Layout />, <></>)}>
                    <Route index element={loading(<Home />)} />
                    <Route path="users" element={loading(<Users />)} />
                    <Route path="projects" element={loading(<Projects />)} />
                    <Route path="projects/:id/match" element={loading(<Match />)} />
                    <Route path="projects/:id" element={loading(<Project />)} />
                    <Route path="projects/new" element={loading(<NewProject />)} />
                    <Route path="*" element={loading(<Error404 />)} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

const container = document.getElementById('app');
const root = createRoot(container);
root.render(<App />);
