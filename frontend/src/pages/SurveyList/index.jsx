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
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material"
import { useEffect, useState } from "react"
import DialogModal from "./dialogModal"
import axiosInstance from "../../axiosConfig"
import { useAlert } from "../../context/AlertContext"

import "./index.css"

const initialSurvey = {
  question: "",
  type: "",
  correctAnswer: [],
  options: [],
}

const SurveyList = () => {
  const [surveyList, setSurveyList] = useState([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [total, setTotal] = useState(0)
  const [openDialog, setOpenDialog] = useState(false)
  const [surveyItem, setSurveyItem] = useState({})
  const { showAlert } = useAlert()
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)

  const columns = [
    { id: "question", label: "Question", minWidth: 170 },
    { id: "type", label: "Type", minWidth: 100 },
    {
      id: "createdAt",
      label: "Created At",
      minWidth: 100,
      format: (value) =>
        new Date(value).toLocaleString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
    },
    {
      id: "modifyAt",
      label: "Modify At",
      minWidth: 100,
      format: (value) =>
        new Date(value).toLocaleString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
    },
    {
      id: "actions",
      label: "Actions",
      width: 178,
      align: "right",
      format: (value, record) => (
        <div>
          <Button
            onClick={() => {
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
            onClick={() => {
              setSurveyItem(record)
              setOpenDeleteDialog(true)
            }}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ]

  const querySurveyList = async () => {
    // fetch survey list
    try {
      const { code, data, message } = await axiosInstance.get(
        "/api/survey/surveyList",
        { page: page + 1, pageSize: rowsPerPage }
      )
      if (code !== 200) {
        showAlert(message, "info", 2000)
        return
      }
      setSurveyList(data.surveyList)
      setTotal(data.total)
    } catch (error) {
      showAlert(`Server Error: ${error}`, "info", 2000)
    }
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  const handleDeleteSurvey = async () => {
    try {
      const { code, message } = await axiosInstance.post(
        "/api/survey/deleteSurvey",
        { _id: surveyItem._id }
      )
      if (code !== 200) {
        showAlert(message, "info", 2000)
        return
      }
      querySurveyList()
      setOpenDeleteDialog(false)
      showAlert("Survey deleted successfully", "success", 2000)
    } catch (error) {
      showAlert(`Server Error: ${error}`, "info", 2000)
    }
  }

  useEffect(() => {
    querySurveyList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage])

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <div className="button-wrapper">
        <Button
          variant="contained"
          onClick={() => {
            setSurveyItem(initialSurvey)
            setOpenDialog(true)
          }}
        >
          Add
        </Button>
      </div>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  style={{ minWidth: column.minWidth, width: column.width }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {surveyList.map((row, idx) => {
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
        count={total}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <DialogModal
        querySurveyList={querySurveyList}
        open={openDialog}
        handleClose={() => setOpenDialog(false)}
        survey={surveyItem}
      />
      <DeleteDialog
        open={openDeleteDialog}
        handleClose={() => setOpenDeleteDialog(false)}
        handleDelete={() => handleDeleteSurvey()}
      />
    </Paper>
  )
}

const DeleteDialog = ({ open, handleClose, handleDelete }) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Delete Survey</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete this survey? This action cannot be
          undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleDelete} color="primary" autoFocus>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default SurveyList
