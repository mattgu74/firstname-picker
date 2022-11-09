import {useParams} from "react-router-dom";

const Match = () => {
    const { id } = useParams();

    return <>
        <h1>Match for project #{id}</h1>
        Matthieu VS Aurélien
    </>;
};

export default Match;
