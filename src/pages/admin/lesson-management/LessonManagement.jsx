import React, { useEffect, useState } from "react";
import "./styles.css";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TablePagination from "@mui/material/TablePagination";
import EnhancedTableHead from "../../../../src/utils/enhancedTable/EnhancedTableHead";
import EnhancedTableToolbar from "../../../../src/utils/enhancedTable/EnhancedTableToolbar";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import customFetch from "../../../utils/customFetch";
import { setLessons } from "../../../redux/slices/lessonSlice";

import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { FaAngleDoubleRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { setLessonSelected } from "../../../redux/slices/clessonSlice";
import ModalAddLesson from "./tool/ModalAddLesson";
import ModalUpdateLesson from "./tool/ModalUpdateLesson";

const LessonManagement = () => {
  //=========================================================================================================
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(4);
  //=========================================================================================================

  const lessons = useSelector((state) => state.lessons);
  const lessonSelected = useSelector((state) => state.lessonSelected);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [hasFetched, setHasFetched] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await customFetch.get("/api/v1/lessons/get-all");
      if (response.status === 200) {
        dispatch(setLessons(response.data.sort((a, b) => a.id - b.id)));
      }
      setHasFetched(true); // Mark that we've attempted to fetch data
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!lessons.length && !hasFetched) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [lessons, hasFetched, dispatch, fetchData]);

  // Giá trị headCells có thể được cấu hình bởi người dùng
  const headCells = [
    {
      id: "STT",
      numeric: true,
      disablePadding: true,
      label: "No.",
    },
    {
      id: "tilte",
      numeric: false,
      disablePadding: false,
      label: "Title",
    },
    {
      id: "image",
      numeric: false,
      disablePadding: false,
      label: "Image",
    },
    {
      id: "decription",
      numeric: false,
      disablePadding: false,
      label: "Description",
    },
    {
      id: "vocabulary",
      numeric: true,
      disablePadding: false,
      label: "Vocabulary Count",
    },
    {
      id: "question",
      numeric: true,
      disablePadding: false,
      label: "Question Count",
    },
    {
      id: "action",
      numeric: false,
      disablePadding: false,
      label: "Actions",
    },
  ];

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleClick = (event, id) => {
    // Kiểm tra xem dòng đã được chọn chưa
    if (selected.includes(id)) {
      setSelected([]); // Nếu đã được chọn, bỏ chọn
    } else {
      setSelected([id]); // Nếu chưa được chọn, chọn dòng này
    }
    const selectedRow = lessons.find((row) => row.id === id);
    console.log("Dòng đã chọn:", selectedRow); // In ra thông tin của dòng đã chọn
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // const handleChangeRowsPerPage = (event) => {
  //   setRowsPerPage(parseInt(event.target.value, 10));
  //   setPage(0);
  // };

  // const handleChangeDense = (event) => {
  //   setDense(event.target.checked);
  // };
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

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - lessons.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      [...lessons]
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage,
          //  page * rowsPerPage + rowsPerPage
          ),
    [order, orderBy, page, rowsPerPage, lessons]
  );

  //=========================================================================================================

  const [openModalAddLesson, setOpenModalAddLesson] = useState(false);

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
    setOpenModalAddLesson(false);

    setMessageA(message);
    setTypeA(type);
    setOpenA(true);
  };

  //=========================================================================================================

  const [openModalUpdateLesson, setOpenModalUpdateLesson] =
    React.useState(false);
  const [openS, setOpenS] = React.useState(false);
  const [messageS, setMessageS] = React.useState("");
  const [typeS, setTypeS] = React.useState("success");

  const handleCloseS = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenS(false);
  };

  // Callback để xử lý kết quả từ Modal
  const handleModalResult = (success) => {
    setOpenModalUpdateLesson(false); // Đóng modal
    if (success) {
      setMessageS("Update lesson successfully!"); // Hiển thị thông báo
      setTypeS("success");
    } else {
      setMessageS("Cancel!");
      setTypeS("error");
    }
    setOpenS(true); // Hiển thị Snackbar
  };

  ///=========================================================================================================
  const [openD, setOpenD] = React.useState(false);

  const handleClickOpenD = () => {
    setOpenD(true);
  };

  const handleCloseD = () => {
    setOpenD(false);
  };

  //=========================================================================================================
  const handleDeleteLesson = async (id) => {
    setLoading(true);
    try {
      const response = await customFetch.post(`/api/v1/lessons/delete/${id}`);
      if (response.status === 200) {
        console.log("Lesson deleted successfully!", response.data);
        await customFetch.get("/api/v1/lessons/get-all").then((response) => {
          dispatch(setLessons(response.data));
        });
        setMessageA("Delete lesson successfully!");
        setTypeA("success");
        setOpenA(true);
      }
      setLoading(false);
    } catch (error) {
      console.error("There was an error deleting the lesson!", error);
      setLoading(false);
    }
  };

  return (
    <div className="a-l-container">
      <div className="a-l-header">
        {/* <TextField id="outlined-basic" label="Tên bài học" variant="outlined" />
        <div>
          <button className="a-l-button">
            <FaSearch />
          </button>
        </div> */}
        <div>
          <button
            onClick={() => {
              setOpenModalAddLesson(true);
            }}
            className="a-l-button"
          >
            Create lesson
          </button>
        </div>
        {/* <div>
          <button className="a-l-button">Nhập bài học</button>
        </div> */}
      </div>
      <div className="a-l-body">
        {!loading ? (
          <Box sx={{ width: "100%" }}>
            <Paper sx={{ width: "100%", mb: 2 }}>
              <EnhancedTableToolbar titleLesson="Lesson management" />
              <TableContainer sx={{  overflowY: "auto", height:520}}>
                <Table
                  sx={{ minWidth: 750 }}
                  aria-labelledby="tableTitle"
                  size={dense ? "small" : "medium"}
                >
                  <EnhancedTableHead
                    headCells={headCells} // Truyền headCells vào đây
                    numSelected={selected.length}
                    order={order}
                    orderBy={orderBy}
                    onRequestSort={handleRequestSort}
                    rowCount={lessons.length}
                  />
                  <TableBody>
                    {visibleRows.map((row, index) => {
                      const isItemSelected = selected.includes(row.id);
                      const labelId = `enhanced-table-checkbox-${index}`;

                      return (
                        <TableRow
                          hover
                          onClick={(event) => handleClick(event, row.id)}
                          role="checkbox"
                          aria-checked={isItemSelected}
                          tabIndex={-1}
                          key={row.id}
                          selected={isItemSelected}
                          sx={{ cursor: "pointer" }}
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
                          <TableCell align="left">{row.title}</TableCell>
                          <TableCell align="left">
                            <img
                              src={row.image}
                              width={70}
                              height={70}
                              alt=""
                            />
                          </TableCell>
                          <TableCell
                            sx={{
                              width: "350px",
                            }}
                            align="left"
                          >
                            {row.description}
                          </TableCell>
                          <TableCell align="right">
                            {Array.isArray(row.vocabularies)
                              ? new Set(
                                  row.vocabularies.map(
                                    (vocabulary) => vocabulary.word
                                  )
                                ).size
                              : 0}
                          </TableCell>
                          <TableCell align="right">
                            {row.questions.length}
                          </TableCell>
                          <TableCell align="left">
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "20px",
                              }}
                            >
                              <button
                                className="a-l-button-action-update"
                                onClick={() => {
                                  dispatch(setLessonSelected(row));
                                  setOpenModalUpdateLesson(true);
                                }}
                              >
                                <MdEdit />
                              </button>
                              <button
                                className="a-l-button-action-delete"
                                onClick={handleClickOpenD}
                              >
                                <MdDelete />
                              </button>
                              <Dialog
                                open={openD}
                                onClose={handleCloseD}
                                aria-labelledby="alert-dialog-title"
                                aria-describedby="alert-dialog-description"
                              >
                                <DialogTitle id="alert-dialog-title">
                                  {"Delete Lesson"}
                                </DialogTitle>
                                <DialogContent>
                                  <DialogContentText id="alert-dialog-description">
                                    Are you sure you want to delete this lesson?
                          
                                  </DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                  <Button
                                    onClick={() => {
                                      handleDeleteLesson(row.id);
                                      handleCloseD();
                                    }}
                                  >
                                    Agree
                                  </Button>
                                  <Button
                                    variant="error"
                                    onClick={handleCloseD}
                                    autoFocus
                                  >
                                    Disagree
                                  </Button>
                                </DialogActions>
                              </Dialog>
                              <button
                                className="a-l-button-action-detail"
                                onClick={() => {
                                  dispatch(setLessonSelected(row));
                                  navigate(`/admin/lesson/${row.id}`);
                                }}
                              >
                                Details <FaAngleDoubleRight />
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {emptyRows > 0 && (
                      <TableRow
                        style={{ height: (dense ? 33 : 53) * emptyRows }}
                      >
                        <TableCell colSpan={6} />
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              {/* <TablePagination
                rowsPerPageOptions={[5]}
                component="div"
                count={lessons.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                // onRowsPerPageChange={handleChangeRowsPerPage}
              /> */}
            </Paper>
          </Box>
        ) : (
          <div>Loading ....</div>
        )}
      </div>
      <ModalAddLesson
        open={openModalAddLesson}
        handleClose={handleModalResultA}
      />
      <ModalUpdateLesson
        open={openModalUpdateLesson}
        handleClose={handleModalResult}
        data={lessonSelected}
      />
      <Snackbar
        open={openS}
        autoHideDuration={6000}
        onClose={handleCloseS}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseS}
          severity={typeS}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {messageS}
        </Alert>
      </Snackbar>
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

export default LessonManagement;
