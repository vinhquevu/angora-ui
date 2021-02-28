import React from "react";
import Button from "@material-ui/core/Button";
import CloseIcon from "@material-ui/icons/Close";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import { API } from "../constants";
import { Task } from "../types";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        backdrop: {
            backgroundColor: theme.palette.action.disabledBackground,
        },
    }),
);

interface DialogProps {
    open: boolean;
    taskName: string;
    onClick: () => void;
}

const TaskModal: React.FunctionComponent<DialogProps> = (
    props: DialogProps,
) => {
    const classes = useStyles();
    const [taskData, setTaskData] = React.useState({} as Task);

    React.useEffect(() => {
        async function fetchTask(): Promise<void> {
            const url = new URL(`${API}/tasks`);
            url.searchParams.append("name", props.taskName);
            const response = await fetch(url.toString());

            if (response.ok) {
                const jsonResult = await response.json();
                setTaskData(jsonResult["data"][0]);
            } else {
                console.log(`Error: ${response.status}`);
                console.log(
                    "An error occurred while querying the task's workflow",
                );
                console.log(url.toString());
            }
        }

        if (props.taskName !== "") fetchTask();
    }, [props.taskName]);

    return (
        <Dialog
            onClose={props.onClick}
            aria-labelledby="customized-dialog-title"
            open={props.open}
            BackdropProps={{
                classes: {
                    root: classes.backdrop,
                },
            }}
        >
            <DialogTitle>
                <Grid
                    container
                    direction="row"
                    justify="space-between"
                    alignItems="center"
                >
                    <Grid item>{props.taskName}</Grid>
                    <Grid item>
                        <IconButton onClick={props.onClick}>
                            <CloseIcon />
                        </IconButton>
                    </Grid>
                </Grid>
            </DialogTitle>
            <DialogContent dividers>
                <div>Command: {taskData.command}</div>
                <div>Triggers: {taskData.triggers}</div>
                <div>Log: {taskData.log}</div>
                <div>
                    Replay Count:{" "}
                    {taskData.replay === null ? "Infinite" : taskData.replay}
                </div>
                <div>
                    Parent Success: {taskData.parent_success ? "True" : "False"}
                </div>
                <div>Last Run Time: {taskData.last_run_time}</div>
            </DialogContent>
            <DialogActions>
                <Link
                    to={{
                        pathname: "/history",
                        state: { taskName: props.taskName },
                    }}
                >
                    <Button onClick={props.onClick}>History</Button>
                </Link>
                <Link
                    to={{
                        pathname: "/workflow",
                        state: { taskName: props.taskName },
                    }}
                >
                    <Button>Workflow</Button>
                </Link>
                <Link
                    to={{
                        pathname: "/log",
                        state: { taskName: props.taskName },
                    }}
                >
                    <Button onClick={props.onClick}>Log</Button>
                </Link>

                <Link
                    to={{
                        pathname: "/execute",
                        state: {
                            taskName: props.taskName,
                            command: taskData.command,
                            triggers: taskData.triggers,
                        },
                    }}
                >
                    <Button onClick={props.onClick}>Execute</Button>
                </Link>
            </DialogActions>
        </Dialog>
    );
};

export default TaskModal;
