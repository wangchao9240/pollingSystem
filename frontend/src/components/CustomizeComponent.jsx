import {
  Button,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  styled,
  TextField,
  FormControl,
} from "@mui/material"

// Table components
export const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  maxHeight: 440,
}));

export const StyledTable = styled(Table)(({ theme }) => ({
  borderCollapse: 'separate',
  borderSpacing: '0',
}));

export const StyledTableHead = styled(TableHead)(({ theme }) => ({
  '& .MuiTableCell-head': {
    backgroundColor: '#e5e7eb',
    fontWeight: 600,
    fontSize: '1rem',
  }
}));

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: '#f9fafb',
  },
}));

// Button components
export const ActionButton = styled(Button)({
  borderRadius: '20px',
  textTransform: 'none',
  fontSize: '0.9rem',
  padding: '5px 15px',
  border: '1px solid #e0e0e0',
});

export const SearchButton = styled(Button)({
  borderRadius: '8px',
  padding: '10px 24px',
  textTransform: 'none',
  fontSize: '1rem',
});

export const AddButton = styled(Button)({
  borderRadius: '8px',
  padding: '10px 24px',
  textTransform: 'none',
  fontSize: '1rem',
  backgroundColor: '#f1f5f9',
  color: '#000',
  '&:hover': {
    backgroundColor: '#e2e8f0',
  }
});

// Form components
export const SearchContainer = styled('div')({
  display: 'flex',
  margin: '24px 0',
  alignItems: 'center',
  justifyContent: 'space-between', // 用于左右布局分组
});

// 添加新的左侧输入框容器组件
export const SearchInputGroup = styled('div')({
  display: 'flex',
  gap: '16px',
  flex: '1',
  maxWidth: '70%', // 控制左侧整体宽度
});

// 添加右侧按钮容器组件
export const SearchButtonGroup = styled('div')({
  display: 'flex',
  gap: '16px',
});

// 修改输入框样式，使其等宽
export const SearchField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
  },
  flex: '1', // 使所有输入框平分可用空间
  maxWidth: '33%', // 确保三个输入框最多占用等量宽度
});

export const StatusSelect = styled(FormControl)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
  },
  flex: '1', // 使所有输入框平分可用空间
  maxWidth: '33%', // 确保三个输入框最多占用等量宽度
});