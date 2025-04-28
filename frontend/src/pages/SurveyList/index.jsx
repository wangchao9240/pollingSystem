import {
  Paper,
  TablePagination,
} from "@mui/material";
import { useEffect, useState, useCallback } from "react";
import DialogModal from "./dialogModal";
import axiosInstance from "../../axiosConfig";
import ResultDialog from "./resultDialog";
import { ActionButton } from "../../components/CustomizeComponent";
import SearchBar from "./components/SearchBar";
import ActionMenu from "./components/ActionMenu";
import DeleteDialog from "./components/DeleteDialog";
import SurveyTable from "./components/SurveyTable";

import "./index.css";

const initialSurvey = {
  title: "",
  surveyStatus: 0,
  questions: [],
};

const SurveyList = () => {
  const [surveyList, setSurveyList] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [surveyItem, setSurveyItem] = useState({});
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openResultDialog, setOpenResultDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  // Use a single state object to manage all query conditions
  const [searchParams, setSearchParams] = useState({
    title: '',
    status: '',
    date: ''
  });

  // Add form input state separate from search params
  const [formInputs, setFormInputs] = useState({
    title: '',
    status: '',
    date: ''
  });

  // Use useCallback to optimize function dependencies
  const querySurveyList = useCallback(async () => {
    try {
      // Basic pagination parameters
      const params = { 
        page: page + 1, 
        pageSize: rowsPerPage 
      };
      
      // Use object destructuring and filtering to simplify condition addition
      const { title, status, date } = searchParams;
      
      if (title) params.title = title;
      if (status !== '') params.status = status;
      if (date) params.date = date;
      
      const { code, data, message } = await axiosInstance.get(
        "/api/survey/surveyList",
        { params }
      );
      
      if (code !== 200) {
        window.$toast(message, "info", 2000);
        return;
      }
      
      setSurveyList(data.surveyList);
      setTotal(data.total);
    } catch (error) {
      window.$toast(`Server Error: ${error}`, "info", 2000);
    }
  }, [page, rowsPerPage, searchParams]);

  // Handle search parameter change function
  const handleSearchChange = useCallback((field, value) => {
    setFormInputs(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  // Add function to trigger search with form inputs
  const handleSearch = useCallback(() => {
    setSearchParams(formInputs);
    setPage(0);
  }, [formInputs]);

  // Reset search conditions
  const resetSearch = useCallback(() => {
    const emptyState = {
      title: '',
      status: '',
      date: ''
    };
    
    setFormInputs(emptyState);
    setSearchParams(emptyState);
    setPage(0);
    
    // No need for setTimeout anymore as we're explicitly triggering the search
    querySurveyList();
  }, [querySurveyList]);

  const handleChangePage = useCallback((event, newPage) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback((event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  }, []);

  const handleDeleteSurvey = useCallback(async () => {
    try {
      const { code, message } = await axiosInstance.post(
        "/api/survey/deleteSurvey",
        { _id: surveyItem._id }
      );
      if (code !== 200) {
        window.$toast(message, "info", 2000);
        return;
      }
      querySurveyList();
      setOpenDeleteDialog(false);
      handleMenuClose();
      window.$toast("Survey deleted successfully", "success", 2000);
    } catch (error) {
      window.$toast(`Server Error: ${error}`, "info", 2000);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [querySurveyList, surveyItem]);
  
  const handleCopyLink = useCallback((record) => {
    try {
      navigator.clipboard.writeText(
        `${window.location.origin}/survey?id=${record._id}`
      );
      window.$toast("Link copied to clipboard", "success", 2000);
    } catch (error) {
      const tempInput = document.createElement("input");
      tempInput.value = `${window.location.origin}/survey?id=${record._id}`;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand("copy");
      document.body.removeChild(tempInput);
      window.$toast("Link copied to clipboard", "success", 2000);
    }
    handleMenuClose();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMenuOpen = useCallback((event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
    setSurveyItem(row);
  }, []);

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleDialogClose = useCallback(() => {
    setOpenDialog(false);
    setSurveyItem(initialSurvey);
  }, []);

  const columns = [
    { id: "title", label: "Survey Title", minWidth: 170 },
    { id: "completeCount", label: "Complete Count", minWidth: 100, align: "center" },
    { 
      id: "surveyStatus", 
      label: "Status", 
      minWidth: 100,
      align: "center",
      format: (value) => (value === 1 ? "Active" : "Inactive"),
    },
    {
      id: "modifyAt",
      label: "modifyAt",
      minWidth: 170,
      align: "center",
      format: (value) => value ? new Date(value).toLocaleString() : '',
    },
    {
      id: "createdAt",
      label: "createdAt",
      minWidth: 170,
      align: "center",
      format: (value) => value ? new Date(value).toLocaleString() : '',
    },
    {
      id: "actions",
      label: "Action",
      minWidth: 120,
      align: "center",
      format: (value, record) => (
        <ActionButton
          onClick={(e) => handleMenuOpen(e, record)}
        >
          Action
        </ActionButton>
      ),
    },
  ];

  useEffect(() => {
    querySurveyList();
  }, [querySurveyList]);

  return (
    <Paper sx={{ width: "100%", overflow: "hidden", padding: 2 }}>
      <SearchBar 
        searchParams={formInputs} // Pass form inputs instead of searchParams
        handleSearchChange={handleSearchChange}
        querySurveyList={handleSearch} // Use handleSearch instead of direct querySurveyList
        resetSearch={resetSearch}
        openAddDialog={() => {
          setSurveyItem(initialSurvey);
          setOpenDialog(true);
        }}
      />
      
      <SurveyTable 
        columns={columns}
        surveyList={surveyList}
      />
      
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
      
      <ActionMenu 
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        onEdit={() => {
          setOpenDialog(true);
          handleMenuClose();
        }}
        onCopyLink={() => handleCopyLink(selectedRow)}
        onViewResult={() => {
          setOpenResultDialog(true);
          handleMenuClose();
        }}
        onDelete={() => {
          setOpenDeleteDialog(true);
          handleMenuClose();
        }}
      />
      
      <DialogModal
        querySurveyList={querySurveyList}
        open={openDialog}
        handleClose={handleDialogClose}
        survey={surveyItem}
      />
      
      <DeleteDialog
        open={openDeleteDialog}
        handleClose={() => setOpenDeleteDialog(false)}
        handleDelete={handleDeleteSurvey}
      />
      
      <ResultDialog
        open={openResultDialog}
        handleClose={() => setOpenResultDialog(false)}
        survey={surveyItem}
      />
    </Paper>
  );
};

export default SurveyList;
