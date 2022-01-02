import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

const styles = {
  modal: {
    position: "absolute",
    display: "flex",
    borderRadius: "10px",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    height:"80%",
    boxShadow: 24,
    background: "rgba(0,0,0,0.6)",
    p: 4,
  },
};

export default function EasyModal({ open, handleClose, children }) {
  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={styles.modal}>{children}</Box>
      </Modal>
    </div>
  );
}
