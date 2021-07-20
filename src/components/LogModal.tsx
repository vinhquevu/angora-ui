import React from "react";
import Typography from "@material-ui/core/Typography";
import BaseModal from "./BaseModal";
import { API } from "../constants";
import { Task } from "../types";

interface LogModalProps {
    open: boolean;
    task: Task;
    onClose: () => void;
}

const LogModal: React.FunctionComponent<LogModalProps> = (
    props: LogModalProps,
) => {
    const [log, setLog] = React.useState("");

    const fetchLog = React.useCallback(async (): Promise<void> => {
        const url = new URL(`${API}/task/log`);
        url.searchParams.append("name", props.task.name);
        const response = await fetch(url.toString());

        if (response.ok) {
            const body = await response.json();
            setLog(body.data);
        } else {
            console.log(`Error: ${response.status}`);
            console.log("An error occurred while querying the task's log");
            console.log(url.toString());
        }
    }, [props.task]);

    React.useEffect(() => {
        fetchLog();
    }, [fetchLog]);

    return (
        <BaseModal
            open={props.open}
            title={props.task.name}
            onClose={props.onClose}
            fullScreen={true}
        >
            <Typography style={{ whiteSpace: "pre-line" }}>{log}</Typography>
        </BaseModal>
    );
};

export default LogModal;
