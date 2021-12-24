import React from "react";
import Typography from "@material-ui/core/Typography";
import BaseModal from "./BaseModal";
import { API } from "../constants";

interface LogModalProps {
    taskName: string;
    open: boolean;
    onClose: () => void;
}

const LogModal: React.FunctionComponent<LogModalProps> = (
    props: LogModalProps,
) => {
    const [log, setLog] = React.useState<string>();

    const fetchLog = React.useCallback(async (): Promise<void> => {
        const url = new URL(`${API}/task/log`);
        url.searchParams.append("name", props.taskName);
        const response = await fetch(url.toString());

        if (response.ok) {
            const body = await response.json();
            setLog(body.data);
        } else {
            console.error(`Error: ${response.status}`);
            console.error(url.toString());
            alert("An error occurred while querying the task's log");
        }
    }, [props.taskName]);

    React.useEffect(() => {
        if (props.taskName === undefined) return;

        fetchLog();
    }, [props.taskName, fetchLog]);

    return (
        <BaseModal
            open={props.open}
            title={props.taskName}
            onClose={props.onClose}
            fullScreen={true}
        >
            <Typography style={{ whiteSpace: "pre-line" }}>{log}</Typography>
        </BaseModal>
    );
};

export default LogModal;
