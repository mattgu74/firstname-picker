import { Link } from "react-router-dom";

import ProjectsList from '../components/ProjectsList';


const Projects = () => {
    return <>
        <h1>Projects</h1>
        <Link to="/projects/new">Add a project</Link>
        <ProjectsList />
    </>;
};

export default Projects;
