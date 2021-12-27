import React from "react";
import clsx from "clsx";
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
    NodeProps,
    Handle,
    FlowElement,
} from "react-flow-renderer";
import { useLocation } from "react-router-dom";
import { TaskControl } from "./Task";
import { API } from "../constants";
import { Task } from "../types";

import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        base: {
            padding: theme.spacing(1),
            borderRadius: theme.shape.borderRadius,
            minWidth: "150px",
            width: "auto",
            fontSize: theme.typography.fontSize,
            fontFamily: theme.typography.fontFamily,
            cursor: "pointer",
        },
        success: {
            backgroundColor: theme.palette.success.main,
        },
        start: {
            backgroundColor: theme.palette.primary.main,
        },
        fail: {
            backgroundColor: theme.palette.error.main,
        },
        root: {
            borderWidth: 2,
            borderColor: theme.palette.primary.dark,
            fontWeight: theme.typography.fontWeightBold,
        },
    }),
);

interface ComboBoxProps {
    value: string;
    onChange: (value: string) => void;
}

const ComboBox: React.FunctionComponent<ComboBoxProps> = (
    props: ComboBoxProps,
) => {
    const [tasks, setTasks] = React.useState([]);

    const fetchTasks = React.useCallback(async (): Promise<void> => {
        const url = new URL(`${API}/tasks`);
        const response = await fetch(url.toString());

        if (response.ok) {
            const body = await response.json();
            const taskNames = body.data.map((task: Task) => task.name);
            setTasks(taskNames.sort());
        } else {
            console.error(`Error: ${response.status}`);
            console.error(url.toString());
            alert("An error occurred while querying the tasks");
        }
    }, []);

    React.useEffect(() => {
        fetchTasks();
    }, [fetchTasks, props.value]);

    return (
        <Autocomplete
            id="combo-box-tasks"
            options={tasks}
            style={{ width: 300 }}
            onChange={(event, value, reason) => {
                if (value !== null) props.onChange(value);
            }}
            value={props.value}
            renderInput={(params) => (
                <TextField {...params} label="Task" variant="outlined" />
            )}
        />
    );
};

interface TaskData {
    status: string;
    time_stamp: string;
    children: string[];
    parents: string[];
}

interface stateType {
    taskName: string;
}

const CustomNode = ({
    data,
    isConnectable,
    targetPosition = Position.Top,
    sourcePosition = Position.Bottom,
}: NodeProps) => (
    <>
        <div>{data.label}</div>
        <div>{data.time_stamp}</div>
        <Handle
            type="target"
            position={targetPosition}
            isConnectable={isConnectable}
        />
        <Handle
            type="source"
            position={sourcePosition}
            isConnectable={isConnectable}
        />
    </>
);

