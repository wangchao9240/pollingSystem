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
                align={column.align || 'left'}
                style={{ minWidth: column.minWidth }}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {surveyList.map((row) => (
            <TableRow hover role="checkbox" tabIndex={-1} key={row._id}>
              {columns.map((column) => {
                const value = row[column.id];
                return (
                  <TableCell key={column.id} align={column.align || 'left'}>
                    {column.format && typeof column.format === 'function'
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