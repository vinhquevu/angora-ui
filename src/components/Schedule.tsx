import React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { API } from "../constants";
import { Task } from "../types";

const Schedule: React.FunctionComponent = () => {
    const [scheduled, setScheduled] = React.useState([]);
    const [repeating, setRepeating] = React.useState([]);

    const fetchScheduled = async (): Promise<void> => {
        const url = `${API}/tasks/scheduled`;
        const response = await fetch(url);

        if (response.ok) {
            const jsonResult = await response.json();
            setScheduled(jsonResult["data"]);
        } else {
            console.log(`Error: ${response.status}`);
            console.log("An error occurred while querying scheduled tasks");
            console.log(url);
        }
    };

    const fetchRepeating = async (): Promise<void> => {
        const url = `${API}/tasks/repeating`;
        const response = await fetch(url);

        if (response.ok) {
            const jsonResult = await response.json();
            setRepeating(jsonResult["data"]);
        } else {
            console.log(`Error: ${response.status}`);
            console.log("An error occurred while querying repeating tasks");
            console.log(url);
        }
    };

    React.useEffect(() => {
        fetchScheduled();
        fetchRepeating();
    }, []);

    const scheduledRows = Object.entries(scheduled).map(([time, tasks]) => {
        const taskNames = Object.values(tasks)
            .map((task) => {
                return (task as Task).name;
            })
            .join(" ");

        return (
            <TableRow key={`time_row_${time}`}>
                <TableCell>{time}</TableCell>
                <TableCell>{taskNames}</TableCell>
            </TableRow>
        );
    });

    const repeatingRows = Object.entries(repeating).map(([time, tasks]) => {
        const taskNames = Object.values(tasks)
            .map((task) => {
                return (task as Task).name;
            })
            .join(" ");

        return (
            <TableRow key={`time_row_${time}`}>
                <TableCell>{time}</TableCell>
                <TableCell>{taskNames}</TableCell>
            </TableRow>
        );
    });

    return (
        <>
            Repeating Tasks
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Interval (Minutes)</TableCell>
                            <TableCell>Tasks</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>{repeatingRows}</TableBody>
                </Table>
            </TableContainer>
            Scheduled Tasks
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Time</TableCell>
                            <TableCell>Tasks</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>{scheduledRows}</TableBody>
                </Table>
            </TableContainer>
        </>
    );
};

export default Schedule;
