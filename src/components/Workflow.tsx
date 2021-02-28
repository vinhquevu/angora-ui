import React from "react";
import Container from "@material-ui/core/Container";
import dagre from "dagre";
import ReactFlow, {
    isNode,
    Elements,
    Position,
    ReactFlowProvider,
} from "react-flow-renderer";
import { useLocation } from "react-router-dom";
import { API } from "../constants";

interface stateType {
    taskName: string;
}

const Workflow: React.FunctionComponent = () => {
    const [children, setChildren] = React.useState([] as Elements);
    const [parents, setParents] = React.useState([] as Elements);

    const { state } = useLocation<stateType>();

    const parseTaskData = (data: {
        [key: string]: Array<string>;
    }): Elements => {
        return Object.entries(data).flatMap(([key, value]) => {
            const retval = [] as Elements;

            // Node
            retval.push({
                id: key,
                data: { label: key },
                position: { x: 0, y: 0 },
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
    };

    const fetchChildren = React.useCallback(async (): Promise<void> => {
        const url = new URL(`${API}/task/children`);
        url.searchParams.append("name", state.taskName);
        const response = await fetch(url.toString());

        if (response.ok) {
            const jsonResult = await response.json();
            const temp = parseTaskData(jsonResult["data"]);
            setChildren(temp);
        } else {
            console.log(`Error: ${response.status}`);
            console.log("An error occurred while querying the task's workflow");
            console.log(url.toString());
        }
    }, [state.taskName]);

    const fetchParents = React.useCallback(async (): Promise<void> => {
        const url = new URL(`${API}/task/parents`);
        url.searchParams.append("name", state.taskName);
        const response = await fetch(url.toString());

        if (response.ok) {
            const jsonResult = await response.json();
            const temp = parseTaskData(jsonResult["data"]);
            setParents(temp);
        } else {
            console.log(`Error: ${response.status}`);
            console.log("An error occurred while querying the task's workflow");
            console.log(url.toString());
        }
    }, [state.taskName]);

    React.useEffect(() => {
        fetchChildren();
        fetchParents();
    }, [fetchChildren, fetchParents]);

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

    const layoutedChildren = getLayoutedElements(children);
    const layoutedParents = getLayoutedElements(parents);

    return (
        <>
            <Container style={{ height: 400 }}>
                <ReactFlowProvider>
                    <ReactFlow elements={layoutedChildren} />
                </ReactFlowProvider>
            </Container>
            <Container style={{ height: 400 }}>
                <ReactFlowProvider>
                    <ReactFlow elements={layoutedParents} />
                </ReactFlowProvider>
            </Container>
        </>
    );
};

export default Workflow;
