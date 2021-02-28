import React from "react";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { API } from "../constants";

interface StatusCardProps {
    title: string;
    status: "start" | "success" | "fail" | "replay" | "notrun";
}

const StatusCard: React.FunctionComponent<StatusCardProps> = (
    props: StatusCardProps,
) => {
    const [taskCount, setTaskCount] = React.useState(0);

    React.useEffect(() => {
        async function fetchTasksToday(): Promise<void> {
            const url = new URL(`${API}/tasks/today/${props.status}`);
            const response = await fetch(url.toString());

            if (!response.ok) console.log(`Error: ${response.status}`);
            const jsonResult = await response.json();
            setTaskCount(jsonResult["data"].length);
        }

        fetchTasksToday();
    }, [props.status]);

    return (
        <Card>
            <CardContent>
                <Typography>{props.title}</Typography>
                <Typography>{taskCount}</Typography>
            </CardContent>
        </Card>
    );
};

const Stats: React.FunctionComponent = () => {
    return (
        <Grid container justify="center" spacing={2}>
            <Grid item xs={2}>
                <StatusCard title="Executed" status="start" />
            </Grid>
            <Grid item xs={2}>
                <StatusCard title="Successful" status="success" />
            </Grid>
            <Grid item xs={2}>
                <StatusCard title="Failed" status="fail" />
            </Grid>
            <Grid item xs={2}>
                <StatusCard title="Replayed" status="replay" />
            </Grid>
            <Grid item xs={2}>
                <StatusCard title="Not Run" status="notrun" />
            </Grid>
        </Grid>
    );
};

export default Stats;