const Workflow: React.FunctionComponent = () => {
    const classes = useStyles();
    const theme = useTheme();
    const { state } = useLocation<stateType>();

    const [root, setRoot] = React.useState(state?.taskName ?? "");
    const [family, setFamily] = React.useState<Elements>([]);
    // const [children, setChildren] = React.useState<Elements>([]);
    // const [parents, setParents] = React.useState<Elements>([]);
    const [task, setTask] = React.useState<Task>({} as Task);
    const [showTaskControl, setShowTaskControl] = React.useState(false);

    const parseTaskData = React.useCallback(
        (data: { [key: string]: TaskData }): Elements => {
            // flatMap is like calling map() and then calling flat(). Use
            // flatMap to flatten retval, which is an array, so that you have a
            // 1 dimenstional array instead of an array of arrays.  This just
            // how react-flow works.
            return Object.entries(data).flatMap(([key, value]) => {
                const retval: Elements = [];

                // Node
                retval.push({
                    id: key,
                    data: {
                        label: key,
                        status: value.status,
                        time_stamp: value.time_stamp,
                    },
                    position: { x: 0, y: 0 },
                    className: clsx(classes.base, {
                        [classes.success]: value.status === "success",
                        [classes.fail]: value.status === "fail",
                        [classes.start]: value.status === "start",
                        [classes.root]: key === root,
                    }),
                });

                // Edges (children)
                if (value.children !== undefined) {
                    retval.push(
                        ...value.children.map((current) => {
                            return {
                                id: `edge_${key}_${current}`,
                                source: key,
                                target: current,
                            };
                        }),
                    );
                }

                // Edges (parents)
                if (value.parents !== undefined) {
                    retval.push(
                        ...value.parents.map((current) => {
                            return {
                                id: `edge_${current}_${key}`,
                                source: current,
                                target: key,
                            };
                        }),
                    );
                }

                return retval;
            });
        },
        [classes, root],
    );

    const getLaidOutElements = (elements: Elements, rankdir?: string) => {
        const dagreGraph = new dagre.graphlib.Graph();
        dagreGraph.setDefaultEdgeLabel(() => ({}));
        dagreGraph.setGraph({
            rankdir: rankdir === undefined ? "LR" : rankdir,
        });

        elements.forEach((el) => {
            if (isNode(el)) {
                dagreGraph.setNode(el.id, { width: 200, height: 50 });
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

    const fetchTask = React.useCallback(
        async (taskName: string): Promise<void> => {
            const url = new URL(`${API}/tasks/lastruntime`);
            url.searchParams.append("name", taskName);

            const response = await fetch(url.toString());
            if (!response.ok) {
                console.error(response.status);
                console.error(url.toString());
                throw Error("Error fetching task data");
            }

            const body = await response.json();
            setTask(body.data[0]);
        },
        [],
    );

    const fetchFamily = React.useCallback(async (): Promise<void> => {
        if (root === "") return;

        const url = new URL(`${API}/task/family/lastruntime`);
        url.searchParams.append("name", root);
        const response = await fetch(url.toString());

        if (response.ok) {
            const jsonResult = await response.json();
            const temp = parseTaskData(jsonResult["data"]);
            setFamily(getLaidOutElements(temp));
        } else {
            console.error(`Error: ${response.status}`);
            console.error(
                "An error occurred while querying the task's workflow",
            );
            console.error(url.toString());
        }
    }, [root, parseTaskData]);

    // const fetchChildren = React.useCallback(async (): Promise<void> => {
    //     if (root === "") return;

    //     const url = new URL(`${API}/task/children/lastruntime`);
    //     url.searchParams.append("name", root);
    //     const response = await fetch(url.toString());

    //     if (response.ok) {
    //         const jsonResult = await response.json();
    //         const temp = parseTaskData(jsonResult["data"]);
    //         setChildren(getLaidOutElements(temp));
    //     } else {
    //         console.error(`Error: ${response.status}`);
    //         console.error(
    //             "An error occurred while querying the task's workflow",
    //         );
    //         console.error(url.toString());
    //     }
    // }, [root, parseTaskData]);

    // const fetchParents = React.useCallback(async (): Promise<void> => {
    //     if (root === "") return;

    //     const url = new URL(`${API}/task/parents`);
    //     url.searchParams.append("name", root);
    //     const response = await fetch(url.toString());

    //     if (response.ok) {
    //         const jsonResult = await response.json();
    //         const temp = parseTaskData(jsonResult["data"]);
    //         setParents(getLaidOutElements(temp, "RL"));
    //     } else {
    //         console.error(`Error: ${response.status}`);
    //         console.error(
    //             "An error occurred while querying the task's workflow",
    //         );
    //         console.error(url.toString());
    //     }
    // }, [root, parseTaskData]);

    React.useEffect(() => {
        if (root === "") return;

        fetchFamily();
        // fetchChildren();
        // fetchParents();
    }, [fetchFamily, root]);

    const handleElementClick = (
        event: React.MouseEvent,
        element: FlowElement,
    ): void => {
        fetchTask(element.id).then(() => setShowTaskControl(true));
    };

    return (
        <>
            <ComboBox onChange={(taskName) => setRoot(taskName)} value={root} />
            <Box
                style={{ height: "78vh", width: "100%" }}
                border={1}
                borderColor={theme.palette.divider}
                mt={1}
            >
                <ReactFlowProvider>
                    <ReactFlow
                        elements={family}
                        zoomOnScroll={false}
                        onElementClick={handleElementClick}
                        nodesDraggable={false}
                        nodeTypes={{
                            default: CustomNode,
                        }}
                    >
                        <Background />
                        <Controls />
                    </ReactFlow>
                </ReactFlowProvider>
            </Box>
            <TaskControl
                task={task}
                show={showTaskControl}
                onClose={() => setShowTaskControl(false)}
                onWorkflowClick={() => setRoot(task.name)}
            />
        </>
    );
};

export default Workflow;
