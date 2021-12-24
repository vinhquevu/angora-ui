import React from "react";
import clsx from "clsx";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { API } from "../constants";
import { Task } from "../types";
import Grid from "@material-ui/core/Grid";
import TaskModal from "./TaskModal";
import HistoryModal from "./HistoryModal";
import LogModal from "./LogModal";
import ExecuteModal from "./ExecuteModal";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        node: {
            padding: theme.spacing(1),
            borderRadius: theme.shape.borderRadius,
            minWidth: "150px",
            width: "fit-content",
            fontSize: theme.typography.fontSize,
            color: theme.palette.text.primary,
            textAlign: "center",
            borderWidth: "1px",
            borderStyle: "solid",
            cursor: "pointer",
            fontFamily: theme.typography.fontFamily,
        },
        success: {
            backgroundColor: theme.palette.success.main,
        },
        start: {
            backgroundColor: theme.palette.primary.main,
        },
        fail: {
            backgroundColor: theme.palette.error.main,
        },
    }),
);

interface TaskCardProps {
    task: Task;
    onClick: () => void;
}

const TaskCard: React.FunctionComponent<TaskCardProps> = (
    props: TaskCardProps,
) => {
    const classes = useStyles();

    // const fetchTask = async (taskName: string): Promise<Task> => {
    //     const url = new URL(`${API}/tasks/lastruntime`);
    //     url.searchParams.append("name", taskName);

    //     const response = await fetch(url.toString());
    //     if (!response.ok) {
    //         console.error(response.status);
    //         console.error(url.toString());
    //         throw Error("Error fetching task data");
    //     }

    //     const body = await response.json();
    //     return body.data[0];
    // };

    return (
        <div
            className={clsx(classes.node, {
                [classes.success]: props.task.status === "success",
                [classes.fail]: props.task.status === "fail",
                [classes.start]: props.task.status === "start",
            })}
            onClick={props.onClick}
        >
            {props.task.name ?? "Loading . . ."}
            <br />
            {props.task.time_stamp}
        </div>
    );
};

interface TaskControlProps {
    task: Task;
    show: boolean;
    onClose: () => void;
}

const TaskControl: React.FunctionComponent<TaskControlProps> = ({
    task,
    show,
    onClose,
}: TaskControlProps) => {
    const [taskModalShow, setTaskModalShow] = React.useState(show);
    const [historyModalShow, setHistoryModalShow] = React.useState(false);
    const [logModalShow, setLogModalShow] = React.useState(false);
    const [executeModalShow, setExecuteModalShow] = React.useState(false);

    React.useEffect(() => {
        setTaskModalShow(show);
    }, [show]);

    const handleHistoryClick = () => {
        onClose();
        setHistoryModalShow(true);
    };
    const handleLogClick = (): void => {
        onClose();
        setLogModalShow(true);
    };
    const handleExecuteClick = (): void => {
        onClose();
        setExecuteModalShow(true);
    };

    const handleExecute = async (
        trigger: string,
        parameters: string[],
    ): Promise<void> => {
        const url = new URL(`${API}/send`);
        url.searchParams.append("queue", "angora");
        url.searchParams.append("routing_key", "angora");
        url.searchParams.append("message", trigger);
        parameters.forEach((parameter) => {
            url.searchParams.append("params", parameter);
        });

        const response = await fetch(url.toString());

        if (!response.ok) {
            console.error(url.toString());
            alert("Error accessing API");
            return;
        }

        const body = await response.json();

        if (body.status === "error") {
            console.error(url.toString());
            alert("Error executing task");
        }
    };

    const handleSubmit = (trigger: string, parameters: string[]): void => {
        setExecuteModalShow(false);
        handleExecute(trigger, parameters);
    };

    return (
        <>
            <TaskModal
                open={taskModalShow}
                task={task}
                onClose={onClose}
                onWorkflowClick={onClose}
                onHistoryClick={handleHistoryClick}
                onLogClick={handleLogClick}
                onExecuteClick={handleExecuteClick}
            />
            <HistoryModal
                open={historyModalShow}
                taskName={task.name}
                onClose={() => setHistoryModalShow(false)}
            />
            <LogModal
                // key={`log_${task.time_stamp}`}
                open={logModalShow}
                taskName={task.name}
                onClose={() => setLogModalShow(false)}
            />
            <ExecuteModal
                open={executeModalShow}
                task={task}
                onClose={() => setExecuteModalShow(false)}
                onSubmit={handleSubmit}
            />
        </>
    );
};

interface TaskGridProps {
    tasks: Task[];
}

const TaskGrid: React.FunctionComponent<TaskGridProps> = (
    props: TaskGridProps,
) => {
    const [task, setTask] = React.useState<Task>({} as Task);
    const [taskControlShow, setTaskControlShow] = React.useState(false);

    const handleTaskClick = (task: Task) => {
        console.log("click");
        setTask(task);
        setTaskControlShow(true);
    };

    const handleTaskControlClose = () => setTaskControlShow(false);

    const elements = Object.entries(props.tasks).map(
        ([index, task]): React.ReactNode => {
            return (
                <Grid item key={`grid_${task.name}`}>
                    <TaskCard
                        key={task.name}
                        task={task}
                        onClick={() => handleTaskClick(task)}
                    />
                </Grid>
            );
        },
    );

    return (
        <>
            <Grid container spacing={1} direction="row">
                {elements}
            </Grid>
            <TaskControl
                task={task}
                show={taskControlShow}
                onClose={handleTaskControlClose}
            />
        </>
    );
};

export { TaskGrid, TaskControl };
