import React from "react";
import Execute from "./components/Execute";
import History from "./components/History";
import Log from "./components/Log";
import Schedule from "./components/Schedule";
import Stats from "./components/Stats";
import Tasks from "./components/Tasks";
import Workflow from "./components/Workflow";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

const App: React.FunctionComponent = () => {
    return (
        <Router>
            <div>
                <ul>
                    <li>
                        <Link to="/">Stats</Link>
                    </li>
                    <li>
                        <Link to="/tasks">Tasks</Link>
                    </li>
                    <li>
                        <Link to="/schedule">Schedule</Link>
                    </li>
                    <li>
                        <Link to="/workflow">Workflow</Link>
                    </li>
                </ul>

                <Switch>
                    <Route exact path="/" component={Stats} />
                    <Route path="/tasks" component={Tasks} />
                    <Route path="/schedule" component={Schedule} />
                    <Route path="/history" component={History} />
                    <Route path="/log" component={Log} />
                    <Route path="/execute" component={Execute} />
                    <Route
                        path="/workflow"
                        render={(props) => <Workflow /*{...props}*/ />}
                    />
                </Switch>
            </div>
        </Router>
    );
};

export default App;
