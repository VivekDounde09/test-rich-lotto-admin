import * as React from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { PropTypes } from 'prop-types';

const ArrayPagination = ({
  dataToShowOnPage,
  currentPage,
  setCurrentPage,
  array,
}) => {
  const totalTickets = array.length;
  const totalPages = Math.ceil(totalTickets / dataToShowOnPage);
  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="pagination flex items-center justify-end py-3">
      <Stack spacing={2}>
        <Pagination
          disableElevation
          disableRipple
          count={totalPages}
          page={currentPage}
          onChange={handleChangePage}
          variant="outlined"
          shape="rounded"
        />
      </Stack>
    </div>
  );
};

ArrayPagination.propTypes = {
  dataToShowOnPage: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  setCurrentPage: PropTypes.func.isRequired,
  array: PropTypes.array.isRequired,
};

export default ArrayPagination;
