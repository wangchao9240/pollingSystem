import {
  Button,
  Dialog,
  Paper,
  TableBody,
  TableCell,
  TablePagination,
  TableRow,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Menu,
  MenuItem,
  IconButton,
  Select,
  InputLabel,
} from "@mui/material"
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import DeleteIcon from '@mui/icons-material/Delete';
import { useEffect, useState } from "react"
import DialogModal from "./dialogModal"
import axiosInstance from "../../axiosConfig"
import ResultDialog from "./resultDialog"
import {
  StyledTableContainer,
  StyledTable,
  StyledTableHead,
  StyledTableRow,
  ActionButton,
  SearchContainer,
  SearchField,
  StatusSelect,
  SearchButton,
  AddButton,
  SearchInputGroup,
  SearchButtonGroup,
} from "../../components/CustomizeComponent"

import "./index.css"

const initialSurvey = {
  title: "",
  surveyStatus: 0,
  questions: [],
}

const SurveyList = () => {
  const [surveyList, setSurveyList] = useState([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [total, setTotal] = useState(0)
  const [openDialog, setOpenDialog] = useState(false)
  const [surveyItem, setSurveyItem] = useState({})
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [openResultDialog, setOpenResultDialog] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleMenuOpen = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
    setSurveyItem(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const columns = [
    { id: "title", label: "Survey Title", minWidth: 200 },
    { id: "completeCount", label: "Complete Count", minWidth: 150 },
    {
      id: "surveyStatus",
      label: "Status",
      minWidth: 120,
      format: (value) => {
        if (value === 0) return "Inactive"
        if (value === 1) return "Active"
        else return "--"
      },
    },
    {
      id: "modifyAt",
      label: "modifyAt",
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
      id: "createdAt",
      label: "createdAt",
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
      label: "Action",
      minWidth: 120,
      align: "center",
      format: (value, record) => (
        <div>
          <IconButton
            aria-label="more"
            onClick={(e) => handleMenuOpen(e, record)}
            >
            <ActionButton>Action</ActionButton>
            {/* <MoreVertIcon /> */}
          </IconButton>
        </div>
      ),
    },
  ]

  const querySurveyList = async () => {
    try {
      const { code, data, message } = await axiosInstance.get(
        "/api/survey/surveyList",
        {
          params: { page: page + 1, pageSize: rowsPerPage },
        }
      )
      if (code !== 200) {
        window.$toast(message, "info", 2000)
        return
      }
      setSurveyList(data.surveyList)
      setTotal(data.total)
    } catch (error) {
      window.$toast(`Server Error: ${error}`, "info", 2000)
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
        window.$toast(message, "info", 2000)
        return
      }
      querySurveyList()
      setOpenDeleteDialog(false)
      handleMenuClose();
      window.$toast("Survey deleted successfully", "success", 2000)
    } catch (error) {
      window.$toast(`Server Error: ${error}`, "info", 2000)
    }
  }
  
  const handleCopyLink = (record) => {
    try {
      navigator.clipboard.writeText(
        `${window.location.origin}/survey?id=${record._id}`
      )
      window.$toast("Link copied to clipboard", "success", 2000)
    } catch (error) {
      const tempInput = document.createElement("input")
      tempInput.value = `${window.location.origin}/survey?id=${record._id}`
      document.body.appendChild(tempInput)
      tempInput.select()
      document.execCommand("copy")
      document.body.removeChild(tempInput)
      window.$toast("Link copied to clipboard", "success", 2000)
    }
    handleMenuClose();
  }

  useEffect(() => {
    querySurveyList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage])

  return (
    <Paper sx={{ width: "100%", overflow: "hidden", padding: 2 }}>
      <SearchContainer>
        {/* 左侧三个输入框分组 */}
        <SearchInputGroup>
          <SearchField 
            placeholder="Please input survey title" 
            size="small"
          />
          <StatusSelect size="small">
            <InputLabel>Please select status</InputLabel>
            <Select
              label="Please select status"
              value=""
            >
              <MenuItem value={1}>Active</MenuItem>
              <MenuItem value={0}>Inactive</MenuItem>
            </Select>
          </StatusSelect>
          <SearchField 
            placeholder="Please select date" 
            size="small" 
            type="date"
            InputLabelProps={{ shrink: true }}
          />
        </SearchInputGroup>

        {/* 右侧两个按钮分组 */}
        <SearchButtonGroup>
          <SearchButton variant="contained">Search</SearchButton>
          <AddButton
            onClick={() => {
              setSurveyItem(initialSurvey)
              setOpenDialog(true)
            }}
          >
            Add
          </AddButton>
        </SearchButtonGroup>
      </SearchContainer>
      
      <StyledTableContainer>
        <StyledTable stickyHeader aria-label="sticky table">
          <StyledTableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align || "left"}
                  style={{ minWidth: column.minWidth, width: column.width }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {surveyList.map((row, idx) => {
              return (
                <StyledTableRow hover role="checkbox" tabIndex={-1} key={idx}>
                  {columns.map((column) => {
                    const value = row[column.id]
                    return (
                      <TableCell key={column.id} align={column.align || "left"}>
                        {column.format ? column.format(value, row) : value}
                      </TableCell>
                    )
                  })}
                </StyledTableRow>
              )
            })}
          </TableBody>
        </StyledTable>
      </StyledTableContainer>
      
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={total}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelDisplayedRows={({ from, to, count }) => `${from}–${to} of ${count}`}
        labelRowsPerPage="Rows per page:"
      />
      
      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {
          setOpenDialog(true);
          handleMenuClose();
        }}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={() => handleCopyLink(selectedRow)}>
          <ContentCopyIcon fontSize="small" sx={{ mr: 1 }} />
          Copy Link
        </MenuItem>
        <MenuItem onClick={() => {
          setOpenResultDialog(true);
          handleMenuClose();
        }}>
          <EqualizerIcon fontSize="small" sx={{ mr: 1 }} />
          Result
        </MenuItem>
        <MenuItem onClick={() => {
          setOpenDeleteDialog(true);
          handleMenuClose();
        }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>
      
      <DialogModal
        querySurveyList={querySurveyList}
        open={openDialog}
        handleClose={() => {
          setOpenDialog(false)
          setSurveyItem(initialSurvey)
        }}
        survey={surveyItem}
      />
      <DeleteDialog
        open={openDeleteDialog}
        handleClose={() => setOpenDeleteDialog(false)}
        handleDelete={() => handleDeleteSurvey()}
      />
      <ResultDialog
        open={openResultDialog}
        handleClose={() => setOpenResultDialog(false)}
        survey={surveyItem}
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
