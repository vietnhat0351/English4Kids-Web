import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
} from "@mui/material";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";

import "./styles.css";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { FaSearch } from "react-icons/fa";

import FileInput from "../../../../utils/ReadExcelFile/FileInput";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import RepeatIcon from "@mui/icons-material/Repeat";
import { useDispatch, useSelector } from "react-redux";
import EnhancedTableToolbar from "../../../../utils/enhancedTable/EnhancedTableToolbar";
import EnhancedTableHead from "../../../../utils/enhancedTable/EnhancedTableHead";
import AudioPlayer from "../../../../utils/AudioPlayer";
import { useLocation } from "react-router-dom";
import customFetch from "../../../../utils/customFetch";
import { setLessonSelected } from "../../../../redux/slices/clessonSlice";
import ModalAddQuestion from "./tool/ModalAddQuestion";
import ReadExcel from "../../../../utils/ReadExcelFile/ReadExcel";

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
          Tiến trình {percent}%
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
          <CheckCircleIcon /> Thành công: {passImport}
        </span>
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            color: "#f44336",
          }}
        >
          <ErrorIcon /> Lỗi: {lack}
        </span>
      </div>
    </div>
  );
};

const ProgressBar = ({ percent, passImport, lack }) => {
  return (
    <div
      style={{
        width: "40%",
        marginBottom: "10px",
        display: "flex",
        gap: "10px",
        flexDirection: "column",
      }}
    >
      {/* Display progress text */}
      <ProgressInfo
        percent={percent}
        passImport={passImport}
        lack={lack}
      />
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
  const selectedLesson = useSelector((state) => state.lessonSelected);
  const [lessonCurrent, setLessonCurrent] = useState({ questions: [] });
  const dispatch = useDispatch();
  const rowRefs = useRef({});
  const [loading, setLoading] = useState(true);

  const location = useLocation(); // Hook to track the current route

  useEffect(() => {
    const lastUrl = location.pathname.split("/").pop();
    console.log("lastUrl", lastUrl);

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await customFetch.get(`/api/v1/lessons/${lastUrl}`);
        console.log("response", response.data);
        dispatch(setLessonSelected(response.data));
        setLessonCurrent(response.data || { questions: [] });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [location.pathname, dispatch]); // Dependency on the current route

  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);

  const [percent, setPercent] = useState(0);
  const [passImport, setPassImport] = useState(0);
  const [lack, setLack] = useState(0);

  const [loadingImport, setLoadingImport] = useState(false);
  const [disibleResult, setDisibleResult] = useState(true);

  const [openModalAddQuestion, setOpenModalAddQuestion] = useState(false);

  const handleOpenModalAddQuestion = () => setOpenModalAddQuestion(true);
  const handleCloseModalAddQuestion = () => setOpenModalAddQuestion(false);

  const headCells = [
    { id: "id", numeric: true, disablePadding: true, label: "" },
    { id: "content", numeric: false, disablePadding: false, label: "Nội dung" },
    { id: "image", numeric: false, disablePadding: false, label: "Hình ảnh" },
    { id: "audio", numeric: false, disablePadding: false, label: "Âm thanh" },
    {
      id: "type",
      numeric: false,
      disablePadding: false,
      label: "Loại câu hỏi",
    },
    { id: "answers", numeric: false, disablePadding: false, label: "Đáp án" },
    { id: "action", numeric: false, disablePadding: false, label: "Tùy chọn" },
  ];

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

  const visibleRows = useMemo(
    () => [...lessonCurrent.questions].sort(getComparator(order, orderBy)),
    [lessonCurrent.questions, order, orderBy]
  );
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

  const list = () => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {["Inbox", "Starred", "Send email", "Drafts"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {["All mail", "Trash", "Spam"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
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
          setLack(lack + 1);
          continue;
        } else {
          if (
            data[i].typeQuestion === "WORD_MEANING" ||
            data[i].typeQuestion === "MEANING_WORD"
          ) {
            if (!data[i].answerContent) {
              setLack(lack + 1);
              console.log("Lỗi từ - nghĩa 1", data[i]);
              continue;
            } else {
              if (
                !data[i].wrongAnswerContent1 &&
                !data[i].wrongAnswerContent2 &&
                !data[i].wrongAnswerContent3
              ) {
                setLack(lack + 1);
                console.log("Lỗi từ - nghĩa 2", data[i]);
                continue;
              }
            }
          }
          if (data[i].typeQuestion === "WORD_SPELLING") {
            if (!data[i].answerAudio) {
              setLack(lack + 1);
              console.log("Lỗi từ - âm 1", data[i]);
              continue;
            } else {
              if (
                !data[i].wrongAnswerAudio1 &&
                !data[i].wrongAnswerAudio2 &&
                !data[i].wrongAnswerAudio3
              ) {
                setLack(lack + 1);
                console.log("Lỗi từ - âm 2", data[i]);
                continue;
              }
            }
          }
          if (data[i].typeQuestion === "SPELLING_WORD") {
            if (!data[i].audioQuestion) {
              setLack(lack + 1);
              console.log("Lỗi âm - từ 1", data[i]);
              continue;
            } else {
              if (!data[i].answerContent) {
                setLack(lack + 1);
                console.log("Lỗi âm - từ 2", data[i]);
                continue;
              } else {
                if (
                  !data[i].wrongAnswerContent1 &&
                  !data[i].wrongAnswerContent2 &&
                  !data[i].wrongAnswerContent3
                ) {
                  setLack(lack + 1);
                  console.log("Lỗi âm - từ 3", data[i]);
                  continue;
                }
              }
            }
          }
          if (data[i].typeQuestion === "WORD_ORDER") {
            if (data[i].contentQuestion.split(" ").length < 2) {
              setLack(lack + 1);
              console.log("Lỗi thiết từ", data[i]);
              continue;
            }
          }
          if (data[i].typeQuestion === "FILL_IN_FLANK") {
            if (!data[i].answerContent) {
              setLack(lack + 1);
              console.log("Lỗi thiếu từ 1", data[i]);
              continue;
            } else {
              if (
                !data[i].wrongAnswerContent1 &&
                !data[i].wrongAnswerContent2 &&
                !data[i].wrongAnswerContent3
              ) {
                setLack(lack + 1);
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
          setLessonCurrent(response.data || { questions: [] });
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

  return (
    <div className="a-q-container">
      <div className="a-q-header">
        <div className="ad-p-content-header">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "50px",
            }}
          >
            <button className="a-l-button" onClick={handleOpenModalAddQuestion}>
              <IoMdAdd />
              Thêm câu hỏi
            </button>
            <Button onClick={toggleDrawer(true)}>Open right Drawer</Button>
            <Drawer
              anchor="right"
              open={state.right}
              onClose={toggleDrawer(false)}
            >
              {list()}
            </Drawer>
          </div>
          <div>
            {/* <button
              "
              onClick={() => document.getElementById("filexcel").click()}
            >
              <CiImport /> */}
            {/* Nhập từ vựng (excel) */}
            <FileInput
              handleFileSelect={handleFileSelect}
              content={loadingImport ? "Đang tải dữ liệu" : "Nhập file (Excel)"}
            />
            {/* 
            </button> */}
          </div>
          {!disibleResult && (
            <ProgressBar
              percent={percent}
              passImport={passImport}
              lack={lack}
            />
          )}
        </div>
      </div>
      <div className="a-q-body">
        {!loading ? (
          <div className="a-p-content-left">
            <Box sx={{ width: "100%" }}>
              <Paper sx={{ width: "100%", overflow: "hidden" }}>
                <EnhancedTableToolbar titleLesson="Quản lí câu hỏi" />
                <TableContainer sx={{ maxHeight: 600, overflowY: "auto" }}>
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
                            ></TableCell>
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
                                  ? "Từ vựng - Ý nghĩa"
                                  : row.type === "MEANING_WORD"
                                  ? "Ý nghĩa - Từ vựng"
                                  : row.type === "WORD_SPELLING"
                                  ? "Từ vựng - Âm thanh"
                                  : row.type === "SPELLING_WORD"
                                  ? "Âm thanh - Từ vựng"
                                  : "Sắp xếp từ"
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
                                    <Typography>Chi tiết đáp án</Typography>
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
                                  // onClick={handleOpenModalUpdateVocabulary}
                                >
                                  <MdEdit />
                                </button>
                                <button className="a-l-button-action-delete">
                                  <MdDelete />
                                </button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Box>
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </div>
      <ModalAddQuestion
        open={openModalAddQuestion}
        handleClose={handleCloseModalAddQuestion}
      />
    </div>
  );
};

export default Question;
