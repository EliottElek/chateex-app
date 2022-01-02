import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import "./drop.css";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { Button, Typography } from "@mui/material";
import { useDropzone } from "react-dropzone";
const DropFileInput = (props) => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      setFileList(
        acceptedFiles.map((file) =>
          Object.assign(file, { preview: URL.createObjectURL(file) })
        )
      );
      props.onFileChange(acceptedFiles);
    },
  });
  const wrapperRef = useRef(null);
  const [fileList, setFileList] = useState([]);
  const onDragEnter = () => wrapperRef.current.classList.add("dragover");
  const onDragLeave = () => wrapperRef.current.classList.remove("dragover");
  const onDrop = () => wrapperRef.current.classList.remove("dragover");
  const onFileDrop = (e) => {
    const newFile = e.target.files[0];
    if (newFile) {
      const previewedFile = Object.assign(newFile, {
        preview: URL.createObjectURL(newFile),
      });
      const updatedList = [...fileList, previewedFile];
      setFileList(updatedList);
      props.onFileChange(updatedList);
    }
  };

  const fileRemove = (file) => {
    const updatedList = [...fileList];
    updatedList.splice(fileList.indexOf(file), 1);
    setFileList(updatedList);
    props.onFileChange(updatedList);
  };

  return (
    <>
      {fileList.length === 0 && (
        <div
          ref={wrapperRef}
          className="drop-file-input"
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          {...getRootProps()}
        >
          <UploadFileIcon style={{ fontSize: "4rem" }} />

          <div className="drop-file-input__label">
            {props.avatar ? (
              <p>Drag & Drop your picture here</p>
            ) : (
              <p>Drag & Drop your pictures here</p>
            )}
          </div>
          <input
            {...getInputProps()}
            type="file"
            value=""
            onChange={onFileDrop}
          />
        </div>
      )}
      {fileList.length > 0 ? (
        <div className="drop-file-preview">
          <Typography align="center">Ready to upload ! </Typography>
          {fileList.map((item, index) => (
            <div key={index} className="drop-file-preview__item">
              <img src={item.preview} alt="" />
              {/* <div className="drop-file-preview__item__info">
                <p>{item.name}</p>
                <p>{item.size}B</p>
              </div> */}
              <span
                className="drop-file-preview__item__del"
                onClick={() => fileRemove(item)}
              >
                x
              </span>
            </div>
          ))}
          <Button
            onClick={() => {
              props.onFileSubmit();
              props.setOpenModal(false);
            }}
            variant="contained"
          >
            Upload !
          </Button>
        </div>
      ) : null}
    </>
  );
};

DropFileInput.propTypes = {
  onFileChange: PropTypes.func,
};

export default DropFileInput;
