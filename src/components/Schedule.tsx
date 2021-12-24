import React from "react";
import Box from "@material-ui/core/Box";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import { TaskGrid } from "./Task";
import { API } from "../constants";
import { Task } from "../types";

interface ScheduledRecords {
    [key: string]: Task[];
}

interface StyledTableProps {
    title: string;
    columnNames: string[];
    data: ScheduledRecords;
}

const StyledTable: React.FunctionComponent<StyledTableProps> = (
    props: StyledTableProps,
) => {
    const tableHead: React.ReactElement = (
        <TableHead>
            <TableRow>
                {props.columnNames.map((columnName) => (
                    <TableCell key={columnName}>{columnName}</TableCell>
                ))}
            </TableRow>
        </TableHead>
    );

    const tableBody: React.ReactElement = (
        <TableBody>
            {Object.entries(props.data).map(([interval, tasks]) => (
                <TableRow key={interval}>
                    <TableCell>{interval}</TableCell>
                    <TableCell>
                        <TaskGrid tasks={tasks} />
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    );

    return (
        <Box
            mb={2}
            style={{
                borderStyle: "solid",
                borderWidth: 1,
                borderColor: "grey",
            }}
        >
            <Typography style={{ marginTop: 5, marginLeft: 5 }}>
                {props.title}
            </Typography>
            <TableContainer>
                <Table size="small">
                    {tableHead}
                    {tableBody}
                </Table>
            </TableContainer>
        </Box>
    );
};

const Schedule: React.FunctionComponent = () => {
    const [scheduled, setScheduled] = React.useState<ScheduledRecords>({});
    const [repeating, setRepeating] = React.useState<ScheduledRecords>({});

    const fetchScheduled = React.useCallback(async (): Promise<void> => {
        const url = `${API}/tasks/scheduled`;
        const response = await fetch(url);

        if (response.ok) {
            const jsonResult = await response.json();
            setScheduled(jsonResult["data"]);
        } else {
            console.error(`Error: ${response.status}`);
            console.error(url);
            alert("An error occurred while querying scheduled tasks");
        }
    }, []);

    const fetchRepeating = React.useCallback(async (): Promise<void> => {
        const url = `${API}/tasks/repeating`;
        const response = await fetch(url);

        if (response.ok) {
            const jsonResult = await response.json();
            setRepeating(jsonResult["data"]);
        } else {
            console.error(`Error: ${response.status}`);
            console.error(url);
            alert("An error occurred while querying repeating tasks");
        }
    }, []);

    React.useEffect(() => {
        fetchScheduled();
        fetchRepeating();
    }, [fetchScheduled, fetchRepeating]);

    return (
        <>
            <StyledTable
                title="Repeating Tasks"
                columnNames={["Interval (Minutes)", "Tasks"]}
                data={repeating}
            />
            <StyledTable
                title="Scheduled Tasks"
                columnNames={["Time", "Tasks"]}
                data={scheduled}
            />
        </>
    );
};

export default Schedule;
