import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { API } from "../constants";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: { fontVariant: "small-caps" },
        notrun: {
            backgroundColor: theme.palette.grey[600],
            color: theme.palette.getContrastText(theme.palette.grey[600]),
            fontVariant: "small-caps",
        },
        executed: {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            fontVariant: "small-caps",
        },
        success: {
            backgroundColor: theme.palette.success.main,
            color: theme.palette.success.contrastText,
            fontVariant: "small-caps",
        },
        failed: {
            backgroundColor: theme.palette.error.main,
            color: theme.palette.error.contrastText,
            fontVariant: "small-caps",
        },
        replayed: {
            backgroundColor: theme.palette.warning.main,
            color: theme.palette.warning.contrastText,
            fontVariant: "small-caps",
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
    const [className, setClassName] = React.useState<string | undefined>(
        undefined,
    );

    const fetchTasksToday = React.useCallback(async (): Promise<void> => {
        const url = new URL(`${API}/tasks/today/${props.status}`);
        const response = await fetch(url.toString());

        if (!response.ok) console.log(`Error: ${response.status}`);
        const jsonResult = await response.json();
        setTaskCount(jsonResult["data"].length);
    }, [props.status]);

    React.useEffect(() => {
        fetchTasksToday();

        if (props.class !== undefined) setClassName(classes[props.class]);
    }, [fetchTasksToday, props.class, classes]);

    return (
        <Card className={className}>
            <CardContent>
                <Typography variant="h2">{taskCount}</Typography>
                <Typography variant="h6">{props.title}</Typography>
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
