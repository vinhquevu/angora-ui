import React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import dayjs from "dayjs";
import { useLocation } from "react-router-dom";
import { API } from "../constants";
import { Task } from "../types";

interface stateType {
    taskName: string;
}

const History: React.FunctionComponent = () => {
    const [historyData, setHistoryData] = React.useState([] as Task[]);
    const { state } = useLocation<stateType>();
    const today = dayjs().format("YYYY-MM-DD");

    React.useEffect(() => {
        const fetchData = async (): Promise<void> => {
            const url = new URL(`${API}/task/history`);
            url.searchParams.append("run_date", today.toString());
            url.searchParams.append("name", state.taskName);
            const response = await fetch(url.toString());

            if (response.ok) {
                const jsonResult = await response.json();
                console.log(jsonResult["data"]);
                console.log(url.toString());
                setHistoryData(jsonResult["data"]);
            } else {
                console.log(`Error: ${response.status}`);
                console.log(
                    "An error occurred while querying the task's history",
                );
                console.log(url.toString());
            }
        };

        fetchData();
    }, [state.taskName]);

    return (
        <TableContainer>
            <Table>
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
                <TableBody></TableBody>
            </Table>
        </TableContainer>
    );
};

export default History;
