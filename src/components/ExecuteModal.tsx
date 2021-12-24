import React from "react";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import BaseModal from "./BaseModal";
import { Task } from "../types";

interface ExecuteModalProps {
    open: boolean;
    task: Task;
    onClose: () => void;
    onSubmit: (trigger: string, parameters: string[]) => void;
}

const ExecuteModal: React.FunctionComponent<ExecuteModalProps> = (
    props: ExecuteModalProps,
) => {
    const [trigger, setTrigger] = React.useState(
        (props.task.triggers ?? [""])[0],
    );
    const [parameters, setParameters] = React.useState<string[]>([]);

    React.useEffect(() => {
        if (props.task.triggers) setTrigger(props.task.triggers[0]);
    }, [props.task.triggers]);

    const handleTriggerChange = (
        event: React.ChangeEvent<{ value: unknown }>,
    ) => {
        setTrigger(event.target.value as string);
    };

    const handleParameterChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const value = event.target.value.replace(/\s/gm, " ");
        setParameters(value.split(" "));
    };

    const buttons = (
        <>
            <Button onClick={() => props.onSubmit(trigger, parameters)}>
                Execute
            </Button>
            <Button onClick={props.onClose}>Cancel</Button>
        </>
    );

    const menuItems = (props.task.triggers ?? []).map((item) => {
        return (
            <MenuItem key={item} value={item}>
                {item}
            </MenuItem>
        );
    });

    return (
        <BaseModal
            open={props.open}
            title={props.task.name}
            buttons={buttons}
            onClose={props.onClose}
        >
            <Grid
                container
                direction="column"
                justifyContent="flex-start"
                alignItems="stretch"
                spacing={2}
            >
                <Grid item>
                    <FormControl variant="filled" fullWidth={true}>
                        <InputLabel id="trigger-select-label">
                            Trigger
                        </InputLabel>
                        <Select
                            labelId="trigger-select-label"
                            id="trigger-select"
                            value={trigger}
                            onChange={handleTriggerChange}
                        >
                            {menuItems}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item>
                    <TextField
                        id="filled-textarea"
                        label="Parameters"
                        multiline
                        variant="filled"
                        fullWidth={true}
                        onChange={handleParameterChange}
                    />
                </Grid>
            </Grid>
        </BaseModal>
    );
};

export default ExecuteModal;
