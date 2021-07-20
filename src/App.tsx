import React from "react";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import {
    createStyles,
    makeStyles,
    // useTheme,
    Theme,
} from "@material-ui/core/styles";
import AppsIcon from "@material-ui/icons/Apps";
import AccountTreeIcon from "@material-ui/icons/AccountTree";
import DashboardIcon from "@material-ui/icons/Dashboard";
import ScheduleIcon from "@material-ui/icons/Schedule";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Dashboard from "./components/Dashboard";
// import Execute from "./components/ExecuteModal";
import History from "./components/HistoryModal";
import Log from "./components/LogModal";
import Schedule from "./components/Schedule";
import Tasks from "./components/Tasks";
import Workflow from "./components/Workflow";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import SvgIcon from "@material-ui/core/SvgIcon";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: "flex",
        },
        appbar: {
            backgroundColor: "transparent",
            color: "black",
            boxShadow: theme.shadows[0],
            marginLeft: theme.spacing(7),
        },
        drawer: {
            width: theme.spacing(7),
            border: "none",
        },
        toolbar: {
            ...theme.mixins.toolbar,
        },
    }),
);

const App: React.FunctionComponent = () => {
    const classes = useStyles();
    // const theme = useTheme();

    const [title, setTitle] = React.useState("Dashboard");

    return (
        <Router>
            <AppBar position="static" className={classes.appbar}>
                <Toolbar>
                    <Typography>{title}</Typography>
                </Toolbar>
            </AppBar>
            <div style={{ display: "flex" }}>
                <Drawer
                    variant="permanent"
                    anchor="left"
                    className={classes.drawer}
                    classes={{ paper: classes.drawer }}
                >
                    <List>
                        <ListItem>
                            <ListItemIcon>
                                <SvgIcon viewBox={"2 2 28 28"}>
                                    <path d="M 15 4 C 14.447715 4 14 4.4477153 14 5 C 14 5.5522847 14.447715 6 15 6 C 15.010829 6 15.020504 6.0003417 15.03125 6 C 19.390254 6 21.466701 7.9064964 22.46875 8.75 L 22.75 9 L 23.125 9 C 23.831415 9 24.503715 9.2144522 25.03125 9.78125 C 25.104093 9.8595145 25.151964 9.9633888 25.21875 10.0625 C 25.143146 10.044226 25.081218 10 25 10 C 24.447715 10 24 10.447715 24 11 C 24 11.552285 24.447715 12 25 12 C 25.340341 12 25.631884 11.82224 25.8125 11.5625 C 25.871716 11.86543 25.913403 12.195572 25.9375 12.5625 C 25.8971 12.58038 25.89289 12.57471 25.84375 12.59375 C 25.378024 12.774174 24.488275 13 23 13 L 22 13 C 22 15.494129 21.104934 16.648408 20.25 17.3125 C 20.165483 17.378151 20.082746 17.413925 20 17.46875 C 19.881304 14.728034 17.5625 13.1875 17.5625 13.1875 L 16.4375 14.8125 C 16.4375 14.8125 18 15.970967 18 17.6875 C 18 19.460156 16.125 20.9375 16.125 20.9375 L 17.28125 22.5625 C 17.28125 22.5625 17.310428 22.532666 17.3125 22.53125 C 17.738716 22.567797 18.760744 23.085843 19.5625 23.9375 C 20.133885 24.544448 20.517868 25.263836 20.75 26 L 20 26 C 19.589916 26 19.422054 25.913984 19.21875 25.75 C 19.015446 25.586016 18.788563 25.294104 18.5 24.90625 C 17.922874 24.130543 16.889721 23 15.09375 23 C 14.898448 23 14.500064 22.91475 14.28125 22.78125 C 14.062436 22.64775 14 22.594777 14 22.3125 C 14 22.451793 14.081211 22.196566 14.375 21.625 C 14.668789 21.053434 15 20.193499 15 19 L 14 19 C 13.660338 19 12.461188 18.72548 11.5625 18.09375 C 10.663812 17.46202 10 16.590456 10 15.25 C 10 13.506084 10.624329 12.586179 11.59375 11.9375 C 12.563171 11.288821 13.964857 11 15.4375 11 C 17.201602 11 19.21875 11.90625 19.21875 11.90625 L 19.90625 12.25 L 20.40625 11.65625 L 21.78125 10.03125 L 20.21875 8.71875 L 19.3125 9.8125 C 18.553379 9.4979259 17.200947 9 15.4375 9 C 13.708143 9 11.924829 9.3069289 10.46875 10.28125 C 9.0463307 11.233048 8.0454393 12.890239 8 15.09375 C 7.845681 15.040108 7.672589 15 7.5 15 C 6.6715729 15 6 15.671573 6 16.5 C 6 17.328427 6.6715729 18 7.5 18 C 7.9142136 18 8.2910534 17.833947 8.5625 17.5625 C 9.0145246 18.478693 9.676049 19.205458 10.40625 19.71875 C 11.141716 20.235743 11.892824 20.579721 12.59375 20.78125 C 12.379419 21.16099 12 21.523795 12 22.3125 C 12 23.297223 12.612814 24.11125 13.25 24.5 C 13.887186 24.88875 14.535052 25 15.09375 25 C 16.200779 25 16.367376 25.369457 16.90625 26.09375 C 17.175687 26.455896 17.474679 26.913984 17.96875 27.3125 C 18.462821 27.711016 19.182584 28 20 28 L 22 28 L 23 28 L 23 27 C 23 25.267673 22.123107 23.722314 21.03125 22.5625 C 20.377647 21.868217 19.651447 21.300037 18.875 20.9375 C 19.09556 20.631483 19.290364 20.290189 19.46875 19.90625 C 19.9709 19.752619 20.712721 19.462264 21.46875 18.875 C 22.442301 18.11877 23.379314 16.858579 23.78125 14.96875 C 25.031008 14.90495 25.946693 14.707316 26.5625 14.46875 C 26.933012 14.325212 27.181195 14.1649 27.375 14.03125 C 27.568805 13.8976 27.75 13.71875 27.75 13.71875 L 28 13.4375 L 28 13.0625 C 28 10.982921 27.443715 9.4514522 26.5 8.4375 C 25.666535 7.5420031 24.570334 7.1806246 23.53125 7.09375 C 22.484082 6.2141388 19.802505 4 15.03125 4 C 15.020504 3.9996583 15.010829 4 15 4 z M 4 8 L 4 10 L 8.46875 10 C 9.34275 9.098 10.5 8.42 11.875 8 L 4 8 z M 4 12 L 4 14 L 6.59375 14 C 6.69375 13.283 6.86 12.612 7.125 12 L 4 12 z" />
                                </SvgIcon>
                            </ListItemIcon>
                        </ListItem>
                        <ListItem
                            button
                            component={Link}
                            to="/"
                            onClick={() => setTitle("Dashboard")}
                        >
                            <ListItemIcon>
                                <DashboardIcon />
                            </ListItemIcon>
                            <ListItemText>Dashboard</ListItemText>
                        </ListItem>
                        <ListItem
                            button
                            component={Link}
                            to="/tasks"
                            onClick={() => setTitle("Tasks")}
                        >
                            <ListItemIcon>
                                <AppsIcon />
                            </ListItemIcon>
                            <ListItemText>Tasks</ListItemText>
                        </ListItem>
                        <ListItem
                            button
                            component={Link}
                            to="/schedule"
                            onClick={() => setTitle("Schedule")}
                        >
                            <ListItemIcon>
                                <ScheduleIcon />
                            </ListItemIcon>
                            <ListItemText>Schedule</ListItemText>
                        </ListItem>
                        <ListItem button component={Link} to="/workflow">
                            <ListItemIcon>
                                <AccountTreeIcon />
                            </ListItemIcon>
                            <ListItemText>Workflow</ListItemText>
                        </ListItem>
                    </List>
                </Drawer>
                <Switch>
                    <>
                        <Container>
                            <Route exact path="/" component={Dashboard} />
                            <Route path="/tasks" component={Tasks} />
                            <Route path="/schedule" component={Schedule} />
                            <Route path="/history" component={History} />
                            <Route path="/log" component={Log} />
                            <Route
                                path="/workflow"
                                render={(props) => <Workflow /*{...props}*/ />}
                            />
                        </Container>
                    </>
                </Switch>
            </div>
        </Router>
    );
};

export default App;
