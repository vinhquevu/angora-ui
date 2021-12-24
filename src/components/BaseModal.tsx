import React from "react";
import CloseIcon from "@material-ui/icons/Close";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        backdrop: {
            backgroundColor: theme.palette.action.disabledBackground,
        },
        dialog: { minWidth: "500px" },
    }),
);

interface BaseModalProps {
    title: string;
    open: boolean;
    onClose: () => void;
    buttons?: React.ReactFragment;
    fullScreen?: boolean;
}

const BaseModal: React.FunctionComponent<
    React.PropsWithChildren<BaseModalProps>
> = (props: React.PropsWithChildren<BaseModalProps>) => {
    const classes = useStyles();

    return (
        <Dialog
            fullScreen={props.fullScreen}
            classes={{ paper: classes.dialog }}
            onClose={props.onClose}
            aria-labelledby="customized-dialog-title"
            open={props.open}
            BackdropProps={{
                classes: {
                    root: classes.backdrop,
                },
            }}
        >
            <DialogTitle>
                <Grid
                    container
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Grid item>{props.title}</Grid>
                    <Grid item>
                        <IconButton onClick={props.onClose}>
                            <CloseIcon />
                        </IconButton>
                    </Grid>
                </Grid>
            </DialogTitle>
            <DialogContent dividers>{props.children}</DialogContent>
            {props.buttons && <DialogActions>{props.buttons}</DialogActions>}
        </Dialog>
    );
};

BaseModal.defaultProps = {
    fullScreen: false,
};

export default BaseModal;
