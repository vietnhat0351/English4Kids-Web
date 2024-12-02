import {
  Alert,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
} from "@mui/material";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";

import "./styles.css";
import React, { useEffect, useMemo, useRef, useState } from "react";

import FileInput from "../../../../utils/ReadExcelFile/FileInput";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import { useDispatch, useSelector } from "react-redux";
import EnhancedTableToolbar from "../../../../utils/enhancedTable/EnhancedTableToolbar";
import EnhancedTableHead from "../../../../utils/enhancedTable/EnhancedTableHead";
import AudioPlayer from "../../../../utils/AudioPlayer";
import { useLocation } from "react-router-dom";
import customFetch from "../../../../utils/customFetch";
import { setLessonSelected } from "../../../../redux/slices/clessonSlice";
import ModalAddQuestion from "./tool/ModalAddQuestion";
import ReadExcel from "../../../../utils/ReadExcelFile/ReadExcel";
import ModalUpdateQuestion from "./tool/ModalUpdateQuestion";

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
          progress: {percent}%
        </span>
      </p>
      <div style={{ display: "flex", gap: "15px" }}>
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            color: "#4caf50",
          }}
        >
          <CheckCircleIcon /> success: {passImport}
        </span>
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            color: "#f44336",
          }}
        >
          <ErrorIcon /> fail: {lack}
        </span>
      </div>
    </div>
  );
};

