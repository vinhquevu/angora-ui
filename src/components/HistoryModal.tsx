import React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { TaskLogRecord } from "../types";
import { API } from "../constants";
import BaseModal from "./BaseModal";
import dayjs from "dayjs";

interface HistoryProps {
    taskName: string;
    open: boolean;
    onClose: () => void;
}

const HistoryModal: React.FunctionComponent<HistoryProps> = (
    props: HistoryProps,
) => {
    const [history, setHistory] = React.useState<TaskLogRecord[]>();

    const fetchHistory = React.useCallback(async (): Promise<void> => {
        const today = dayjs().format("YYYY-MM-DD").toString();
        const url = new URL(`${API}/task/history`);
        url.searchParams.append("run_date", today);
        url.searchParams.append("name", props.taskName);
        const response = await fetch(url.toString());

        if (response.ok) {
            const body = await response.json();
            setHistory(body.data);
        } else {
            console.error(`Error: ${response.status}`);
            console.error(url.toString());
            alert("An error occurred while querying the task's history");
        }
    }, [props.taskName]);

    React.useEffect(() => {
        if (props.taskName === undefined) return;

        fetchHistory();
    }, [props.taskName, fetchHistory]);

    const rows = history?.map((data: TaskLogRecord) => {
        return (
            <TableRow key={data.id}>
                <TableCell>{data.time_stamp}</TableCell>
                <TableCell>{data.command}</TableCell>
                <TableCell>{data.trigger}</TableCell>
                <TableCell>{data.status}</TableCell>
                <TableCell>{data.parameters}</TableCell>
                <TableCell>{data.log}</TableCell>
            </TableRow>
        );
    });

    return (
        <BaseModal
            open={props.open}
            title={props.taskName}
            onClose={props.onClose}
            fullScreen={true}
        >
            <TableContainer>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Time Stamp</TableCell>
                            <TableCell>Command</TableCell>
                            <TableCell>Trigger</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Parameters</TableCell>
                            <TableCell>Log</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>{rows}</TableBody>
                </Table>
            </TableContainer>
        </BaseModal>
    );
};

export default HistoryModal;
