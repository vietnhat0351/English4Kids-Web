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

import FileInput from "../../../../src/utils/ReadExcelFile/FileInput";
import ReadExcel from "../../../../src/utils/ReadExcelFile/ReadExcel";

import { IoMdAdd } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { IoInformation } from "react-icons/io5";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import RepeatIcon from "@mui/icons-material/Repeat";
import "./style.css";
import { useDispatch, useSelector } from "react-redux";
import { setVocabularies } from "../../../redux/slices/vocabularySlice";
import { useEffect } from "react";
// import { FaSearch } from "react-icons/fa";
import {
  Alert,
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  TablePagination,
  TextField,
} from "@mui/material";
import { useState, useMemo } from "react";
import { useRef } from "react";
import { setUserProcess } from "../../../redux/slices/userProcess";
import ModalInforUser from "./ModalInforUser";

const UserManagement = () => {
  const vocabularies = useSelector((state) => state.vocabularies);
  const listUser = useSelector((state) => state.userProcess);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedRow, setSelectedRow] = useState(null);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
  };

  const headCells = [
    { id: "id", numeric: true, disablePadding: true, label: "No." },
    { id: "name", numeric: false, disablePadding: false, label: "Name" },
    { id: "email", numeric: false, disablePadding: false, label: "Email" },
    {
      id: "dailyPoints",
      numeric: false,
      disablePadding: false,
      label: "Daily Points",
    },
    {
      id: "weeklyPoints",
      numeric: false,
      disablePadding: false,
      label: "Weekly Points",
    },
    {
      id: "lastLearningDate",
      numeric: false,
      disablePadding: false,
      label: "Last Learning Date",
    },
    {
      id: "action",
      numeric: false,
      disablePadding: false,
      label: "Action",
    },
  ];
  const rowRefs = useRef({});

  // const handleSearch = () => {
  //   const matchingRow = listUser.find((row) => row.email === searchTerm);
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
    const matchingRowIndex = listUser.findIndex(
      (row) => row.email === searchTerm
    );

    if (matchingRowIndex !== -1) {
      const matchingRow = listUser[matchingRowIndex];
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

    const selectedRow = listUser.find((row) => row.id === data.id);
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
    () =>
      [...listUser]
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [listUser, order, orderBy, page, rowsPerPage]
  );

  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await customFetch.get("/api/v1/user/get-user-ranking");
        dispatch(setUserProcess(response.data));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
        setHasFetched(true); // Mark that we've attempted to fetch data
      }
    };

    if (!listUser.length && !hasFetched) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [dispatch, listUser, hasFetched]);

  useEffect(() => {
    handleSearch();
  }, [searchTerm]);

  const [openD, setOpenD] = React.useState(false);

  const handleClickOpenD = () => {
    setOpenD(true);
  };

  const handleCloseD = () => {
    setOpenD(false);
  };

  const handleDeleteUser = async (id) => {
    try {
      await customFetch.post(`/api/v1/user/delete/${id}`);
      setOpenD(false);
      const response = await customFetch.get("/api/v1/user/get-user-ranking");
      dispatch(setUserProcess(response.data));
    } catch (error) {
      console.error(error);
    }
  };

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div className="ad-p-container">
      <div className="ad-p-content">
        <div className="ad-p-content-header">
          <TextField
            id="outlined-basic"
            label="Search by email"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="ad-p-content-body">
          {!loading ? (
            <div className="a-p-content-left">
              <Box sx={{ width: "100%" }}>
                <Paper sx={{ width: "100%", overflow: "hidden" }}>
                  <EnhancedTableToolbar titleLesson="Quản lí tài khoản" />
                  <TableContainer sx={{ height: 540, overflowY: "auto" }}>
                    <Table stickyHeader aria-label="sticky table">
                      <EnhancedTableHead
                        headCells={headCells}
                        numSelected={selected.length}
                        order={order}
                        orderBy={orderBy}
                        onRequestSort={handleRequestSort}
                        rowCount={listUser.length}
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
                              <TableCell align="left" width={400}>
                                <div
                                  style={{
                                    display: "flex",
                                    gap: "10px",
                                    alignItems: "center",
                                    justifyContent: "flex-start",
                                  }}
                                >
                                  <Avatar
                                    src={row.avatar || ""}
                                    sx={{ width: 50, height: 50 }}
                                  />
                                  {row.firstName} {row.lastName}
                                </div>
                              </TableCell>
                              <TableCell align="left">{row.email}</TableCell>
                              <TableCell align="left">
                                {row.dailyPoints}
                              </TableCell>
                              <TableCell align="left">
                                {row.weeklyPoints}
                              </TableCell>
                              <TableCell align="left">
                                {formatDate(row.lastLearningDate)}
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
                                      handleOpen();
                                    }}
                                  >
                                    <IoInformation />
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
                                      {"Delete User"}
                                    </DialogTitle>
                                    <DialogContent>
                                      <DialogContentText id="alert-dialog-description">
                                        Are you sure you want to delete this
                                        user?
                                        {/* Không thể khôi phục */}
                                      </DialogContentText>
                                    </DialogContent>
                                    <DialogActions>
                                      <Button
                                        onClick={() => {
                                          setSelectedRow(row);
                                          handleDeleteUser(selectedRow.id);
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
                    count={listUser.length}
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
      <ModalInforUser
        open={open}
        handleClose={handleClose}
        data={selectedRow}
      />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000} // 3 giây
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        message="User not found"
      />
    </div>
  );
};

export default UserManagement;