const ProgressBar = ({ percent, passImport, lack }) => {
  return (
    <div
      style={{
        width: "60%",
        marginBottom: "10px",
        display: "flex",
        gap: "10px",
        flexDirection: "column",
      }}
    >
      {/* Display progress text */}
      <ProgressInfo percent={percent} passImport={passImport} lack={lack} />
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

const Question = () => {
  const lessonCurrent = useSelector(
    (state) => state.lessonSelected || { questions: [] }
  );
  const questions = lessonCurrent.questions || [];

  const rowRefs = useRef({});
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const location = useLocation();
  const lastUrl = location.pathname.split("/").pop();

  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await customFetch.get(`/api/v1/lessons/${lastUrl}`);
        console.log("response", response.data);
        dispatch(setLessonSelected(response.data));
        setHasFetched(true);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (!hasFetched) {
      fetchData();
    }
  }, [hasFetched, lastUrl, dispatch]);

  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);

  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [page, setPage] = React.useState(0);

  const [percent, setPercent] = useState(0);
  const [passImport, setPassImport] = useState(0);
  const [lack, setLack] = useState(0);

  const [loadingImport, setLoadingImport] = useState(false);
  const [disibleResult, setDisibleResult] = useState(true);

  const [deleteQuestion, setDeleteQuestion] = useState({});

  const [openModalAddQuestion, setOpenModalAddQuestion] = useState(false);

  const [fillter, setFillter] = useState("All");

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const [openA, setOpenA] = React.useState(false);
  const [messageA, setMessageA] = React.useState("");
  const [typeA, setTypeA] = React.useState("success");

  const handleCloseA = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenA(false);
  };

  // Callback để xử lý kết quả từ Modal
  const handleModalResultA = (success) => {
    setOpenModalAddQuestion(false); // Đóng modal
    if (!success) {
      setMessageA("Create question successfully");
      setTypeA("success");
    } else {
      setMessageA("Cancel");
      setTypeA("error");
    }
    setOpenA(true);
  };
  //=================================================================================================

  const [openModalUpdateQuestion, setOpenModalQuestion] = useState(false);

  // Callback để xử lý kết quả từ Modal
  const handleModalResultU = (success) => {
    setOpenModalQuestion(false); // Đóng modal
    if (!success) {
      setMessageA("Update question successfully");
      setTypeA("success");
    } else {
      setMessageA("Cancel");
      setTypeA("error");
    }
    setOpenA(true);
  };
  //=================================================================================================

  const headCells = [
    { id: "id", numeric: true, disablePadding: true, label: "No." },
    { id: "content", numeric: false, disablePadding: false, label: "Content" },
    { id: "image", numeric: false, disablePadding: false, label: "Image" },
    { id: "audio", numeric: false, disablePadding: false, label: "Audio" },
    {
      id: "type",
      numeric: false,
      disablePadding: false,
      label: "Type question",
    },
    { id: "answers", numeric: false, disablePadding: false, label: "Answers" },
    { id: "action", numeric: false, disablePadding: false, label: "Action" },
  ];

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const [question, setQuestion] = useState({});
  const handleClick = (event, data) => {
    setQuestion(data || {});
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

    const selectedRow = lessonCurrent.questions.find(
      (row) => row.id === data.id
    );
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
  //   () => [...lessonCurrent.questions].sort(getComparator(order, orderBy)),
  //   [lessonCurrent.questions, order, orderBy]
  // );
  // const visibleRows = useMemo(
  //   () => [...questions].sort(getComparator(order, orderBy))
  //   .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
  //   [questions, order, orderBy, page, rowsPerPage]
  // );

  const visibleRows = useMemo(() => {
    const filteredVocabularies =
      fillter && fillter !== "All"
        ? questions.filter((question) => question.type === fillter)
        : questions;

    return [...filteredVocabularies]
      .sort(getComparator(order, orderBy))
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [questions, order, orderBy, page, rowsPerPage, fillter]);

  const styles = {
    answer: {
      padding: "8px",
      margin: "5px 0",
      borderRadius: "5px",
      backgroundColor: "#f6f9ff",
    },
    correctAnswer: {
      backgroundColor: "#d1e7dd", // A light green to indicate correct answer
      fontWeight: "bold",
    },
    answerText: {
      color: "#333",
    },
  };
  // =================================================================================================

  const [state, setState] = React.useState({
    right: false,
  });

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, right: open });
  };

  const uniqueVocabularies = Array.isArray(lessonCurrent.vocabularies)
    ? lessonCurrent.vocabularies.filter(
        (voca, index, self) =>
          index === self.findIndex((t) => t.word === voca.word)
      )
    : [];
  const list = () => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      {uniqueVocabularies.map((voca, index) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "10px",
            padding: "10px",
            margin: "5px 0",
            borderRadius: "5px",
            backgroundColor: "#f6f9ff",
          }}
        >
          {/* <AudioPlayer audioSrc={voca.audio} /> */}
          {voca.word} : {voca.meaning}
        </div>
      ))}
    </Box>
  );

  // =================================================================================================
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
      setPercent(0);
      for (let i = 0; i < data.length; i++) {
        setPercent(((i + 1) / data.length) * 100);
        const res = await customFetch.get(
          `/api/v1/vocabulary/find-word-fast/${data[i].word.toLowerCase()}`
        );
        if (
          !data[i].contentQuestion ||
          !data[i].typeQuestion ||
          !res.data.inDatabase
        ) {
          setLack((prev) => prev + 1);
          continue;
        } else {
          if (
            data[i].typeQuestion === "WORD_MEANING" ||
            data[i].typeQuestion === "MEANING_WORD"
          ) {
            if (!data[i].answerContent) {
              setLack((prev) => prev + 1);
              console.log("Lỗi từ - nghĩa 1", data[i]);
              continue;
            } else {
              if (
                !data[i].wrongAnswerContent1 &&
                !data[i].wrongAnswerContent2 &&
                !data[i].wrongAnswerContent3
              ) {
                setLack((prev) => prev + 1);
                console.log("Lỗi từ - nghĩa 2", data[i]);
                continue;
              }
            }
          }
          if (data[i].typeQuestion === "WORD_SPELLING") {
            if (!data[i].answerAudio) {
              setLack((prev) => prev + 1);
              console.log("Lỗi từ - âm 1", data[i]);
              continue;
            } else {
              if (
                !data[i].wrongAnswerAudio1 &&
                !data[i].wrongAnswerAudio2 &&
                !data[i].wrongAnswerAudio3
              ) {
                setLack((prev) => prev + 1);
                console.log("Lỗi từ - âm 2", data[i]);
                continue;
              }
            }
          }
          if (data[i].typeQuestion === "SPELLING_WORD") {
            if (!data[i].audioQuestion) {
              setLack((prev) => prev + 1);
              console.log("Lỗi âm - từ 1", data[i]);
              continue;
            } else {
              if (!data[i].answerContent) {
                setLack((prev) => prev + 1);
                console.log("Lỗi âm - từ 2", data[i]);
                continue;
              } else {
                if (
                  !data[i].wrongAnswerContent1 &&
                  !data[i].wrongAnswerContent2 &&
                  !data[i].wrongAnswerContent3
                ) {
                  setLack((prev) => prev + 1);
                  console.log("Lỗi âm - từ 3", data[i]);
                  continue;
                }
              }
            }
          }
          if (data[i].typeQuestion === "WORD_ORDER") {
            if (data[i].contentQuestion.split(" ").length < 2) {
              setLack((prev) => prev + 1);
              console.log("Lỗi thiết từ", data[i]);
              continue;
            }
          }
          if (data[i].typeQuestion === "FILL_IN_FLANK") {
            if (!data[i].answerContent) {
              setLack((prev) => prev + 1);
              console.log("Lỗi thiếu từ 1", data[i]);
              continue;
            } else {
              if (
                !data[i].wrongAnswerContent1 &&
                !data[i].wrongAnswerContent2 &&
                !data[i].wrongAnswerContent3
              ) {
                setLack((prev) => prev + 1);
                console.log("Lỗi thiếu từ 2", data[i]);
                continue;
              }
            }
          }

          try {
            console.log("data[i]", data[i]);
            let dataQuestion = {
              content: data[i].contentQuestion,
              image: data[i].imageQuestion,
              audio: data[i].audioQuestion,
              type: data[i].typeQuestion,
              lesson: {
                id: lessonCurrent.id,
              },
              vocabulary: {
                id: res.data.id,
              },
            };
            let answers = [
              {
                content: data[i].answerContent,
                image: data[i].answerImage,
                audio: data[i].answerAudio,
                isCorrect: true,
              },
            ];
            if (
              data[i].wrongAnswerImage1 ||
              data[i].wrongAnswerContent1 ||
              data[i].wrongAnswerAudio1
            ) {
              answers.push({
                content: data[i].wrongAnswerContent1,
                image: data[i].wrongAnswerImage1,
                audio: data[i].wrongAnswerAudio1,
                isCorrect: false,
              });
            }
            if (
              data[i].wrongAnswerImage2 ||
              data[i].wrongAnswerContent2 ||
              data[i].wrongAnswerAudio2
            ) {
              answers.push({
                content: data[i].wrongAnswerContent2,
                image: data[i].wrongAnswerImage2,
                audio: data[i].wrongAnswerAudio2,
                isCorrect: false,
              });
            }
            if (
              data[i].wrongAnswerImage3 ||
              data[i].wrongAnswerContent3 ||
              data[i].wrongAnswerAudio3
            ) {
              answers.push({
                content: data[i].wrongAnswerContent3,
                image: data[i].wrongAnswerImage3,
                audio: data[i].wrongAnswerAudio3,
                isCorrect: false,
              });
            }
            setPassImport((prev) => prev + 1);
            dataQuestion = { ...dataQuestion, answers: answers };
            console.log("dataQuestion", dataQuestion);
            const response = await customFetch.post(
              "/api/v1/questions/create",
              dataQuestion
            );
            setMessageA("Import successfully");
            setTypeA("success");
            setOpenA(true);
          } catch (error) {
            console.error("Lỗi tìm từ", error);
          }
        }
      }
      // Gọi data từ API tất cả từ vựng và cập nhật lại state

      const lastUrl = location.pathname.split("/").pop();
      console.log("lastUrl", lastUrl);

      const fetchData = async () => {
        try {
          setLoading(true);
          const response = await customFetch.get(`/api/v1/lessons/${lastUrl}`);
          console.log("response", response.data);
          dispatch(setLessonSelected(response.data));
          // setLessonCurrent(response.data || { questions: [] });
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

  const [openD, setOpenD] = React.useState(false);

  const handleClickOpenD = () => {
    setOpenD(true);
  };

  const handleCloseD = () => {
    setOpenD(false);
  };
  const handleDeleteQuestion = async (row) => {
    const deleteQ = {
      questionId: row.id,
      vocabularyId: row.vocabulary.id,
      lessonId: lessonCurrent.id,
    };
    console.log("deleteQ", deleteQ);
    try {
      const response = await customFetch.post(
        "/api/v1/questions/delete",
        deleteQ
      );
      console.log("response", response.data);
      const lastUrl = location.pathname.split("/").pop();
      console.log("lastUrl", lastUrl);

      const fetchData = async () => {
        try {
          setLoading(true);
          const response = await customFetch.get(`/api/v1/lessons/${lastUrl}`);
          console.log("response", response.data);
          dispatch(setLessonSelected(response.data));
          // setLessonCurrent(response.data || { questions: [] });
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
      setMessageA("Xóa câu hỏi thành công");
      setTypeA("success");
      setOpenA(true);
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };
  if (!Array.isArray(questions) || loading) {
    return <div>Loading...</div>;
  }
  const handleDownload = async () => {
    const fileUrl =
      "https://english-for-kids.s3.ap-southeast-1.amazonaws.com/question-sample.xlsx";
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = "question-sample.xlsx";
    link.click();
  };

  return (
    <div className="a-q-container">
      <div className="a-q-header">
        <div className="ad-p-content-header">
          <div className="ad-p-content-header-1">
            <div
              style={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                color: "#333",
                fontSize: "30px",
                fontWeight: "bold",
                backgroundColor: "#f7f8fa",
                padding: "10px",
                borderRadius: "5px",
                border: "2px solid #4884f4",
              }}
            >
              {lessonCurrent.title}
            </div>
            <div
              style={{
                display: "flex",
                width: "100%",
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
                  <MenuItem value={"WORD_MEANING"}>Word - Meaning</MenuItem>
                  <MenuItem value={"MEANING_WORD"}>Meaning - Word</MenuItem>
                  <MenuItem value={"WORD_SPELLING"}>Word - Audio</MenuItem>
                  <MenuItem value={"SPELLING_WORD"}>Audio - Word</MenuItem>
                  <MenuItem value={"FILL_IN_FLANK"}>Fill in the flank</MenuItem>
                  <MenuItem value={"WORD_ORDER"}>Word order</MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>
          <div className="ad-p-content-header-2">
            <button
              className="a-l-button"
              onClick={() => {
                setOpenModalAddQuestion(true);
              }}
            >
              <IoMdAdd />
              Create question
            </button>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                alignItems: "center",
              }}
            >
              <FileInput
                handleFileSelect={handleFileSelect}
                content={loadingImport ? "Loading..." : "Import question"}
              />
              <button className="btn-download-sample" onClick={handleDownload}>
                Download sample
              </button>
            </div>
            {!disibleResult && (
              <ProgressBar
                percent={percent}
                passImport={passImport}
                lack={lack}
              />
            )}
          </div>
          <div className="ad-p-content-header-3">
            <button
              style={{
                backgroundColor: "#007bff",
                color: "#fff",
                border: "none",
                padding: "10px 20px",
                borderRadius: "5px",
                width: "250px",
                cursor: "pointer",
              }}
              onClick={toggleDrawer(true)}
            >
              Vocabulary
            </button>{" "}
            <Drawer
              anchor="right"
              open={state.right}
              onClose={toggleDrawer(false)}
            >
              {list()}
            </Drawer>
          </div>
          {/* <div>
            
           
            <div>
              
              <div
               
              >
                
              </div>

             
            </div>
          </div> */}
          {/*  */}
        </div>
      </div>
      <div className="a-q-body">
        {!loading ? (
          <div className="a-p-content-left">
            <Box
              sx={{ width: "100%" }}
              style={{
                height: "100%",
              }}
            >
              <Paper sx={{ width: "100%", overflow: "hidden" }}>
                <EnhancedTableToolbar titleLesson="Question management" />
                <TableContainer sx={{ overflowY: "auto", height: 550 }}>
                  <Table stickyHeader aria-label="sticky table">
                    <EnhancedTableHead
                      headCells={headCells}
                      numSelected={selected.length}
                      order={order}
                      orderBy={orderBy}
                      onRequestSort={handleRequestSort}
                      rowCount={lessonCurrent.questions.length}
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
                              {index + 1}
                            </TableCell>
                            <TableCell align="left">{row.content}</TableCell>
                            <TableCell align="left">
                              {row.image ? (
                                <img
                                  src={row.image}
                                  width={50}
                                  height={50}
                                  alt=""
                                />
                              ) : (
                                <div>-</div>
                              )}
                            </TableCell>
                            <TableCell align="left">
                              {row.audio ? (
                                <AudioPlayer audioSrc={row.audio} />
                              ) : (
                                <div>-</div>
                              )}
                            </TableCell>
                            <TableCell align="left">
                              {
                                // 3 sự lựa chọn

                                row.type === "WORD_MEANING"
                                  ? "word - meaning"
                                  : row.type === "MEANING_WORD"
                                  ? "meaning - word"
                                  : row.type === "WORD_SPELLING"
                                  ? "word - audio"
                                  : row.type === "SPELLING_WORD"
                                  ? "audio - word"
                                  : row.type === "FILL_IN_FLANK"
                                  ? "fill in the flank"
                                  : "word order"
                              }
                            </TableCell>
                            <TableCell
                              align="left"
                              sx={{
                                maxWidth: "200px",
                              }}
                            >
                              {row.type === "WORD_ORDER" ? (
                                <div></div>
                              ) : (
                                <Accordion>
                                  <AccordionSummary
                                    expandIcon={<ArrowDropDownIcon />}
                                    aria-controls="panel2-content"
                                    id="panel2-header"
                                  >
                                    <Typography>Answer detail</Typography>
                                  </AccordionSummary>
                                  <AccordionDetails>
                                    <Typography>
                                      {row.answers.map((answer, index) => (
                                        <div
                                          key={index}
                                          style={{
                                            ...styles.answer,
                                            ...(index === 0
                                              ? styles.correctAnswer
                                              : {}),
                                          }}
                                        >
                                          <div
                                            style={{
                                              display: "flex",
                                              alignItems: "center",
                                              justifyContent: "space-between",
                                              gap: "10px",
                                              flexDirection: "row",
                                              padding: "5px",
                                            }}
                                          >
                                            <p style={styles.answerText}>
                                              <strong>
                                                {" "}
                                                {String.fromCharCode(
                                                  65 + index
                                                )}
                                                :
                                              </strong>{" "}
                                              {answer.content}
                                            </p>
                                            {answer.image && (
                                              <img
                                                src={answer.image}
                                                alt=""
                                                width={60}
                                                height={60}
                                              />
                                            )}
                                            {answer.audio && (
                                              <AudioPlayer
                                                audioSrc={answer.audio}
                                              />
                                            )}
                                          </div>
                                        </div>
                                      ))}
                                    </Typography>
                                  </AccordionDetails>
                                </Accordion>
                              )}
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
                                    setSelected([row.id]);
                                    setOpenModalQuestion(true);
                                  }}
                                >
                                  <MdEdit />
                                </button>
                                <button
                                  className="a-l-button-action-delete"
                                  onClick={() => {
                                    setDeleteQuestion(row);
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
                                    {"Delete question"}
                                  </DialogTitle>
                                  <DialogContent>
                                    <DialogContentText id="alert-dialog-description">
                                      Are you sure you want to delete this
                                      question?
                                    </DialogContentText>
                                  </DialogContent>
                                  <DialogActions>
                                    <Button
                                      onClick={() => {
                                        setDeleteQuestion(row);
                                        handleDeleteQuestion(deleteQuestion);
                                        handleCloseD();
                                      }}
                                    >
                                      Delete
                                    </Button>
                                    <Button
                                      variant="error"
                                      onClick={handleCloseD}
                                      autoFocus
                                    >
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
                  count={lessonCurrent.questions.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  // onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Paper>
            </Box>
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </div>
      <ModalAddQuestion
        open={openModalAddQuestion}
        handleClose={handleModalResultA}
      />
      <ModalUpdateQuestion
        open={openModalUpdateQuestion}
        handleClose={handleModalResultU}
        dataQuestion={question}
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
    </div>
  );
};

export default Question;
