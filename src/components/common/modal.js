import React, { useState, useEffect } from 'react';
import Dialog from "@material-ui/core/Dialog";
import "./modal.css";
export default function Modal(props) {
    const [openDialog, setOpenDialog] = useState(false);
    useEffect(() => {
        setOpenDialog(props?.open);
    }, [props]);
    return (
        <Dialog
            open={props.open}
            onClose={props.onClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <div className="dialogBodyWrapper">
                <div className='dialogTitle'>{props.title}</div>
                <div className="dialogContent">{props.modalContent}</div>
                <div className="closeDialogs">
                    {props.button2Text && (
                        <button onClick={props.button2Fn} >
                            {props.button2Text}
                        </button>
                    )}
                    <button onClick={props.button1Fn}>
                        {props.button1Text}
                    </button>

                </div>
            </div>
        </Dialog>
    );

}