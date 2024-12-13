import * as React from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import customFetch from "../../../../src/utils/customFetch";
import AudioPlayer from "../../../../src/utils/AudioPlayer";
import EnhancedTableHead from "../../../../src/utils/enhancedTable/EnhancedTableHead";
import EnhancedTableToolbar from "../../../../src/utils/enhancedTable/EnhancedTableToolbar";
import ModalAddVocabulary from "./tool/ModalAddVocabulary";

import FileInput from "../../../../src/utils/ReadExcelFile/FileInput";
import ReadExcel from "../../../../src/utils/ReadExcelFile/ReadExcel";

import { IoMdAdd } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import RepeatIcon from "@mui/icons-material/Repeat";
import "./styles.css";
import { useDispatch, useSelector } from "react-redux";
import { setVocabularies } from "../../../redux/slices/vocabularySlice";
import { useEffect } from "react";
// import { FaSearch } from "react-icons/fa";
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
  MenuItem,
  Select,
  Snackbar,
  TablePagination,
  TextField,
} from "@mui/material";
import { useState, useMemo } from "react";
import { useRef } from "react";
import ModalUpdateVocabulary from "./tool/ModalUpdateVocabulary";
import { use } from "react";

const VocabularyManagement = () => {
  const vocabularies = useSelector((state) => state.vocabularies);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [percent, setPercent] = useState(0);
  const [passImport, setPassImport] = useState(0);
  const [lack, setLack] = useState(0);
  const [duplicate, setDuplicate] = useState(0);
  const [loadingImport, setLoadingImport] = useState(false);
  const [disibleResult, setDisibleResult] = useState(true);

  const [selectedRow, setSelectedRow] = useState(null);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const [fillter, setFillter] = useState("All");

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const headCells = [
    { id: "id", numeric: true, disablePadding: true, label: "No." },
    { id: "word", numeric: false, disablePadding: false, label: "Word" },
    { id: "meaning", numeric: false, disablePadding: false, label: "Meaning" },
    {
      id: "pronunciation",
      numeric: false,
      disablePadding: false,
      label: "Pronunciation",
    },
    { id: "type", numeric: false, disablePadding: false, label: "Type" },
    { id: "image", numeric: false, disablePadding: false, label: "Image" },
    { id: "audio", numeric: false, disablePadding: false, label: "Audio" },
    { id: "action", numeric: false, disablePadding: false, label: "Action" },
  ];
  const rowRefs = useRef({});

  const [passList, setPassList] = useState([]);
  const [lackList, setLackList] = useState([]);
  const [duplicateList, setDuplicateList] = useState([]);

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleFileSelect = async (file) => {
    setLoadingImport(true);
    if (loadingImport) return;
    try {
      const data = await ReadExcel(file);
      console.log("Excel Data:", data);
      // duyệt qua từng dòng trong file excel
      setDisibleResult(false);
      setPassImport(0);
      setLack(0);
      setDuplicate(0);
      setPercent(0);
      setPassList([]);
      setLackList([]);
      setDuplicateList([]);

      const passTempList = [];
      const lackTempList = [];
      const duplicateTempList = [];

      for (let i = 0; i < data.length; i++) {
        setPercent(Math.ceil(((i + 1) / data.length) * 100));
        if (
          !data[i].word ||
          !data[i].meaning ||
          !data[i].pronunciation ||
          !data[i].type ||
          !data[i].audio
        ) {
          setLack((prev) => prev + 1);
          // Sai định dạng file
          if (
            !data[i].word &&
            !data[i].meaning &&
            !data[i].pronunciation &&
            !data[i].type &&
            !data[i].audio
          ) {
            lackTempList.push({
              line: i + 1,
              word: data[i],
              message: "File format error",
            });
          } else {
            lackTempList.push({
              line: i + 1,
              word: data[i],
              message: "Lack of information",
            });
          }
          continue;
        }

        const response = await customFetch.get(
          `/api/v1/vocabulary/find-word-fast/${data[i].word.trim()}`
        );
        if (response.data) {
          if (response.data.inDatabase) {
            setDuplicate((prev) => prev + 1);
            duplicateTempList.push({
              line: i + 1,
              word: data[i].word,
            });
            continue;
          } else {
            const res = await customFetch.post(
              "/api/v1/vocabulary/create-vocabulary",
              data[i]
            );
            if (res.data) {
              setPassImport((prev) => prev + 1);
              passTempList.push({
                line: i + 1,
                word: data[i],
              });
            }
          }
        }
      }
      setPassList(passTempList);
      setLackList(lackTempList);
      setDuplicateList(duplicateTempList);
      const fetchData = async () => {
        try {
          const response = await customFetch.get(
            "/api/v1/vocabulary/vocabularies"
          );
          dispatch(setVocabularies(response.data));
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
      setLoadingImport(false);
    } catch (error) {
      console.error("Error reading Excel file:", error);
    } finally {
      setLoadingImport(false);
    }
  };

  // const handleSearch = () => {
  //   const matchingRow = vocabularies.find((row) => row.word === searchTerm);
  //   if (matchingRow) {
  //     setSelected([matchingRow.id]);

  //     // Scroll the selected row into view
  //     if (rowRefs.current[matchingRow.id]) {
  //       rowRefs.current[matchingRow.id].scrollIntoView({
  //         behavior: "smooth",
  //         block: "center",
  //       });
  //     }
  //   } else {
  //     setSelected([]);
  //   }
  // };
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const handleSearch = () => {
    if (!searchTerm) {
      setSelected([]);
      return;
    }
    const matchingRowIndex = vocabularies.findIndex(
      (row) => row.word === searchTerm.toLowerCase() || row.meaning === searchTerm
    );

    if (matchingRowIndex !== -1) {
      const matchingRow = vocabularies[matchingRowIndex];
      setSelected([matchingRow.id]);
      const matchingPage = Math.floor(matchingRowIndex / rowsPerPage);
      setPage(matchingPage);

      // Scroll dòng được chọn vào giữa nếu tồn tại ref
      setTimeout(() => {
        rowRefs.current[matchingRow.id]?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 0);
    } else {
      setSelected([]);
      setSnackbarOpen(true); // Hiển thị Snackbar
    }
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleClick = (event, data) => {
    if (selected.includes(data.id)) {
      setSelected([]);
    } else {
      setSelected([data.id]);

      // Scroll to the selected row
      rowRefs.current[data.id]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }

    const selectedRow = vocabularies.find((row) => row.id === data.id);
    console.log("Dòng đã chọn:", selectedRow);
  };

  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) return -1;
    if (b[orderBy] > a[orderBy]) return 1;
    return 0;
  }

  function getComparator(order, orderBy) {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  // const visibleRows = useMemo(
  //   () =>
  //     [...vocabularies]
  //       .sort(getComparator(order, orderBy))
  //       .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
  //   [vocabularies, order, orderBy, page, rowsPerPage]
  // );
  const [pagecount, setPagecount] = useState();

  const visibleRows = useMemo(() => {
    const filteredVocabularies =
      fillter && fillter !== "All"
        ? vocabularies.filter((vocabulary) => vocabulary.type === fillter)
        : vocabularies;

    return [...filteredVocabularies]
      .sort(getComparator(order, orderBy))
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [vocabularies, order, orderBy, page, rowsPerPage, fillter]);

  useEffect(() => {
    if (fillter === "All") {
      setPagecount(vocabularies.length);
    } else {
      const filteredVocabularies =
      fillter && fillter !== "All"
        ? vocabularies.filter((vocabulary) => vocabulary.type === fillter)
        : vocabularies;
      setPagecount(filteredVocabularies.length);
      // setPage(0);
    }
  }, [visibleRows]);

  useEffect(() => {
    setPage(0);
  }, [fillter]);


  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await customFetch.get(
          "/api/v1/vocabulary/vocabularies"
        );
        dispatch(setVocabularies(response.data));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
        setHasFetched(true); // Mark that we've attempted to fetch data
      }
    };

    if (!vocabularies.length && !hasFetched) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [dispatch, vocabularies, hasFetched]);

  useEffect(() => {
    handleSearch();
  }, [searchTerm]);

  const [openModalAddVocabulary, setOpenModalAddVocabulary] = useState(false);

  const handleOpenModalAddVocabulary = () => setOpenModalAddVocabulary(true);
  const handleCloseModalAddVocabulary = () => setOpenModalAddVocabulary(false);

  const [openModalUpdateVocabulary, setOpenModalUpdateVocabulary] =
    useState(false);

  const handleOpenModalUpdateVocabulary = () =>
    setOpenModalUpdateVocabulary(true);
  const handleCloseModalUpdateVocabulary = () =>
    setOpenModalUpdateVocabulary(false);

  const [openA, setOpenA] = React.useState(false);
  const [messageA, setMessageA] = React.useState("");
  const [typeA, setTypeA] = React.useState("success");

  const handleCloseA = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenA(false);
  };

  const handleModalResultA = (success, message, type) => {
    setOpenModalAddVocabulary(false);

    setMessageA(message);
    setTypeA(type);
    setOpenA(true);
  };

  const handleCloseU = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenA(false);
  };

  const handleModalResultU = (success, message, type) => {
    setOpenModalUpdateVocabulary(false);

    setMessageA(message);
    setTypeA(type);
    setOpenA(true);
  };
  const [openD, setOpenD] = React.useState(false);

  const handleClickOpenD = () => {
    setOpenD(true);
  };

  const handleCloseD = () => {
    setOpenD(false);
  };
  const handleDeleteVoca = async (id) => {
    const voca = {
      vocabularyId: id,
    };
    console.log("ID:", voca);
    try {
      setLoading(true);
      const response = await customFetch.post(
        "/api/v1/vocabulary/delete-vocabulary",
        voca
      );
      if (response.status === 200) {
        const fetchData = async () => {
          const response = await customFetch.get(
            "/api/v1/vocabulary/vocabularies"
          );
          console.log("Data:", response.data);
          dispatch(setVocabularies(response.data));
        };
        fetchData();
        setMessageA("Word deleted successfully");
        setTypeA("success");
        setOpenA(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setOpenD(false);
    }
  };

  const ProgressInfo = ({ percent, passImport, lack, duplicate }) => {
    return (
      <div
        style={{
          padding: "15px",
          borderRadius: "8px",
          backgroundColor: "#f7f8fa",
          color: "#333",
          fontFamily: "Arial, sans-serif",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          gap: "10px",
          display: "flex",
          width: "100%",
        }}
      >
        <p
          style={{
            fontSize: "16px",
            marginBottom: "10px",
            color: "#555",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <span
            style={{
              fontWeight: "bold",
              fontSize: "18px",
              color: "#007bff",
            }}
          >
            Progress {percent}%
          </span>
        </p>
        <div style={{ display: "flex", gap: "15px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              color: "#4caf50",
              cursor: "pointer",
            }}
            onClick={handleClickOpen}
          >
            <CheckCircleIcon /> Success: {passImport}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              color: "#f44336",
              cursor: "pointer",
            }}
            onClick={handleClickOpen}
          >
            <ErrorIcon /> Error: {lack}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              color: "#ff9800",
              cursor: "pointer",
            }}
            onClick={handleClickOpen}
          >
            <RepeatIcon /> Duplicate: {duplicate}
          </div>
        </div>
      </div>
    );
  };
  const ProgressBar = ({ percent, passImport, lack, duplicate }) => {
    return (
      <div>
        {/* Display progress text */}
        <ProgressInfo
          percent={percent}
          passImport={passImport}
          lack={lack}
          duplicate={duplicate}
        />
        {/* Progress bar */}
        <div
          style={{
            height: "10px",
            width: "100%",
            backgroundColor: "#e0e0df",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${percent}%`,
              backgroundColor: percent === 100 ? "#4caf50" : "#3b82f6",
              transition: "width 0.5s ease-in-out",
            }}
          ></div>
        </div>
      </div>
    );
  };
  useEffect(() => {
    const interval = setInterval(() => {
      setPercent((prevPercent) => {
        if (prevPercent >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prevPercent + 10;
      });
      // setPassImport((prev) => prev + 1);
      // setLack((prev) => (percent >= 50 ? prev + 1 : prev));
      // setDuplicate((prev) => (percent >= 70 ? prev + 1 : prev));
    }, 500);
    return () => clearInterval(interval);
  }, [percent]);

  const handleDownload = async () => {
    const fileUrl =
      "https://english-for-kids.s3.ap-southeast-1.amazonaws.com/vocabulary-sample.xlsx";
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = "question-sample.xlsx";
    link.click();
  };
  return (
    <div className="ad-p-container">
      <div className="ad-p-content">
        <div className="ad-p-content-header">
          <TextField
            id="outlined-basic"
            label="Word or meaning"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              width: "200px",
            }}
          >
            {" "}
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Type</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={fillter}
                label="Type"
                onChange={(e) => setFillter(e.target.value)}
              >
                <MenuItem value={"All"}>All</MenuItem>
                <MenuItem value={"NOUN"}>NOUN</MenuItem>
                <MenuItem value={"VERB"}>VERB</MenuItem>
                <MenuItem value={"ADJECTIVE"}>ADJECTIVE</MenuItem>
                <MenuItem value={"ADVERB"}>ADVERB</MenuItem>
                <MenuItem value={"PRONOUN"}>PRONOUN</MenuItem>
                <MenuItem value={"PREPOSITION"}>PREPOSITION</MenuItem>
                <MenuItem value={"CONJUNCTION"}>CONJUNCTION</MenuItem>
                <MenuItem value={"INTERJECTION"}>INTERJECTION</MenuItem>
                <MenuItem value={"EXCLAMATION"}>EXCLAMATION</MenuItem>
              </Select>
            </FormControl>
          </div>
          {/* <button className="a-l-button">
            <FaSearch />
          </button> */}
          <div className="a-l-search">
            <div>
              {" "}
              <button
                className="a-l-button"
                onClick={handleOpenModalAddVocabulary}
              >
                <IoMdAdd />
                Add vocabulary
              </button>
            </div>

            <FileInput
              handleFileSelect={handleFileSelect}
              content={loadingImport ? "Loading..." : "Import vocabulary"}
            />

            <button className="btn-download-sample" onClick={handleDownload}>
              Download sample
            </button>
            <div
              style={{
                // width: "40%",
                marginBottom: "10px",
                display: "flex",
                gap: "10px",
                flexDirection: "column",
              }}
            >
              {!disibleResult && (
                <ProgressBar
                  percent={percent}
                  passImport={passImport}
                  lack={lack}
                  duplicate={duplicate}
                />
              )}
            </div>
          </div>
        </div>
        <div className="ad-p-content-body">
          {!loading ? (
            <div className="a-p-content-left">
              <Box sx={{ width: "100%" }}>
                <Paper sx={{ width: "100%", overflow: "hidden" }}>
                  <EnhancedTableToolbar titleLesson="Vocabulary management" />
                  <TableContainer sx={{ overflowY: "auto", height: 520 }}>
                    <Table stickyHeader aria-label="sticky table">
                      <EnhancedTableHead
                        headCells={headCells}
                        numSelected={selected.length}
                        order={order}
                        orderBy={orderBy}
                        onRequestSort={handleRequestSort}
                        rowCount={vocabularies.length}
                      />
                      <TableBody>
                        {visibleRows.map((row, index) => {
                          const isItemSelected = selected.includes(row.id);
                          const labelId = `enhanced-table-checkbox-${index}`;

                          return (
                            <TableRow
                              hover
                              onClick={(event) => handleClick(event, row)}
                              role="checkbox"
                              aria-checked={isItemSelected}
                              tabIndex={-1}
                              key={row.id}
                              selected={isItemSelected}
                              sx={{ cursor: "pointer" }}
                              // Assign ref to the row
                              ref={(el) => (rowRefs.current[row.id] = el)}
                            >
                              <TableCell
                                component="th"
                                id={labelId}
                                scope="row"
                                padding="none"
                                align="right"
                              >
                                {" "}
                                {index + 1}
                              </TableCell>
                              <TableCell align="left">{row.word}</TableCell>
                              <TableCell align="left">{row.meaning}</TableCell>
                              <TableCell align="left">
                                {row.pronunciation}
                              </TableCell>
                              <TableCell align="left">{row.type}</TableCell>
                              <TableCell align="left">
                                {row.image && (
                                  <img
                                    src={row.image}
                                    width={50}
                                    height={50}
                                    alt=""
                                  />
                                )}
                              </TableCell>
                              <TableCell align="left">
                                <AudioPlayer audioSrc={row.audio} />
                              </TableCell>
                              <TableCell align="left">
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                  }}
                                >
                                  <button
                                    className="a-l-button-action-update"
                                    onClick={() => {
                                      setSelectedRow(row);
                                      handleOpenModalUpdateVocabulary();
                                    }}
                                  >
                                    <MdEdit />
                                  </button>
                                  <button
                                    className="a-l-button-action-delete"
                                    onClick={() => {
                                      setSelectedRow(row);
                                      handleClickOpenD();
                                    }}
                                  >
                                    <MdDelete />
                                  </button>
                                  <Dialog
                                    open={openD}
                                    onClose={handleCloseD}
                                    aria-labelledby="alert-dialog-title"
                                    aria-describedby="alert-dialog-description"
                                    BackdropProps={{
                                      style: {
                                        background: "rgba(0, 0, 0, 0.1)", // Nền đen mờ
                                      },
                                    }}
                                  >
                                    <DialogTitle id="alert-dialog-title">
                                      {"Confirm delete this word?"}
                                    </DialogTitle>
                                    <DialogContent>
                                      <DialogContentText id="alert-dialog-description">
                                        Deleting this word cannot be undone.
                                      </DialogContentText>
                                    </DialogContent>
                                    <DialogActions>
                                      <Button
                                        onClick={() => {
                                          setSelectedRow(row);
                                          handleDeleteVoca(selectedRow.id);
                                        }}
                                      >
                                        Delete
                                      </Button>
                                      <Button onClick={handleCloseD}>
                                        Cancel
                                      </Button>
                                    </DialogActions>
                                  </Dialog>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <TablePagination
                    rowsPerPageOptions={[5]}
                    component="div"
                    count={pagecount}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                  />
                </Paper>
              </Box>
            </div>
          ) : (
            <div>Loading...</div>
          )}
        </div>
      </div>
      <ModalAddVocabulary
        open={openModalAddVocabulary}
        handleClose={handleModalResultA}
      />
      <ModalUpdateVocabulary
        open={openModalUpdateVocabulary}
        handleClose={handleModalResultU}
        rowData={selectedRow}
      />
      <Snackbar
        open={openA}
        autoHideDuration={6000}
        onClose={handleCloseA}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseA}
          severity={typeA}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {messageA}
        </Alert>
      </Snackbar>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={100}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        message="Word not found"
      />
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Word import result"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <div>
              {passList.length > 0 && (
                <div>
                  <h4 style={{ color: "#4caf50" }}>
                    Success: {passList.length}
                  </h4>
                  {passList.map((item, index) => (
                    <div key={index}>
                      <p>
                        Line {item.line}: {item.word.word}
                      </p>
                    </div>
                  ))}
                </div>
              )}
              {lackList.length > 0 && (
                <div>
                  <h4 style={{ color: "#f44336" }}>Error: {lackList.length}</h4>
                  {lackList.map((item, index) => (
                    <div key={index}>
                      <span
                        style={{
                          display: "flex",
                          flexDirection: "row",
                        }}
                      >
                        Line {item.line}: {item.word.word} :{" "}
                        <p
                          style={{
                            color: "#f44336",
                          }}
                        >
                          {" "}
                          {item.message}
                        </p>
                      </span>
                    </div>
                  ))}
                </div>
              )}
              {duplicateList.length > 0 && (
                <div>
                  <h4 style={{ color: "#ff9800" }}>
                    Duplicate: {duplicateList.length}
                  </h4>
                  {duplicateList.map((item, index) => (
                    <div key={index}>
                      <p>
                        Line {item.line}: {item.word}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default VocabularyManagement;
