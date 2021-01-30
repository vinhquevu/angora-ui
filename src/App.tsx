import React from "react";
import Stats from "./Stats";
import Tasks from "./Tasks";
import Schedule from "./Schedule";

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
                    <Route exact path="/">
                        <Stats />
                    </Route>
                    <Route path="/tasks">
                        <Tasks />
                    </Route>
                    <Route path="/schedule">
                        <Schedule />
                    </Route>
                    <Route path="/workflow">
                        <div>Workflow</div>
                    </Route>
                </Switch>
            </div>
        </Router>
    );
};

export default App;
