import { Box, Button, Checkbox, CircularProgress, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel, Toolbar, Tooltip, Typography, alpha } from '@mui/material'
import axios from 'axios'
import React, { Component, useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { visuallyHidden } from '@mui/utils';
import FilterListIcon from '@mui/icons-material/FilterList';
import DeleteIcon from '@mui/icons-material/Delete';
import { formatDateTime } from '../../../utils/Utils';
import customFetch from '../../../utils/customFetch';

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
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: 'stt',
    numeric: false,
    disablePadding: true,
    label: 'STT',
  },
  {
    id: 'name',
    numeric: true,
    disablePadding: false,
    label: 'Tên',
  },
  {
    id: 'quantity',
    numeric: false,
    disablePadding: false,
    label: 'Số Lượng Flashcard',
  },
  {
    id: 'description',
    numeric: false,
    disablePadding: false,
    label: 'Mô Tả',
  },
    {
    id: 'createdAt',
    numeric: false,
    disablePadding: false,
    label: 'Ngày Tạo',
  },
];

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
    props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            // align={headCell.numeric ? 'center' : 'left'}
            align="center"
            // padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
            // style={{ width: headCell.id === 'name' ? 100 : 100 }}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

function EnhancedTableToolbar(props) {

  const { selected, setRows, rows } = props;
  const numSelected = selected?.length;
  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Danh sách bộ Flashcard
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete"
          onClick={() => {
            customFetch.post(`/api/v1/flashcards/delete-flashcard-sets`, { ids: selected })
              .then(response => {
                if (response.status === 200) {
                  setRows(rows.filter(row => !selected.includes(row.id)));
                }
              })
              .catch(error => {
                console.log(error);
              })
          }}
        >
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

export const Flashcard = () => {

  const [text, setText] = useState("");
  const [audioUrl, setAudioUrl] = useState(null);
  const [flashcardSets, setFlashcardSets] = useState([]);

  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const [rows, setRows] = React.useState([]);

  const [isLoading, setIsLoading] = React.useState(true);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = stableSort(rows, getComparator(order, orderBy)).slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    axios.get(`${process.env.REACT_APP_API_URL}/api/v1/flashcards/get-all-flashcard-sets`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Thêm token vào header Authorization
        }
      }).then((response) => {
        console.log(response.data);
        setFlashcardSets(response.data);

        let data = []
        response.data.map((flashcardSet, index) => {
          const tableRow = (({ ...o }) => o)(flashcardSet);
          tableRow.stt = index + 1;
          tableRow.quantity = flashcardSet.flashcards.length;
          tableRow.createdAt = formatDateTime(flashcardSet.createdAt);
          data.push(tableRow);
        })
        setRows(data);

        setIsLoading(false);
      }).catch((error) => {
        console.error(error);
      })
  }, []);

  const RenderFlashcardSetItem = (props) => {
    return (
      <div>
        <h2>{props.name}</h2>
        <p>{props.description}</p>
        <img src={props.image} alt={props.name} />
        <NavLink to={`/flashcard/${props.id}`}>
          <Button variant="contained" color="primary">Xem chi tiết</Button>
        </NavLink>
      </div>
    )
  }

  const handleOnClick = async () => {
    try {

      const token = localStorage.getItem('accessToken');

      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/tts/synthesize`,
        { text: text },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Thêm token vào header Authorization
          },
          responseType: "arraybuffer" // Nhận dữ liệu nhị phân (binary)
        }
      );

      // Tạo blob từ dữ liệu nhị phân nhận được
      const blob = new Blob([response.data], { type: "audio/mpeg" });
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);  // Lưu URL để phát hoặc tải xuống

    } catch (error) {
      console.error("Error generating audio:", error);
    }
  }

  return (
    <div style={{
      padding: '1rem',
    }}>
      <h1>Flashcard</h1>
      {/* <Button variant="contained" color="primary">Tạo bộ Flashcard</Button> */}
      <NavLink to="/flashcard/create">
        <Button variant="contained" color="primary">Tạo bộ Flashcard</Button>
      </NavLink>
      <div>
?

        <div>
          {isLoading ? <CircularProgress /> : (<Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 2 }}>
              <EnhancedTableToolbar selected={selected} setRows={setRows} rows={rows} />
              <TableContainer>
                <Table
                  sx={{ minWidth: 750 }}
                  aria-labelledby="tableTitle"
                  size={dense ? 'small' : 'medium'}
                >
                  <EnhancedTableHead
                    numSelected={selected.length}
                    order={order}
                    orderBy={orderBy}
                    onSelectAllClick={handleSelectAllClick}
                    onRequestSort={handleRequestSort}
                    rowCount={rows.length}
                  />
                  <TableBody>
                    {visibleRows.map((row, index) => {
                      const isItemSelected = isSelected(row.id);
                      const labelId = `enhanced-table-checkbox-${index}`;

                      return (
                        <TableRow
                          hover
                          // onClick={(event) => {navigate(`/dashboard/products/${row.id}`)}}
                          role="checkbox"
                          aria-checked={isItemSelected}
                          tabIndex={-1}
                          key={row.id}
                          selected={isItemSelected}
                          sx={{ cursor: 'pointer' }}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              color="primary"
                              checked={isItemSelected}
                              inputProps={{
                                'aria-labelledby': labelId,
                              }}
                              onClick={(event) => handleClick(event, row.id)}
                            />
                          </TableCell>
                          <TableCell
                            component="th"
                            id={labelId}
                            scope="row"
                            padding="none"
                            onClick={(event) => { navigate(`/flashcard/${row.id}`) }}
                            align='center'
                          >
                            {row.stt}
                          </TableCell>
                          <TableCell align="center">{row.name}</TableCell>
                          <TableCell align="center">{row.quantity}</TableCell>
                          <TableCell align="center">{row.description}</TableCell>
                          <TableCell align="center">{row.createdAt}</TableCell>
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
              <TablePagination
                rowsPerPageOptions={[10, 15, 20, { label: 'All', value: -1 }]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          </Box>)}
        </div>
      </div>
    </div>
  )
}

export default Flashcard;
