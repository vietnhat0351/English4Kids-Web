import React from "react";
import PropTypes from "prop-types";
import { Box } from "@mui/material";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import { visuallyHidden } from "@mui/utils";

function EnhancedTableHead(props) {
  const { order, orderBy, numSelected, rowCount, onRequestSort, headCells } =
    props;

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableRow>
      {headCells.map((headCell) => (
        <TableCell
          key={headCell.id}
          align={headCell.numeric ? "right" : "left"}
          padding={headCell.disablePadding ? "none" : "normal"}
          sortDirection={orderBy === headCell.id ? order : false}
          sx={{
            position: "sticky",
            top: 0,
            backgroundColor: "white", 
            fontWeight: "bold",
            zIndex: 1, 
          }}
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
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
  headCells: PropTypes.array.isRequired, // Nhận headCells như một prop
};

export default EnhancedTableHead;
