import { useContext } from 'react'
import AuthContext from '../auth'
import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Alert from '@mui/material/Alert';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};


export default function WarningModal() {
    const { auth } = useContext(AuthContext);
    console.log(auth.error)
    let modalClass = "modal is-visible";
    const handleClose = (event) => {
        event.preventDefault();
        auth.setError(null)
    };
    return (
        <Modal
  onClose={handleClose}
  aria-labelledby="modal-modal-title"
  aria-describedby="modal-modal-description"
  className = {modalClass}
  open = {auth.error !== null}
>
  <Box sx={style}>
    <Alert severity="warning">{auth.error}</Alert>
    <div className = "center">
    <input type="button"  className="modal-button" onClick={handleClose} value='Close' />
    </div>
  </Box>
</Modal>
    );
}