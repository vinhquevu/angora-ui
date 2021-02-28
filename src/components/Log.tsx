import React from "react";
import { useLocation } from "react-router-dom";
import { API } from "../constants";

interface stateType {
    taskName: string;
}

const Log: React.FunctionComponent = () => {
    const [logData, setLogData] = React.useState("");
    const { state } = useLocation<stateType>();

    React.useEffect(() => {
        const fetchData = async (): Promise<void> => {
            const url = new URL(`${API}/task/log`);
            url.searchParams.append("name", state.taskName);
            const response = await fetch(url.toString());

            if (response.ok) {
                const jsonResult = await response.json();
                setLogData(jsonResult["data"]);
            } else {
                console.log(`Error: ${response.status}`);
                console.log("An error occurred while querying the task's log");
                console.log(url.toString());
            }
        };

        fetchData();
    }, [state.taskName]);

    return <>{logData}</>;
};

export default Log;
