// Todo fix last run time value

import React from "react";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import BaseModal from "./BaseModal";
import { Task } from "../types";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";

interface TaskModalProps {
    open: boolean;
    task: Task;
    onClose: () => void;
    onWorkflowClick: () => void;
    onHistoryClick: () => void;
    onLogClick: () => void;
    onExecuteClick: () => void;
}

const TaskModal: React.FunctionComponent<TaskModalProps> = (
    props: TaskModalProps,
) => {
    const [task] = React.useState(props.task);
    const buttons = (
        <>
            <Link
                to={{
                    pathname: "/workflow",
                    state: { taskName: task.name },
                }}
            >
                <Button onClick={props.onClose}>Workflow</Button>
            </Link>
            <Button onClick={props.onHistoryClick}>History</Button>
            <Button onClick={props.onLogClick}>Log</Button>
            <Button onClick={props.onExecuteClick}>Execute</Button>
        </>
    );

    return (
        <BaseModal
            title={task.name}
            open={props.open}
            buttons={buttons}
            onClose={props.onClose}
        >
            <TableContainer key={1}>
                <Table size="small" key={2}>
                    <TableBody>
                        <TableRow>
                            <TableCell>Command</TableCell>
                            <TableCell>{task.command}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Triggers</TableCell>
                            <TableCell>
                                {(task.triggers ?? []).map((trigger) => {
                                    return <div key={trigger}>{trigger}</div>;
                                })}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Log</TableCell>
                            <TableCell>{task.log}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Replay Count</TableCell>
                            <TableCell>
                                {task.replay === null
                                    ? "Infinite"
                                    : task.replay}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Parent Success</TableCell>
                            <TableCell>
                                {task.parent_success ? "True" : "False"}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Last Run Time</TableCell>
                            <TableCell>{task.time_stamp}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </BaseModal>
    );
};

export default TaskModal;
