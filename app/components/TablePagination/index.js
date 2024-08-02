import React from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import PropTypes from 'prop-types';

const TablePagination = ({ data, dataToShowOnPage, setCurrentPage, page }) => {
  const totalTickets = data?.count || 0;
  const totalPages = Math.ceil(totalTickets / dataToShowOnPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <div className="pagination flex items-center justify-end py-3">
      <Stack spacing={2}>
        <Pagination
          disableElevation
          disableRipple
          page={page}
          count={totalPages}
          variant="outlined"
          shape="rounded"
          onChange={handlePageChange}
        />
      </Stack>
    </div>
  );
};

TablePagination.propTypes = {
  data: PropTypes.object.isRequired,
  dataToShowOnPage: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  setCurrentPage: PropTypes.func.isRequired,
};

export default TablePagination;
