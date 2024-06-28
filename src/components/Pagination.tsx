/* eslint-disable react/prop-types */
import { Box, Button, Typography } from '@mui/material';
import { styled } from '@mui/system';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

export interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ page, totalPages, onPageChange }) => {

  const handlePrevPage = () => {
    if (page > 1) {
      onPageChange(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      onPageChange(page + 1);
    }
  };

  return (
    <PaginationContainer>
      <PaginationButton disabled={page === 1} onClick={handlePrevPage}>
        <ArrowBackIosIcon sx={{ color: page === 1 ? 'grey' : '#EA3636' }} />
      </PaginationButton>
      <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '1.2rem', margin: '0 10px', display: 'flex', alignItems: 'center', color: '#fef445' }}>
        {page}
      </Typography>
      <PaginationButton disabled={page === totalPages} onClick={handleNextPage}>
        <ArrowForwardIosIcon sx={{ color: page === totalPages ? 'grey' : '#EA3636' }} />
      </PaginationButton>
    </PaginationContainer>
  );
};

const PaginationContainer = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
`;

const PaginationButton = styled(Button)`
  min-width: 40px;
  height: 40px;
  margin: 0 10px;
`;

export default Pagination;
