import React from "react";
import { API } from "./constants";

interface Task {
    name: string;
    config_source: string;
    command: string;
    log: string;
    messages: Array<string>;
    parameters: Array<string>;
    parent_success: boolean;
    parents: [];
    replay: number;
    status: string;
    triggers: Array<string>;
    time_stamp: string;
    last_run_time: string;
}

interface TaskGroup {
    [key: string]: Task[];
}

const Tasks: React.FunctionComponent = () => {
    const [taskGroups, setTaskData] = React.useState({} as TaskGroup);

    React.useEffect(() => {
        async function fetchTasks(): Promise<void> {
            const url = new URL(`${API}/tasks/lastruntime/sorted/category`);
            const response = await fetch(url.toString());

            if (!response.ok) console.log(`Error: ${response.status}`);
            const jsonResult = await response.json();
            setTaskData(jsonResult["data"]);
            console.log(jsonResult["data"]);
        }

        fetchTasks();
    }, []);

    const taskList = Object.entries(taskGroups).map(([groupName, tasks]) => {
        return (
            <div key={groupName}>
                {groupName}
                <ul>
                    {tasks.map((item) => {
                        return <li key={item.name}>{item.name}</li>;
                    })}
                </ul>
            </div>
        );
    });

    return (
        <>
            Tasks
            {taskList}
        </>
    );
};

export default Tasks;
