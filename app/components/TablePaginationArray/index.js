import * as React from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { PropTypes } from 'prop-types';

const TablePaginationArray = ({
  data,
  dataToShowOnPage,
  currentPage,
  setCurrentPage,
}) => {
  const totalTickets = data?.count || 0;
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

TablePaginationArray.propTypes = {
  data: PropTypes.object.isRequired,
  dataToShowOnPage: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  setCurrentPage: PropTypes.func.isRequired,
};

export default TablePaginationArray;
