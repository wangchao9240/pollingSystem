import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import EmptyTable from '../../../components/EmptyTable';

const SurveyTable = ({ columns, surveyList }) => {
  // Check if the surveyList is empty
  const isEmpty = !surveyList || surveyList.length === 0;

  if (isEmpty) {
    return <EmptyTable message="No Result found" />;
  }

  return (
    <TableContainer sx={{ maxHeight: 440 }}>
      <Table stickyHeader aria-label="sticky table">
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={column.id}
                align={column.align}
                style={{
                  minWidth: column.minWidth,
                  backgroundColor: "#e0e0e0", // Gray header background
                }}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {surveyList.map((row) => (
            <TableRow 
              hover 
              tabIndex={-1} 
              key={row._id}
              sx={{ 
                "&:nth-of-type(odd)": { backgroundColor: "#f5f5f5" },  // Light gray for odd rows
              }}
            >
              {columns.map((column) => {
                const value = row[column.id];
                return (
                  <TableCell key={column.id} align={column.align}>
                    {column.format && column.id === "actions" 
                      ? column.format(value, row)
                      : column.format && typeof value !== 'undefined'
                        ? column.format(value, row)
                        : value}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SurveyTable;