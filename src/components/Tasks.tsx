import React from "react";
import { TaskGrid } from "./Task";
import { API } from "../constants";
import { Task } from "../types";

const Tasks: React.FunctionComponent = () => {
    const [tasks, setTasks] = React.useState<Task[]>([]);

    const fetchTasks = React.useCallback(async (): Promise<void> => {
        const url = new URL(`${API}/tasks/lastruntime`);
        const response = await fetch(url.toString());

        if (response.ok) {
            const body = await response.json();
            setTasks(body.data);
        } else {
            console.log(`Error: ${response.status}`);
            console.log(`Error: ${response.statusText}`);
            console.log("An error occurred while querying the tasks");
            console.log(url.toString());
        }
    }, []);

    React.useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    return <TaskGrid tasks={tasks} />;
};

export default Tasks;
