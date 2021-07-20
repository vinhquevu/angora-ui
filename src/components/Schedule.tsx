import React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { API } from "../constants";
import { Task } from "../types";
import { v4 as uuidv4 } from "uuid";
import TaskNode from "./Task";

interface StyledTableProps {
    title: string;
    columnNames: string[];
    data: (string | React.ReactElement[])[][];
}

const StyledTable: React.FunctionComponent<StyledTableProps> = (
    props: StyledTableProps,
) => {
    const tableHead: React.ReactElement = (
        <TableRow>
            {props.columnNames.map((columnName) => (
                <TableCell key={columnName}>{columnName}</TableCell>
            ))}
        </TableRow>
    );
    //             {/* {row.map((cell) => (
    //                 <TableCell key={uuidv4()}>{cell}</TableCell>
    //             ))} */}

    // return (
    //     <TableRow key={uuidv4()}>
    //         <TableCell>TEST</TableCell>
    //     </TableRow>
    // );

    console.log(props.data);
    Object.entries(props.data).map((row) => {
        console.log(row);
        // Object.entries(row).map(() => console.log(element));
    });

    return (
        <Box
            mb={1}
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
                    <TableHead>{tableHead}</TableHead>
                    {/* <TableBody>{tableBody}</TableBody> */}
                </Table>
            </TableContainer>
        </Box>
    );
};

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

    const repeatingRows = Object.entries(repeating).map(([time, tasks]) => {
        const taskNodes = Object.values(tasks).map((task) => {
            return <TaskNode key={(task as Task).name} task={task as Task} />;
        });

        return [time, taskNodes];
    });

    // console.log(repeatingRows);

    // const scheduledRows = Object.entries(scheduled).map(([time, tasks]) => {
    //     const taskNames = Object.values(tasks)
    //         .map((task) => {
    //             return (task as Task).name;
    //         })
    //         .join(", ");

    //     return [time, taskNames];
    // });

    return (
        <>
            <StyledTable
                title="Repeating Tasks"
                columnNames={["Interval (Minutes)", "Tasks"]}
                data={repeating}
            />
            {/* <StyledTable
                title="Scheduled Tasks"
                columnNames={["Time", "Tasks"]}
                data={scheduledRows}
            /> */}
        </>
    );
};

export default Schedule;
