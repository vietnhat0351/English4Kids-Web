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
import { CiImport } from "react-icons/ci";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import RepeatIcon from "@mui/icons-material/Repeat";
import "./styles.css";
import { useDispatch, useSelector } from "react-redux";
import { setVocabularies } from "../../../redux/slices/vocabularySlice";
import { useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { TextField } from "@mui/material";
import { useState, useMemo } from "react";
import { useRef } from "react";
import ModalUpdateVocabulary from "./tool/ModalUpdateVocabulary";

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

  const headCells = [
    { id: "id", numeric: true, disablePadding: true, label: "" },
    { id: "word", numeric: false, disablePadding: false, label: "Từ" },
    { id: "meaning", numeric: false, disablePadding: false, label: "Nghĩa" },
    {
      id: "pronunciation",
      numeric: false,
      disablePadding: false,
      label: "Phát âm",
    },
    { id: "type", numeric: false, disablePadding: false, label: "Loại từ" },
    { id: "image", numeric: false, disablePadding: false, label: "Hình ảnh" },
    { id: "audio", numeric: false, disablePadding: false, label: "Âm thanh" },
    { id: "action", numeric: false, disablePadding: false, label: "Tùy chọn" },
  ];
  const rowRefs = useRef({});

  const handleFileSelect = async (file) => {
    let count = 0;
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
      for (let i = 0; i < data.length; i++) {
        // Làm tròn lên
        setPercent(Math.ceil(((i + 1) / data.length) * 100));
        if (
          data[i].word === null ||
          data[i].meaning === null ||
          data[i].pronunciation === null ||
          data[i].type === null ||
          data[i].image === null ||
          data[i].audio === null
        ) {
          setLack((prev) => prev + 1);
          count++;
          console.log(count);
          continue;
        }

        const response = await customFetch.get(
          `/api/v1/vocabulary/find-word-fast/${data[i].word}`
        );
        console.log("from database ", response.data);

        if (response.data) {
          if (!response.data.inDatabase) {
            const res = await customFetch.post(
              "/api/v1/vocabulary/create-vocabulary",
              data[i]
            );

            if (res.status === 200) {
              setPassImport((prev) => prev + 1);
         
            }
          }
          if (response.data.inDatabase) {
            setDuplicate((prev) => prev + 1);
          }
        }
      }
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

  const handleSearch = () => {
    const matchingRow = vocabularies.find((row) => row.word === searchTerm);
    if (matchingRow) {
      setSelected([matchingRow.id]);

      // Scroll the selected row into view
      if (rowRefs.current[matchingRow.id]) {
        rowRefs.current[matchingRow.id].scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    } else {
      setSelected([]);
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

  const visibleRows = useMemo(
    () => [...vocabularies].sort(getComparator(order, orderBy)),
    [vocabularies, order, orderBy]
  );

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
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              color: "#ff9800",
            }}
          >
            <RepeatIcon /> Trùng lặp: {duplicate}
          </span>
        </div>
      </div>
    );
  };
  const ProgressBar = ({ percent, passImport, lack, duplicate }) => {
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

  return (
    <div className="ad-p-container">
      <div className="ad-p-content">
        <div className="ad-p-content-header">
          <TextField
            id="outlined-basic"
            label="Tên từ vựng"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="a-l-button">
            <FaSearch />
          </button>
          <div className="a-l-search"></div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "50px",
            }}
          >
            <button
              className="a-l-button"
              onClick={handleOpenModalAddVocabulary}
            >
              <IoMdAdd />
              Thêm từ vựng
            </button>
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
              duplicate={duplicate}
            />
          )}
        </div>
        <div className="ad-p-content-body">
          {!loading ? (
            <div className="a-p-content-left">
              <Box sx={{ width: "100%" }}>
                <Paper sx={{ width: "100%", overflow: "hidden" }}>
                  <EnhancedTableToolbar titleLesson="Quản lí từ vựng" />
                  <TableContainer sx={{ maxHeight: 600, overflowY: "auto" }}>
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
                              ></TableCell>
                              <TableCell align="left">{row.word}</TableCell>
                              <TableCell align="left">{row.meaning}</TableCell>
                              <TableCell align="left">
                                {row.pronunciation}
                              </TableCell>
                              <TableCell align="left">{row.type}</TableCell>
                              <TableCell align="left">
                                <img
                                  src={row.image}
                                  width={50}
                                  height={50}
                                  alt=""
                                />
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
                                    onClick={handleOpenModalUpdateVocabulary}
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
      </div>
      <ModalAddVocabulary
        open={openModalAddVocabulary}
        handleClose={handleCloseModalAddVocabulary}
      />
      <ModalUpdateVocabulary
        open={openModalUpdateVocabulary}
        handleClose={handleCloseModalUpdateVocabulary}
        rowData={vocabularies.find((row) => row.id === selected[0])}
      />
    </div>
  );
};

export default VocabularyManagement;
