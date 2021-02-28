import React from "react";
import { useLocation } from "react-router-dom";
import { API } from "../constants";

interface stateType {
    taskName: string;
    command: string;
    triggers: string[];
}

const Execute: React.FunctionComponent = () => {
    const { state } = useLocation<stateType>();

    return (
        <>
            {state.taskName}
            {state.command}
            {state.triggers}
        </>
    );
};

export default Execute;
