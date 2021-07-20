import React from "react";
import clsx from "clsx";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import ExecuteModal from "./ExecuteModal";
import HistoryModal from "./HistoryModal";
import LogModal from "./LogModal";
import TaskModal from "./TaskModal";
import { API } from "../constants";
import { Task } from "../types";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        node: {
            padding: theme.spacing(1),
            borderRadius: theme.shape.borderRadius,
            minWidth: "150px",
            width: "auto",
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
    const [task, setTask] = React.useState(props.task);

    const fetchTask = React.useCallback(async (): Promise<void> => {
        const url = new URL(`${API}/tasks/lastruntime`);
        url.searchParams.append("name", props.task.name);

        const response = await fetch(url.toString());
        if (response.ok) {
            const body = await response.json();
            setTask(body.data[0]);
        } else {
            console.log("Error fetching task data");
            console.log(response.status);
            console.log(url.toString());
        }
    }, [props.task]);

    React.useEffect(() => {
        fetchTask();
    }, [fetchTask]);

    return (
        <div
            className={clsx(classes.node, {
                [classes.success]: task.status === "success",
                [classes.fail]: task.status === "fail",
                [classes.start]: task.status === "start",
            })}
            onClick={props.onClick}
        >
            {task.name ?? "Loading . . ."}
            <br />
            {task.time_stamp}
        </div>
    );
};

interface TaskNodeProps {
    task: Task;
}

interface TaskNodeState {
    task: Task;
    historyModalShow: boolean;
    logModalShow: boolean;
    executeModalShow: boolean;
    taskModalShow: boolean;
}

class TaskNode extends React.Component<TaskNodeProps, TaskNodeState> {
    constructor(props: TaskNodeProps) {
        super(props);

        this.state = {
            task: this.props.task,
            historyModalShow: false,
            logModalShow: false,
            executeModalShow: false,
            taskModalShow: false,
        };
    }

    handleWorkflowClick = () => {
        console.log("workflow click");
    };
    handleHistoryClick = () => {
        this.setState({ taskModalShow: false, historyModalShow: true });
    };
    handleLogClick = () => {
        this.setState({ taskModalShow: false, logModalShow: true });
    };
    handleExecuteClick = () => {
        this.setState({ taskModalShow: false, executeModalShow: true });
    };

    handleExecute = async (
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
            console.log(url.toString());
            throw new Error("Error accessing API");
        }

        const body = await response.json();

        if (body.status === "error") {
            console.log(url.toString());
            throw new Error("Error executing task");
        }
    };

    handleSubmit = (trigger: string, parameters: string[]) => {
        this.setState({
            executeModalShow: false,
        });
        this.handleExecute(trigger, parameters).catch((error) =>
            console.log(error),
        );
    };

    render(): React.ReactNode {
        return (
            <>
                <TaskCard
                    task={this.state.task}
                    onClick={() => this.setState({ taskModalShow: true })}
                />
                <TaskModal
                    open={this.state.taskModalShow}
                    task={this.state.task}
                    onClose={() => this.setState({ taskModalShow: false })}
                    onWorkflowClick={this.handleWorkflowClick}
                    onHistoryClick={this.handleHistoryClick}
                    onLogClick={this.handleLogClick}
                    onExecuteClick={this.handleExecuteClick}
                />
                <HistoryModal
                    open={this.state.historyModalShow}
                    taskName={this.state.task.name}
                    onClose={() => this.setState({ historyModalShow: false })}
                />
                <LogModal
                    key={`log_${this.state.task.time_stamp}`}
                    open={this.state.logModalShow}
                    task={this.state.task}
                    onClose={() => this.setState({ logModalShow: false })}
                />
                <ExecuteModal
                    open={this.state.executeModalShow}
                    task={this.state.task}
                    onClose={() => this.setState({ executeModalShow: false })}
                    onSubmit={this.handleSubmit}
                />
            </>
        );
    }
}

export default TaskNode;
