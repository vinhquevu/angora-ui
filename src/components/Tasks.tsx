import React from "react";
import Grid from "@material-ui/core/Grid";
import { API } from "../constants";
import { Task } from "../types";
import TaskNode from "./Task";

const Tasks: React.FunctionComponent = () => {
    const [tasks, setTasks] = React.useState([] as Task[]);

    const fetchTasks = React.useCallback(async (): Promise<void> => {
        const url = new URL(`${API}/tasks`);
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

    const elements = Object.entries(tasks).map(
        ([index, task]): React.ReactNode => {
            return (
                <Grid item key={`grid_${task.name}`}>
                    <TaskNode key={task.name} task={task} />
                </Grid>
            );
        },
    );

    return (
        <Grid container spacing={1} direction="row">
            {elements}
        </Grid>
    );
};

export default Tasks;
