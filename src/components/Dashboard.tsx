import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { API } from "../constants";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            borderLeftColor: "black",
            borderLeftStyle: "solid",
            borderLeftWidth: 8,
        },
        notrun: {
            borderLeftColor: theme.palette.grey[500],
            borderLeftStyle: "solid",
            borderLeftWidth: 8,
        },
        executed: {
            borderLeftColor: theme.palette.primary.main,
            borderLeftStyle: "solid",
            borderLeftWidth: 8,
        },
        success: {
            borderLeftColor: theme.palette.success.main,
            borderLeftStyle: "solid",
            borderLeftWidth: 8,
        },
        failed: {
            borderLeftColor: theme.palette.error.main,
            borderLeftStyle: "solid",
            borderLeftWidth: 8,
        },
        replayed: {
            borderLeftColor: theme.palette.warning.main,
            borderLeftStyle: "solid",
            borderLeftWidth: 8,
        },
    }),
);

interface StatusCardProps {
    title: string;
    status: "start" | "success" | "fail" | "replay" | "notrun";
    class?: "executed" | "success" | "failed" | "replayed" | "notrun" | "root";
}

const StatusCard: React.FunctionComponent<StatusCardProps> = (
    props: StatusCardProps,
) => {
    const classes = useStyles();
    const [taskCount, setTaskCount] = React.useState(0);
    const [className, setClassName] = React.useState<string>();

    const fetchTasksToday = React.useCallback(async (): Promise<void> => {
        const url = new URL(`${API}/tasks/today/${props.status}`);
        const response = await fetch(url.toString());

        if (response.ok) {
            const jsonResult = await response.json();
            setTaskCount(jsonResult["data"].length);
        } else {
            console.error(`Error: ${response.status}`);
            console.error(url.toString());
            alert("An error occurred while querying the task data");
        }
    }, [props.status]);

    React.useEffect(() => {
        fetchTasksToday();

        if (props.class !== undefined) setClassName(classes[props.class]);
    }, [fetchTasksToday, props.class, classes]);

    return (
        <Card className={className}>
            <CardContent>
                <Typography>{props.title}</Typography>
                <Typography>{taskCount}</Typography>
            </CardContent>
        </Card>
    );
};

const Dashboard: React.FunctionComponent = () => {
    return (
        <Grid container spacing={1}>
            <Grid item xs={2}>
                <StatusCard title="Executed" status="start" class="executed" />
            </Grid>
            <Grid item xs={2}>
                <StatusCard
                    title="Successful"
                    status="success"
                    class="success"
                />
            </Grid>
            <Grid item xs={2}>
                <StatusCard title="Failed" status="fail" class="failed" />
            </Grid>
            <Grid item xs={2}>
                <StatusCard title="Replayed" status="replay" class="replayed" />
            </Grid>
            <Grid item xs={2}>
                <StatusCard title="Not Run" status="notrun" class="notrun" />
            </Grid>
            <Grid item xs={2}>
                <StatusCard title="Task Count" status="notrun" class="root" />
            </Grid>
        </Grid>
    );
};

export default Dashboard;
