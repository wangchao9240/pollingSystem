import {
  Button,
  Dialog,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material"
import { useState } from "react"
import DialogModal from "./dialogModal"

import "./index.css"

const rows = [
  {
    id: "1",
    key: "1",
    question: "question",
    type: "",
    correctAnswer: ["A"],
    options: [
      { optionKey: "A", optionValue: "Option A" },
      { optionKey: "B", optionValue: "Option B" },
      { optionKey: "C", optionValue: "Option C" },
      { optionKey: "D", optionValue: "Option D" },
    ],
    createdAt: new Date(),
    modifyAt: new Date(),
  },
  {
    id: "2",
    key: "2",
    question: "question",
    type: "Multiple",
    correctAnswer: ["A", "B"],
    options: [
      { optionKey: "A", optionValue: "Option A" },
      { optionKey: "B", optionValue: "Option B" },
      { optionKey: "C", optionValue: "Option C" },
      { optionKey: "D", optionValue: "Option D" },
    ],
    createdAt: new Date(),
    modifyAt: new Date(),
  },
  {
    id: "3",
    key: "3",
    question: "question",
    type: "Single",
    correctAnswer: ["A"],
    options: [
      { optionKey: "A", optionValue: "Option A" },
      { optionKey: "B", optionValue: "Option B" },
      { optionKey: "C", optionValue: "Option C" },
      { optionKey: "D", optionValue: "Option D" },
    ],
    createdAt: new Date(),
    modifyAt: new Date(),
  },
]

const SurveyList = () => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [openDialog, setOpenDialog] = useState(false)
  const [surveyItem, setSurveyItem] = useState({})

  const columns = [
    { id: "question", label: "Question", minWidth: 170 },
    { id: "type", label: "Type", minWidth: 100 },
    // { id: "correctAnswer", label: "Correct Answer", minWidth: 100 },
    // { id: "options", label: "Options", minWidth: 100 },
    {
      id: "createdAt",
      label: "Created At",
      minWidth: 100,
      format: (value) => value.toLocaleString("en-US"),
    },
    {
      id: "modifyAt",
      label: "Modify At",
      minWidth: 100,
      format: (value) => value.toLocaleString("en-US"),
    },
    {
      id: "actions",
      label: "Actions",
      minWidth: 170,
      align: "right",
      format: (value, record) => (
        <div>
          <Button
            onClick={() => {
              console.log("value", record)
              setSurveyItem(record)
              setOpenDialog(true)
            }}
            variant="outlined"
            size="small"
            color="primary"
          >
            Edit
          </Button>
          <Button
            style={{ marginLeft: "8px" }}
            variant="outlined"
            size="small"
            color="primary"
          >
            Delete
          </Button>
        </div>
      ),
    },
  ]

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <div className="button-wrapper">
        <Button variant="contained">Add</Button>
      </div>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, idx) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={idx}>
                    {columns.map((column) => {
                      const value = row[column.id]
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format ? column.format(value, row) : value}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                )
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <DialogModal
        open={openDialog}
        handleClose={() => setOpenDialog(false)}
        survey={surveyItem}
      />
    </Paper>
  )
}

export default SurveyList
