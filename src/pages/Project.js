import {useParams} from "react-router-dom";

const Project = () => {
    const { id } = useParams();

    return <>
        <h1>Project #{id}</h1>
    </>;
};

export default Project;
