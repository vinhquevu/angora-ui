import React from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TaskModal from "./TaskModal";
import { API } from "../constants";
import { Task } from "../types";

interface TaskGroup {
    [key: string]: Task[];
}

const Tasks: React.FunctionComponent = () => {
    const defaultNode: React.CSSProperties = {
        padding: "10px",
        borderRadius: "3px",
        width: "150px",
        fontSize: "12px",
        color: "#222",
        textAlign: "center",
        borderWidth: "1px",
        borderStyle: "solid",
        // Custom
        cursor: "pointer",
        // backgroundColor: theme.palette.success.dark,
    };

    const [taskGroups, setTaskGroupData] = React.useState({} as TaskGroup);
    const [modalOpen, setModalOpen] = React.useState(false);
    const [taskName, setTaskName] = React.useState("");

    React.useEffect(() => {
        async function fetchTasks(): Promise<void> {
            const url = new URL(`${API}/tasks/lastruntime/sorted/category`);
            const response = await fetch(url.toString());

            if (response.ok) {
                const jsonResult = await response.json();
                setTaskGroupData(jsonResult["data"]);
            } else {
                console.log(`Error: ${response.status}`);
                console.log(
                    "An error occurred while querying the task's workflow",
                );
                console.log(url.toString());
            }
        }

        fetchTasks();
    }, []);

    const handleClick = (taskName: string) => {
        setTaskName(taskName);
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
    };

    const taskList = Object.entries(taskGroups).map(([groupName, tasks]) => {
        return (
            <div key={`div_${groupName}`}>
                <Typography key={`title_${groupName}`}>{groupName}</Typography>
                <Grid key={groupName} container spacing={1}>
                    {tasks.map((task) => {
                        return (
                            <Grid item key={`grid_${task.name}`}>
                                <div
                                    key={`div_${task.name}`}
                                    style={defaultNode}
                                    onClick={() => handleClick(task.name)}
                                >
                                    {task.name}
                                </div>
                            </Grid>
                        );
                    })}
                </Grid>
                <TaskModal
                    open={modalOpen}
                    taskName={taskName}
                    onClick={handleModalClose}
                />
            </div>
        );
    });

    return <>{taskList}</>;
};

export default Tasks;
