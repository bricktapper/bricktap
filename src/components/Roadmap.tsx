import { FC, useState } from 'react';
import styled, { css } from 'styled-components';
import roadmap from '../images/mainPage/roadd.webp';
import CircularProgress from '@mui/material/CircularProgress';
import usePreloadImages from '../hooks/usePreloadImages';

export const Roadmap: FC = () => {
  const [loading, setLoading] = useState(true);
  const imagesToPreload = [roadmap];
  usePreloadImages(imagesToPreload);

  const handleImageLoad = () => {
    setLoading(false);
  };

  return (
    <MainContainer>
      {loading && (
        <LoadingContainer>
          <CircularProgress sx={{ color: '#EA3636'}} />
        </LoadingContainer>
      )}
      <StyledRoadmapImage src={roadmap} onLoad={handleImageLoad} loading={loading} />
    </MainContainer>
  );
};

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  position: relative; /* Добавляем позиционирование, чтобы правильно разместить индикатор загрузки */
`;

const StyledRoadmapImage = styled.img<{ loading: boolean }>`
  width: 100%;
  height: 100vh;
  object-fit: contain;
  transition: opacity 0.3s ease-in-out; /* Анимация плавного появления */
  border: none;
  outline: none;
  box-shadow: none;
  opacity: ${({ loading }) => (loading ? '0' : '1')}; /* Условная прозрачность */
  scale: 0.9
`;

const LoadingContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

