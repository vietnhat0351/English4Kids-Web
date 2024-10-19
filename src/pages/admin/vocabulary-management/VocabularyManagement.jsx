import React, { useEffect, useState } from "react";
import "./styles.css";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import { visuallyHidden } from "@mui/utils";
import customFetch from "../../../utils/customFetch";
import { useDispatch, useSelector } from "react-redux";
import { setTopics } from "../../../redux/slices/topicSlice";

import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  Menu,
  MenuItem,
  Modal,
  Select,
  Snackbar,
  TextField,
} from "@mui/material";
import { MdCancel } from "react-icons/md";
import { FaCheckCircle } from "react-icons/fa";
import { FileUploader } from "react-drag-drop-files";
import { setTopicSelected } from "../../../redux/slices/topicSelected";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

const headCells = [
  {
    id: "id",
    numeric: true,
    disablePadding: false,
    label: "STT",
  },
  {
    id: "name",
    numeric: false,
    disablePadding: false,
    label: "Tên chủ đề",
  },
  {
    id: "quantity",
    numeric: true,
    disablePadding: false,
    label: "Số lượng từ",
  },
];

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {/* <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts",
            }}
          />
        </TableCell> */}
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
            style={{ fontWeight: "bold", padding: "10px" }}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
  const { numSelected } = props;

  const dispatch = useDispatch();
  const topic = useSelector((state) => state.topics);
  const topicSelected = useSelector((state) => state.topicSelected);

  const [open, setOpen] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);

  const [openSnack, setOpenSnack] = React.useState(false);
  const handleCloseSnack = () => setOpenSnack(false);
  const [snackMessage, setSnackMessage] = React.useState("");
  const [snackSeverity, setSnackSeverity] = React.useState("error");

  const fileTypes = ["JPG", "PNG", "GIF"];
  const [file, setFile] = useState(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleOpenUpdate = () => {
    if (topicSelected.topicId) {
      setOpenUpdate(true);
    }
  };
  const handleCloseUpdate = () => {
    console.log("close");

    setOpenUpdate(false);
  };

  const [topicName, setTopicName] = React.useState("");

  const handleChange = async (file) => {
    setFile(file);
    const url = await handleUploadImage();
    console.log("url", url);
    if (url) {
      dispatch(setTopicSelected({ ...topicSelected, image: url }));
    }
  };

  const handleUploadImage = async () => {
    // event.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await customFetch.post(
        `/api/v1/storage/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("File uploaded successfully!", response.data);
      return response.data;
    } catch (error) {
      console.error("There was an error uploading the file!", error);
      return null;
    }
  };

  const handleSaveTopic = async () => {
    const uploadedImage = await handleUploadImage();
    if (topicName === "" || uploadedImage === null) {
      setSnackMessage("Tên chủ đề không được để trống");
      setOpenSnack(true);
      setSnackSeverity("error");
    } else {
      setSnackSeverity("success");
      setSnackMessage("Chủ đề đã được lưu thành công!");
      setOpenSnack(true);
      // const data = {
      //   name: topicName,
      // };
      const data = {
        name: topicName,
        image: uploadedImage,
      };

      customFetch
        .post("/api/v1/vocabulary/create-topic", data)
        .then((response) => {
          console.log(response.data);
          if (response.status === 200) {
            // dispatch(setTopics(response.data));
            dispatch(setTopics([...topic, response.data]));
          } else {
            console.log("error");
          }
        });
      // Gửi dữ liệu lên server (ở đây chỉ giả lập)
      console.log("Lưu chủ đề:", data);
      handleClose(); // Đóng modal sau khi lưu thành công
    }
  };
  const handleUpdateTopic = async () => {
    if (topicSelected.name === "" || topicSelected.image === null) {
      setSnackMessage("Please fill all fields");
      setOpenSnack(true);
      setSnackSeverity("error");
    } else {
      setSnackSeverity("success");
      setSnackMessage("Topic updated successfully!");
      setOpenSnack(true);

      customFetch
        .post("/api/v1/vocabulary/update-topic", topicSelected)
        .then((response) => {
          console.log(response.data);
          if (response.status === 200) {
            // dispatch(setTopics(response.data));
            const newTopics = topic.map((item) => {
              if (item.topicId === topicSelected.topicId) {
                return response.data;
              }
              return item;
            });
            dispatch(setTopics(newTopics));
          } else {
            console.log("error");
          }
        });

      console.log("Lưu chủ đề:");
      handleClose(); 
    }
  };

  return (
    <>
      <Toolbar
        style={{ padding: "15px", backgroundColor: "white" }}
        sx={[
          {
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 },
          },
          numSelected > 0 && {
            bgcolor: (theme) =>
              alpha(
                theme.palette.primary.main,
                theme.palette.action.activatedOpacity
              ),
          },
        ]}
      >
        {/* {numSelected > 0 ? (
          <Typography
            sx={{ flex: "1 1 100%" }}
            color="inherit"
            variant="subtitle1"
            component="div"
          >
            {numSelected} selected
          </Typography>
        ) : ( */}
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
          bgcolor={"white"}
        >
          Danh sach chủ đề
          <div className="a-t-add-topic">
            <button className="a-t-add-button" onClick={handleOpen}>
              Thêm chủ đề
            </button>
            <button className="a-t-add-button" onClick={handleOpenUpdate}>
              Sửa chủ đề
            </button>
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 500,
                  bgcolor: "background.paper",
                  border: "2px solid #000",
                  borderRadius: 5,
                  boxShadow: 24,
                  p: 4,
                }}
              >
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  Thêm chủ đề mới
                </Typography>
                <Typography
                  id="modal-modal-description"
                  sx={{ mt: 2 }}
                  className="a-modal-add"
                >
                  <div>
                    <TextField
                      id="standard-basic"
                      label="Tên chủ đề"
                      variant="standard"
                      value={topicName}
                      onChange={(e) => setTopicName(e.target.value)}
                    />
                  </div>
                  <div className="a-modal-img">
                    {/* <button onClick={handleUploadImage}>
                        
                      </button> */}
                    <FileUploader
                      handleChange={handleChange}
                      name="file"
                      types={fileTypes}
                    />
                  </div>
                  <div className="a-modal-add-button-group">
                    <button
                      className="a-t-add-button"
                      onClick={handleSaveTopic}
                    >
                      <FaCheckCircle />
                      Lưu
                    </button>
                    <button className="a-t-add-button" onClick={handleClose}>
                      <MdCancel />
                      Thoát
                    </button>
                  </div>
                </Typography>
              </Box>
            </Modal>
            {/* <Modal*/}
            <Modal
              open={openUpdate}
              onClose={handleCloseUpdate}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 500,
                  bgcolor: "background.paper",
                  border: "2px solid #000",
                  borderRadius: 5,
                  boxShadow: 24,
                  p: 4,
                }}
              >
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  Topic Update
                </Typography>
                <Typography
                  id="modal-modal-description"
                  sx={{ mt: 2 }}
                  className="a-modal-add"
                >
                  <div>
                    <TextField
                      id="standard-basic"
                      label="Tên chủ đề"
                      variant="standard"
                      value={topicSelected.name}
                      onChange={(e) => {
                        dispatch(
                          setTopicSelected({
                            ...topicSelected,
                            name: e.target.value,
                          })
                        );
                      }}
                    />
                  </div>
                  <div className="a-modal-img">
                    {topicSelected.image && (
                      <img
                        src={topicSelected.image}
                        alt={topicSelected.name}
                        style={{ width: "50%" }}
                      />
                    )}
                    <FileUploader
                      handleChange={handleChange}
                      name="file"
                      types={fileTypes}
                    />
                  </div>
                  <div className="a-modal-add-button-group">
                    <button
                      className="a-t-add-button"
                      onClick={handleUpdateTopic}
                    >
                      <FaCheckCircle />
                      Lưu
                    </button>
                    <button
                      className="a-t-add-button"
                      onClick={handleCloseUpdate}
                    >
                      <MdCancel />
                      Thoát
                    </button>
                  </div>
                </Typography>
              </Box>
            </Modal>
          </div>
        </Typography>
        {/* )} */}
        {/* {numSelected > 0 ? (
          <Tooltip title="Delete">
            <IconButton>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Filter list">
            <IconButton>
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        )} */}
      </Toolbar>
      <Snackbar
        open={openSnack}
        autoHideDuration={6000}
        onClose={handleCloseSnack}
        // action={action}
      >
        <Alert
          onClose={handleClose}
          severity={snackSeverity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackMessage}
        </Alert>
      </Snackbar>
      ;
    </>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

//=======================================================
//=======================================================
//=======================================================
const headCellsV = [
  {
    id: "id",
    // numeric: true,
    disablePadding: false,
    label: "No.",
  },
  {
    id: "word",
    // numeric: false,
    disablePadding: false,
    label: "Word",
  },
  {
    id: "meaning",
    // numeric: false,
    disablePadding: false,
    label: "Meaning",
  },
  {
    id: "pronunciation",
    // numeric: false,
    disablePadding: false,
    label: "Pronunciation",
  },
  {
    id: "image",
    // numeric: false,
    disablePadding: false,
    label: "Image",
  },
  // {
  //   id: "audio",
  //   // numeric: false,
  //   disablePadding: false,
  //   label: "Âm thanh",
  // },
  {
    id: "type",
    // numeric: false,
    disablePadding: false,
    label: "Loại từ",
  },
  {
    id: "level",
    // numeric: false,
    disablePadding: false,
    label: "Cấp độ",
  },
];

function descendingComparatorV(a, b, orderByV) {
  if (b[orderByV] < a[orderByV]) {
    return -1;
  }
  if (b[orderByV] > a[orderByV]) {
    return 1;
  }
  return 0;
}
function getComparatorV(orderV, orderByV) {
  return orderV === "desc"
    ? (a, b) => descendingComparatorV(a, b, orderByV)
    : (a, b) => -descendingComparatorV(a, b, orderByV);
}

function EnhancedTableHeadV(props) {
  const {
    onSelectAllClickV,
    orderV,
    orderByV,
    numSelectedV,
    rowCountV,
    onRequestSortV,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSortV(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelectedV > 0 && numSelectedV < rowCountV}
            checked={rowCountV > 0 && numSelectedV === rowCountV}
            onChange={onSelectAllClickV}
            inputProps={{
              "aria-label": "select all desserts",
            }}
          />
        </TableCell>
        {headCellsV.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "left" : "right"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderByV === headCell.id ? orderV : false}
          >
            <TableSortLabel
              active={orderByV === headCell.id}
              direction={orderByV === headCell.id ? orderV : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderByV === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {orderV === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
EnhancedTableHeadV.propTypes = {
  numSelectedV: PropTypes.number.isRequired,
  onRequestSortV: PropTypes.func.isRequired,
  onSelectAllClickV: PropTypes.func.isRequired,
  orderV: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderByV: PropTypes.string.isRequired,
  rowCountV: PropTypes.number.isRequired,
};

function EnhancedTableToolbarV(props) {
  const { numSelectedV } = props;

  const dispatch = useDispatch();
  const topic = useSelector((state) => state.topics);
  const topicSelected = useSelector((state) => state.topicSelected);

  const [open, setOpen] = useState(false);

  const [openSnack, setOpenSnack] = React.useState(false);
  const handleCloseSnack = () => setOpenSnack(false);
  const [snackMessage, setSnackMessage] = React.useState("");
  const [snackSeverity, setSnackSeverity] = React.useState("error");

  const fileTypes = ["JPG", "PNG", "GIF"];
  const [file, setFile] = useState(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [word, setWord] = React.useState("");
  const [meaning, setMeaning] = React.useState("");
  const [pronunciation, setPronunciation] = React.useState("");
  const [image, setImage] = React.useState("");

  const [type, setType] = React.useState("");
  const [level, setLevel] = React.useState("");

  const handleChange = (file) => {
    setFile(file);
  };

  const handleUploadImage = async () => {
    // event.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await customFetch.post(
        `/api/v1/storage/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("File uploaded successfully!", response.data);
      return response.data;
    } catch (error) {
      console.error("There was an error uploading the file!", error);
      return null;
    }
  };

  const handleAddVocabulary = async () => {
    const uploadedImage = await handleUploadImage();
    if (
      word === "" ||
      uploadedImage === null ||
      meaning === "" ||
      pronunciation === "" ||
      type === "" ||
      level === ""
    ) {
      setSnackMessage("Please fill all fields");
      setOpenSnack(true);
      setSnackSeverity("error");
    } else {
      setSnackSeverity("success");
      setSnackMessage("Vocabulary saved successfully!");
      setOpenSnack(true);
      const data = {
        word: word,
        meaning: meaning,
        pronunciation: pronunciation,
        image: uploadedImage,
        audio: "",
        type: type,
        level: level,
        topic: {
          topicId: topicSelected.topicId,
        },
      };
      await customFetch.post("/api/v1/vocabulary/create-vocabulary", data).then(response => {
        console.log(response.data);
        if (response.status === 200) {
          console.log(response.data);
        } else {
          console.log("error");
        }
      });
      console.log("data", data);
      handleClose();
    }
  };
  return (
    <Toolbar
      sx={[
        {
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
        },
        numSelectedV > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        },
      ]}
    >
      {numSelectedV > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelectedV} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
          padding={"10px"}
        >
          Danh sách từ vựng
          <div className="a-v-button-group">
            <button className="a-t-add-button" onClick={handleOpen}>
              Thêm từ vựng
            </button>
            <button className="a-t-add-button">Sửa từ vựng</button>
            <button className="a-t-add-button">Xóa từ vựng</button>
          </div>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 500,
                bgcolor: "background.paper",
                border: "2px solid #000",
                borderRadius: 5,
                boxShadow: 24,
                p: 4,
              }}
            >
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Thêm từ vựng mới
              </Typography>
              <Typography
                id="modal-modal-description"
                sx={{ mt: 2 }}
                className="a-modal-add"
              >
                <div
                  style={{ display: "flex", flexDirection: "row", gap: "30px" }}
                >
                  <div>
                    <TextField
                      id="standard-basic"
                      label="Từ vựng"
                      variant="standard"
                      value={word}
                      onChange={(e) => setWord(e.target.value)}
                    />
                  </div>
                  <div>
                    <TextField
                      id="standard-basic"
                      label="Nghĩa"
                      variant="standard"
                      value={meaning}
                      onChange={(e) => setMeaning(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <TextField
                    id="standard-basic"
                    label="Phát âm"
                    variant="standard"
                    value={pronunciation}
                    onChange={(e) => setPronunciation(e.target.value)}
                  />
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: "30px",
                      paddingTop: "20px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        width: "50%",
                        gap: "10px",
                      }}
                    >
                      {/* <
                        id="standard-basic"
                        label="Loại từ"
                        variant="standard"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                      /> */}
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">
                          Loại từ
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={type}
                          label="Type"
                          onChange={(e) => setType(e.target.value)}
                        >
                          <MenuItem value={"NOUN"}>NOUN</MenuItem>
                          <MenuItem value={"VERB"}>VERB</MenuItem>
                          <MenuItem value={"ADJECTIVE"}>ADJECTIVE</MenuItem>
                          <MenuItem value={"ADVERB"}>ADVERB</MenuItem>
                          <MenuItem value={"PRONOUN"}>PRONOUN</MenuItem>
                          <MenuItem value={"PREPOSITION"}>PREPOSITION</MenuItem>
                          <MenuItem value={"CONJUNCTION"}>CONJUNCTION</MenuItem>
                          <MenuItem value={"INTERJECTION"}>
                            INTERJECTION
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        width: "50%",
                        gap: "10px",
                      }}
                    >
                      {/* <TextField
                        id="standard-basic"
                        label="Cấp độ"
                        variant="standard"
                        value={level}
                        onChange={(e) => setLevel(e.target.value)}
                      /> */}
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">
                          Level
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={level}
                          label="Level"
                          onChange={(e) => setLevel(e.target.value)}
                        >
                          <MenuItem value={"A1"}>A1</MenuItem>
                          <MenuItem value={"A2"}>A2</MenuItem>
                          <MenuItem value={"B1"}>B1</MenuItem>
                          <MenuItem value={"B2"}>B2</MenuItem>
                          <MenuItem value={"C1"}>C1</MenuItem>
                          <MenuItem value={"C2"}>C2</MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                  </div>
                </div>

                <div className="a-modal-img">
                  {/* <button onClick={handleUploadImage}>
                        
                      </button> */}
                  <FileUploader
                    handleChange={handleChange}
                    name="file"
                    types={fileTypes}
                  />
                </div>
                <div className="a-modal-add-button-group">
                  <button className="a-t-add-button" onClick={handleAddVocabulary}>
                    <FaCheckCircle />
                    Lưu
                  </button>
                  <button className="a-t-add-button" onClick={handleClose}>
                    <MdCancel />
                    Thoát
                  </button>
                </div>
              </Typography>
            </Box>
          </Modal>
          <Snackbar
            open={openSnack}
            autoHideDuration={5000}
            onClose={handleCloseSnack}
            // action={action}
          >
            <Alert
              onClose={handleClose}
              severity={snackSeverity}
              variant="filled"
              sx={{ width: "100%" }}
            >
              {snackMessage}
            </Alert>
          </Snackbar>
        </Typography>
      )}
      {numSelectedV > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

EnhancedTableToolbarV.propTypes = {
  numSelectedV: PropTypes.number.isRequired,
};

//=======================================================

const VocabularyManagement = () => {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  // const [topic, setTopic] = React.useState("");
  const dispatch = useDispatch();
  const topic = useSelector((state) => state.topics);
  const topicSelected = useSelector((state) => state.topicSelected);

  const [selectedTopic, setSelectedTopic] = useState({});

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTopicId, setSelectedTopicId] = useState(null);

  const handleClickOpen = (id) => {
    setSelectedTopicId(id);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const [rows, setRows] = React.useState([]);

  useEffect(() => {
    // call api to get data
    customFetch.get("/api/v1/vocabulary/all-topics").then((response) => {
      console.log(response.data);
      if (response.status === 200) {
        dispatch(setTopics(response.data));
        // setTopic(response.data);
      } else {
        console.log("error");
      }
    });
  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = topic.map((n) => n.topicId);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  // const handleClick = (event, id) => {
  //   const selectedIndex = selected.indexOf(id);
  //   let newSelected = [id];
  //   // if (selectedIndex === -1) {
  //   //   newSelected = newSelected.concat(selected, id);
  //   // } else if (selectedIndex === 0) {
  //   //   newSelected = newSelected.concat(selected.slice(1));
  //   // } else if (selectedIndex === selected.length - 1) {
  //   //   newSelected = newSelected.concat(selected.slice(0, -1));
  //   // } else if (selectedIndex > 0) {
  //   //   newSelected = newSelected.concat(
  //   //     selected.slice(0, selectedIndex),
  //   //     selected.slice(selectedIndex + 1)
  //   //   );
  //   // }
  //   setSelected(newSelected);
  //   console.log("click", newSelected, id);
  // };
  const handleClickRow = async (event, id) => {
    let newSelected = [id];
    setSelected(newSelected);

    console.log("click", newSelected, id);
    const findTopic = topic.find((item) => item.topicId === id);
    setSelectedTopic(findTopic);
    dispatch(setTopicSelected(findTopic));
    try {
      await customFetch
        .get(
          `/api/v1/vocabulary/get-vocabularies-by-topic?topicId=${findTopic.topicId}`
        )
        .then((res) => {
          console.log(res.data);
          setRows(res.data);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - topic.length) : 0;

  const visibleRows = React.useMemo(() => {
    return Array.isArray(topic)
      ? [...topic]
          .sort(getComparator(order, orderBy))
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      : [];
  }, [order, orderBy, page, rowsPerPage, topic]);

  const handleDeleteTopic = async (id) => {
    console.log("delete", id);
    await customFetch
      .post(`/api/v1/vocabulary/delete-topic?topicId=${id}`)
      .then((res) => {
        console.log(res.data);
        if (res.status === 200) {
          dispatch(setTopics(topic.filter((item) => item.topicId !== id)));
          setRows([]);
        }
      });
  };

  //=========================================
  //=========================================
  //=========================================

  const [orderV, setOrderV] = React.useState("asc");
  const [orderByV, setOrderByV] = React.useState("calories");
  const [selectedV, setSelectedV] = React.useState([]);
  const [pageV, setPageV] = React.useState(0);
  const [denseV, setDenseV] = React.useState(false);
  const [rowsPerPageV, setRowsPerPageV] = React.useState(10);

  const handleRequestSortV = (event, property) => {
    const isAsc = orderByV === property && orderV === "asc";
    setOrderV(isAsc ? "desc" : "asc");
    setOrderByV(property);
  };

  const handleSelectAllClickV = (event) => {
    if (event.target.checked) {
      const newSelectedV = rows.map((n) => n.id);
      setSelectedV(newSelectedV);
      return;
    }
    setSelectedV([]);
  };
  const handleClickV = (event, id) => {
    const selectedIndexV = selectedV.indexOf(id);
    let newSelectedV = [];

    if (selectedIndexV === -1) {
      newSelectedV = newSelectedV.concat(selectedV, id);
    } else if (selectedIndexV === 0) {
      newSelectedV = newSelectedV.concat(selectedV.slice(1));
    } else if (selectedIndexV === selectedV.length - 1) {
      newSelectedV = newSelectedV.concat(selectedV.slice(0, -1));
    } else if (selectedIndexV > 0) {
      newSelectedV = newSelectedV.concat(
        selectedV.slice(0, selectedIndexV),
        selectedV.slice(selectedIndexV + 1)
      );
    }
    setSelectedV(newSelectedV);
  };
  const handleChangePageV = (event, newPageV) => {
    setPageV(newPageV);
  };
  const handleChangeRowsPerPageV = (event) => {
    setRowsPerPageV(parseInt(event.target.value, 10));
    setPageV(0);
  };
  const emptyRowsV =
    pageV > 0 ? Math.max(0, (1 + pageV) * rowsPerPageV - rows.length) : 0;

  const visibleRowsV = React.useMemo(() => {
    return Array.isArray(rows)
      ? [...rows]
          .sort(getComparatorV(orderV, orderByV))
          .slice(pageV * rowsPerPageV, pageV * rowsPerPageV + rowsPerPageV)
      : [];
  }, [orderV, orderByV, pageV, rowsPerPageV, rows]);

  //================================================================================================
  //================================================================================================
  return (
    <div className="ad-p-container">
      <div className="ad-p-title">Quản lí từ vựng theo chủ đề</div>
      <div className="ad-p-content">
        <div className="ad-p-topic">
          <Box sx={{ width: "100%" }}>
            <Paper sx={{ width: "100%", mb: 2 }}>
              <EnhancedTableToolbar numSelected={selected.length} />
              <TableContainer>
                <Table
                  sx={{ minWidth: 500 }}
                  aria-labelledby="tableTitle"
                  size={dense ? "small" : "medium"}
                >
                  <EnhancedTableHead
                    numSelected={selected.length}
                    order={order}
                    orderBy={orderBy}
                    onSelectAllClick={handleSelectAllClick}
                    onRequestSort={handleRequestSort}
                    rowCount={topic.length}
                  />
                  <TableBody>
                    {visibleRows.map((row, index) => {
                      const isItemSelected = selected.includes(row.topicId);
                      const labelId = `enhanced-table-checkbox-${index}`;

                      return (
                        <TableRow
                          hover
                          onClick={(event) => {
                            setTopicSelected(row);
                            handleClickRow(event, row.topicId);
                          }}
                          // role="checkbox"
                          aria-checked={isItemSelected}
                          tabIndex={-1}
                          key={row.topicId}
                          selected={isItemSelected}
                          sx={{ cursor: "pointer" }}
                        >
                          {/* <TableCell padding="checkbox">
                            <Checkbox
                              color="primary"
                              checked={isItemSelected}
                              inputProps={{
                                "aria-labelledby": labelId,
                              }}
                              onClick={(event) =>
                                handleClick(event, row.topicId)
                              }
                            />
                          </TableCell> */}
                          <TableCell
                            component="th"
                            id={labelId}
                            scope="row"
                            padding="10px"
                          >
                            {row.topicId}
                          </TableCell>
                          <TableCell align="left">{row.name}</TableCell>
                          <TableCell align="left">{row.quantity}</TableCell>
                          <TableCell align="left">
                            <DeleteIcon
                              onClick={() => {
                                handleClickOpen(row.topicId);
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {emptyRows > 0 && (
                      <TableRow
                        style={{
                          height: (dense ? 33 : 53) * emptyRows,
                        }}
                      >
                        <TableCell colSpan={6} />
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                // aria-labelledby="alert-dialog-title"
                // aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">
                  {"Confirm Delete"}
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    Are you sure you want to delete this topic? This action
                    cannot be undone.
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseDialog} color="primary">
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      handleDeleteTopic(selectedTopicId);
                      handleCloseDialog();
                    }}
                    color="secondary"
                    autoFocus
                  >
                    Delete
                  </Button>
                </DialogActions>
              </Dialog>
              <TablePagination
                rowsPerPageOptions={[5, 10, 15]}
                component="div"
                count={topic.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          </Box>
        </div>
        <div className="ad-p-vocabulary">
          <Box sx={{ width: "100%" }}>
            <Paper sx={{ width: "100%", mb: 2 }}>
              <EnhancedTableToolbarV numSelectedV={selectedV.length} />
              <TableContainer>
                <Table
                  sx={{ minWidth: 750 }}
                  aria-labelledby="tableTitle"
                  size={dense ? "small" : "medium"}
                >
                  <EnhancedTableHeadV
                    numSelectedV={selectedV.length}
                    orderV={orderV}
                    orderByV={orderByV}
                    onSelectAllClickV={handleSelectAllClickV}
                    onRequestSortV={handleRequestSortV}
                    rowCountV={rows.length}
                  />
                  <TableBody>
                    {visibleRowsV.map((row, index) => {
                      const isItemSelected = selectedV.includes(row.id);
                      const labelId = `enhanced-table-checkbox-${index}`;

                      return (
                        <TableRow
                          hover
                          onClick={(event) => handleClickV(event, row.id)}
                          role="checkbox"
                          aria-checked={isItemSelected}
                          tabIndex={-1}
                          key={row.id}
                          selected={isItemSelected}
                          sx={{ cursor: "pointer" }}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              color="primary"
                              checked={isItemSelected}
                              inputProps={{
                                "aria-labelledby": labelId,
                              }}
                            />
                          </TableCell>
                          <TableCell
                            component="th"
                            id={labelId + 1}
                            scope="row"
                          >
                            {row.id + 1}
                          </TableCell>
                          <TableCell align="right">{row.word}</TableCell>
                          <TableCell align="right">{row.meaning}</TableCell>
                          <TableCell align="right">
                            {row.pronunciation}
                          </TableCell>
                          <TableCell align="right">
                            <img
                              src={row.image}
                              alt={row.word}
                              style={{ width: "50px", height: "50px" }}
                            />
                          </TableCell>
                          {/* <TableCell align="right">{row.audio}</TableCell> */}
                          <TableCell align="right">{row.type}</TableCell>
                          <TableCell align="right">{row.level}</TableCell>
                        </TableRow>
                      );
                    })}
                    {emptyRowsV > 0 && (
                      <TableRow
                        style={{
                          height: (denseV ? 33 : 53) * emptyRowsV,
                        }}
                      >
                        <TableCell colSpan={6} />
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[10]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPageV}
                page={pageV}
                onPageChange={handleChangePageV}
                onRowsPerPageChange={handleChangeRowsPerPageV}
              />
            </Paper>
          </Box>
        </div>
      </div>
    </div>
  );
};

export default VocabularyManagement;
