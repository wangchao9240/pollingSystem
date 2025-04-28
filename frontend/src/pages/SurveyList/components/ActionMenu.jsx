import React from 'react';
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import DeleteIcon from '@mui/icons-material/Delete';
import { StyledMenu, StyledMenuItem } from "../../../components/CustomizeComponent";

const ActionMenu = ({ 
  anchorEl, 
  open, 
  onClose,
  onEdit,
  onCopyLink,
  onViewResult,
  onDelete
}) => {
  return (
    <StyledMenu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      elevation={3}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      <StyledMenuItem 
        onClick={onEdit}
        className="action-menu-item"
      >
        <EditIcon />
        <span>Edit</span>
      </StyledMenuItem>
      <StyledMenuItem onClick={onCopyLink} className="action-menu-item">
        <ContentCopyIcon fontSize="small" />
        <span>Copy Link</span>
      </StyledMenuItem>
      <StyledMenuItem onClick={onViewResult} className="action-menu-item">
        <EqualizerIcon fontSize="small" />
        <span>Result</span>
      </StyledMenuItem>
      <StyledMenuItem onClick={onDelete} className="action-menu-item">
        <DeleteIcon fontSize="small" />
        <span>Delete</span>
      </StyledMenuItem>
    </StyledMenu>
  );
}

export default React.memo(ActionMenu);