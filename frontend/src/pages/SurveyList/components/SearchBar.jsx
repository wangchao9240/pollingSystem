import React from 'react';
import {
  MenuItem, 
  Select
} from "@mui/material";
import {
  SearchContainer,
  SearchField,
  StatusSelect,
  SearchButton,
  AddButton,
  SearchInputGroup,
  SearchButtonGroup,
  DateField,
} from "../../../components/CustomizeComponent";

const SearchBar = ({ 
  searchParams, 
  handleSearchChange, 
  querySurveyList, 
  resetSearch, 
  openAddDialog 
}) => {
  return (
    <SearchContainer>
      <SearchInputGroup>
        <SearchField 
          placeholder="Please input survey title" 
          size="small"
          value={searchParams.title}
          onChange={(e) => handleSearchChange('title', e.target.value)}
          InputProps={{
            style: { color: '#111827' }
          }}
        />
        <StatusSelect size="small">
          <Select
            labelId="status-select-label"
            displayEmpty
            value={searchParams.status}
            onChange={(e) => handleSearchChange('status', e.target.value)}
            renderValue={(selected) => {
              if (selected === '') {
                return 'Please select status';
              }
              return selected === 1 ? 'Active' : 'Inactive';
            }}
            sx={{
              color: '#111827',
              '& .MuiSelect-select': {
                color: searchParams.status === '' ? '#9ca3af' : '#111827',
              }
            }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value={1}>Active</MenuItem>
            <MenuItem value={0}>Inactive</MenuItem>
          </Select>
        </StatusSelect>
        
        <DateField 
          placeholder="Please select date"
          type="date"
          size="small"
          InputLabelProps={{ 
            shrink: true 
          }}
          value={searchParams.date || ''}
          onChange={(e) => handleSearchChange('date', e.target.value)}
          inputProps={{
            style: { color: searchParams.date ? '#111827' : '#9ca3af' }
          }}
        />
      </SearchInputGroup>

      <SearchButtonGroup>
        <SearchButton 
          variant="contained" 
          className="search-btn"
          onClick={querySurveyList}
        >
          Search
        </SearchButton>
        <SearchButton 
          variant="contained" 
          className="reset-btn"
          onClick={resetSearch}
        >
          Reset
        </SearchButton>
        <AddButton
          onClick={openAddDialog}
        >
          Add
        </AddButton>
      </SearchButtonGroup>
    </SearchContainer>
  );
}

export default React.memo(SearchBar);