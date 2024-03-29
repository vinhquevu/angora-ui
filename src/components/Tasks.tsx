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
            console.error(`Error: ${response.status}`);
            console.error(url.toString());
            alert("An error occurred while querying the tasks");
        }
    }, []);

    React.useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    return <TaskGrid tasks={tasks} />;
};

export default Tasks;
