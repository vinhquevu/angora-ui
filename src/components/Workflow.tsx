import React from "react";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Box from "@material-ui/core/Box";
import {
    createStyles,
    makeStyles,
    useTheme,
    Theme,
} from "@material-ui/core/styles";
import dagre from "dagre";
import ReactFlow, {
    Background,
    Controls,
    Elements,
    Position,
    ReactFlowProvider,
    isNode,
} from "react-flow-renderer";
import { useLocation } from "react-router-dom";
import { API } from "../constants";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        base: {
            padding: theme.spacing(1),
            borderRadius: theme.shape.borderRadius,
            minWidth: "150px",
            width: "auto",
            fontSize: theme.typography.fontSize,
            fontFamily: theme.typography.fontFamily,
        },
    }),
);

interface stateType {
    taskName: string;
}

const Workflow: React.FunctionComponent = () => {
    const classes = useStyles();
    const theme = useTheme();
    const { state } = useLocation<stateType>();
    const [children, setChildren] = React.useState([] as Elements);
    const [parents, setParents] = React.useState([] as Elements);

    const parseTaskData = React.useCallback(
        (data: { [key: string]: Array<string> }): Elements => {
            console.log(data);
            return Object.entries(data).flatMap(([key, value]) => {
                const retval = [] as Elements;

                // Node
                retval.push({
                    id: key,
                    data: { label: key },
                    position: { x: 0, y: 0 },
                    className: classes.base,
                });

                // Edges
                retval.push(
                    ...value.map((current) => {
                        return {
                            id: `edge_${key}_${current}`,
                            source: key,
                            target: current,
                        };
                    }),
                );

                return retval;
            });
        },
        [classes.base],
    );

    const getLayoutedElements = (elements: Elements) => {
        const dagreGraph = new dagre.graphlib.Graph();
        dagreGraph.setDefaultEdgeLabel(() => ({}));
        dagreGraph.setGraph({ rankdir: "LR" });

        elements.forEach((el) => {
            if (isNode(el)) {
                dagreGraph.setNode(el.id, { width: 150, height: 50 });
            } else {
                dagreGraph.setEdge(el.source, el.target);
            }
        });

        dagre.layout(dagreGraph);

        return elements.map((el) => {
            if (isNode(el)) {
                const nodeWithPosition = dagreGraph.node(el.id);
                el.targetPosition = Position.Left;
                el.sourcePosition = Position.Right;

                // Unfortunately we need this little hack to pass a slighltiy
                // different position in order to notify react flow about the
                // change
                el.position = {
                    x: nodeWithPosition.x + Math.random() / 1000,
                    y: nodeWithPosition.y,
                };
            }
            return el;
        });
    };

    const fetchChildren = React.useCallback(async (): Promise<void> => {
        const url = new URL(`${API}/task/children`);
        url.searchParams.append("name", state.taskName);
        const response = await fetch(url.toString());

        if (response.ok) {
            const jsonResult = await response.json();
            const temp = parseTaskData(jsonResult["data"]);
            setChildren(getLayoutedElements(temp));
        } else {
            console.log(`Error: ${response.status}`);
            console.log("An error occurred while querying the task's workflow");
            console.log(url.toString());
        }
    }, [state.taskName, parseTaskData]);

    const fetchParents = React.useCallback(async (): Promise<void> => {
        const url = new URL(`${API}/task/parents`);
        url.searchParams.append("name", state.taskName);
        const response = await fetch(url.toString());

        if (response.ok) {
            const jsonResult = await response.json();
            const temp = parseTaskData(jsonResult["data"]);
            setParents(getLayoutedElements(temp));
        } else {
            console.log(`Error: ${response.status}`);
            console.log("An error occurred while querying the task's workflow");
            console.log(url.toString());
        }
    }, [state.taskName, parseTaskData]);

    React.useEffect(() => {
        fetchChildren();
        fetchParents();
    }, [fetchChildren, fetchParents]);

    return (
        <div style={{ width: "100%" }}>
            <Accordion square defaultExpanded={true}>
                <AccordionSummary>Children</AccordionSummary>
                <AccordionDetails>
                    <Box
                        style={{ height: "74vh", width: "100%" }}
                        border={1}
                        borderColor={theme.palette.divider}
                    >
                        <ReactFlowProvider>
                            <ReactFlow elements={children} zoomOnScroll={false}>
                                <Background />
                                <Controls />
                            </ReactFlow>
                        </ReactFlowProvider>
                    </Box>
                </AccordionDetails>
            </Accordion>
            <Accordion square>
                <AccordionSummary>Parents</AccordionSummary>
                <AccordionDetails>
                    <Box
                        style={{ height: "74vh", width: "100%" }}
                        border={1}
                        borderColor={theme.palette.divider}
                    >
                        <ReactFlowProvider>
                            <ReactFlow elements={parents} zoomOnScroll={false}>
                                <Background />
                                <Controls />
                            </ReactFlow>
                        </ReactFlowProvider>
                    </Box>
                </AccordionDetails>
            </Accordion>
        </div>
    );
};

export default Workflow;
