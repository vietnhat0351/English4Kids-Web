import React, { useEffect, useState } from "react";
import "./styles.css";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TablePagination from "@mui/material/TablePagination";
import EnhancedTableHead from "../../../../src/utils/enhancedTable/EnhancedTableHead";
import EnhancedTableToolbar from "../../../../src/utils/enhancedTable/EnhancedTableToolbar";
import { TableBody, TableCell, TableRow } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import customFetch from "../../../utils/customFetch";
import { setLessons } from "../../../redux/slices/lessonSlice";

import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { FaAngleDoubleRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { setLessonSelected } from "../../../redux/slices/clessonSlice";
import ModalAddLesson from "./tool/ModalAddLesson";

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
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [hasFetched, setHasFetched] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await customFetch.get("/api/v1/lessons/get-all");
      if (response.status === 200) {
        dispatch(setLessons(response.data));
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
      label: "",
    },
    {
      id: "tilte",
      numeric: false,
      disablePadding: false,
      label: "Tên bài học",
    },
    {
      id: "image",
      numeric: false,
      disablePadding: false,
      label: "Hình ảnh",
    },
    {
      id: "decription",
      numeric: false,
      disablePadding: false,
      label: "Mô tả",
    },
    {
      id: "vocabulary",
      numeric: true,
      disablePadding: false,
      label: "Số từ vựng",
    },
    {
      id: "question",
      numeric: true,
      disablePadding: false,
      label: "Số câu hỏi",
    },
    {
      id: "action",
      numeric: false,
      disablePadding: false,
      label: "Hành động",
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
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, lessons]
  );

  //=========================================================================================================

  const [openModalAddLesson, setOpenModalAddLesson] = useState(false);

  const handleOpenModalAddLesson = () => setOpenModalAddLesson(true);
  const handleCloseModalAddLesson = () => setOpenModalAddLesson(false);

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
          <button onClick={handleOpenModalAddLesson} className="a-l-button">Thêm bài học</button>
        </div>
        {/* <div>
          <button className="a-l-button">Nhập bài học</button>
        </div> */}
      </div>
      <div className="a-l-body">
        {!loading ? (
          <Box sx={{ width: "100%" }}>
            <Paper sx={{ width: "100%", mb: 2 }}>
              <EnhancedTableToolbar titleLesson="Quản lí bài học" />
              <TableContainer>
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
                          ></TableCell>
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
                            {row.vocabularies.length}
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
                                onClick={() => {}}
                              >
                                <MdEdit />
                              </button>
                              <button className="a-l-button-action-delete">
                                <MdDelete />
                              </button>
                              <button
                                className="a-l-button-action-detail"
                                onClick={() => {
                                  dispatch(setLessonSelected(row));
                                  navigate(`/admin/lesson/${row.id}`);
                                }}
                              >
                                Xem chi tiết <FaAngleDoubleRight />
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
              <TablePagination
                // rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={lessons.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                // onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          </Box>
        ) : (
          <div>Đang tải ....</div>
        )}
      </div>
      <ModalAddLesson
        open={openModalAddLesson}
        handleClose={handleCloseModalAddLesson}
      />
    </div>
  );
};

export default LessonManagement;
