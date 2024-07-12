import { FC, useEffect, useState, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Typography, CircularProgress } from '@mui/material';
import styled from 'styled-components';
import { getCurrentTime, getEnergy, getId, getInfo, getTime } from '../store/app/selectors';
import { fetchInfo, getTap } from '../store/app/async-actions';
import { processEnergy } from '../helpers';
import usePreloadImages from '../hooks/usePreloadImages'; // Assuming this is a custom hook for image preloading

import imgg from '../images/mainPage/Character.webp';
import fullimage from '../images/mainPage/energy/0energy.png';

const formatTime = (seconds: number) => {
  if (seconds <= 0) {
    return '00:00:00'; // Либо любое другое значение, которое вы хотите отображать, когда время истекло
  }

  const absSeconds = Math.abs(seconds);
  const hours = Math.floor(absSeconds / 3600).toString().padStart(2, '0');
  const minutes = Math.floor((absSeconds % 3600) / 60).toString().padStart(2, '0');
  const secs = (absSeconds % 60).toString().padStart(2, '0'); // Правильное форматирование секунд

  return `${hours}:${minutes}:${secs}`;
};

export const TapPage: FC = () => {
  const dispatch = useDispatch();
  const tg_id = useSelector(getId);
  const energy = useSelector(getEnergy);
  const data = useSelector(getInfo);
  const time = useSelector(getTime) || 0;
  const serverCurrentTime = useSelector(getCurrentTime);
  const [isClicked, setIsClicked] = useState(false);
  const [energyImage, setEnergyImage] = useState(fullimage);
  const [equippedImages, setEquippedImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true); 

  const [currentTime, setCurrentTime] = useState<number>(0); // Изначально установите в 0

  const energyHandled = useMemo(() => energy ? processEnergy(energy) : 0, [energy]);

  const getEnergyImagePath = useCallback(async (energyHandled: number) => {
    try {
      const module = await import(`../images/mainPage/energy/${energyHandled}energy.png`);
      return module.default;
    } catch (error) {
      console.error('Image loading failed:', error);
      return '../images/mainPage/energy/0energy.png';
    }
  }, []);

  const getEquippedImagePath = useCallback(async (fileName: string) => {
    try {
      const module = await import(`../images/mainPage/startItemsForMainPage/${fileName}.webp`);
      return module.default;
    } catch (error) {
      console.error('Image loading failed:', error);
      return '';
    }
  }, []);

  useEffect(() => {
    const fetchData = () => {
      if (tg_id) {
        dispatch(fetchInfo(tg_id));
      }
    };

    fetchData(); // Запрашиваем данные при первой загрузке

    const interval = setInterval(fetchData, 180000); // Устанавливаем интервал на 3 минуты

    return () => clearInterval(interval); // Очищаем интервал при размонтировании компонента
  }, [dispatch, tg_id]);

  // Preload images on component mount
  useEffect(() => {
    const preloadImages = async () => {
      try {
        const imagePaths = await Promise.all(
          Array.from({ length: 21 }, (_, i) =>
            import(`../images/mainPage/energy/${i}energy.png`).then(module => module.default)
          )
        );
        usePreloadImages([imgg, ...imagePaths]);
        setLoading(false);
      } catch (error) {
        console.error('Failed to preload images:', error);
        setLoading(false);
      }
    };

    preloadImages();
  }, []);

  useEffect(() => {
    // Установите текущее время с сервера
    const initialCurrentTime = Date.now() / 1000; // Текущее время на клиенте в секундах
    const serverTimeDifference = initialCurrentTime - serverCurrentTime;
    setCurrentTime(serverCurrentTime + serverTimeDifference);

    const interval = setInterval(() => {
      setCurrentTime(currentTime => currentTime + 1); // Обновляем каждую секунду
    }, 1000);

    return () => clearInterval(interval);
  }, [serverCurrentTime]);

  // Set energy image when energy changes
  useEffect(() => {
    const updateEnergyImage = () => {
      getEnergyImagePath(energyHandled).then(imagePath => setEnergyImage(imagePath));
    };

    updateEnergyImage(); // Обновляем изображение при первой загрузке

    const interval = setInterval(updateEnergyImage, 180000); // Устанавливаем интервал на 3 минуты

    return () => clearInterval(interval); // Очищаем интервал при размонтировании компонента
  }, [energy, energyHandled, getEnergyImagePath]);

  // Load equipped images when data changes
  useEffect(() => {
    const loadEquippedImages = async () => {
      if (data?.equipped) {
        const images = await Promise.all(
          data.equipped.map(async (fileName) => {
            const url = await getEquippedImagePath(fileName);
            return {
              url,
              zIndex: fileName.includes('head') ? 0 : 1,
            };
          })
        );
        setEquippedImages(images);
      }
    };
    loadEquippedImages();
  }, [data, getEquippedImagePath]);

  // Handle click event
  const handleClick = useCallback(() => {
    if (energy !== 0) {
      dispatch(getTap(tg_id));
      setIsClicked(true);
      setTimeout(() => {
        setIsClicked(false);
      }, 100);
    }
  }, [energy, tg_id, dispatch]);

  // Вычисляем оставшееся время в секундах
  const remainingSeconds = Math.max(time - Math.floor(currentTime), 0);
  console.log(time, currentTime, remainingSeconds);

  if (loading) {
    return (
      <LoadingContainer>
        <CircularProgress sx={{ color: '#EA3636' }} />
      </LoadingContainer>
    );
  }

  return (
    <MainContainer>
      <Container className={isClicked ? 'clicked' : ''}>
        <OverlayContainer>
          <CharacterImage src={imgg} />
          {equippedImages.map((image, index) => (
            <OverlayImage key={index} src={image.url} zIndex={image.zIndex} />
          ))}
        </OverlayContainer>
        <CenteredButton onClick={handleClick}></CenteredButton>
      </Container>
      <TextContainer>
        <Typography
          sx={{
            color: 'FFED45',
            fontWeight: '1000',
            alignContent: 'start',
            textAlign: 'center',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            fontFamily: 'Open Sans, sans-serif',
            fontStyle: 'normal',
            fontVariant: 'normal',
            lineHeight: 'unset',
            fontSize: 'calc(11px + 1vw)',
            fontStretch: 'semi-condensed',
          }}
        >
          ЭНЕРГИЯ
        </Typography>
        <Typography
          sx={{
            color: 'FFFFFF',
            fontWeight: '1000',
            paddingLeft: '1vw',
            alignContent: 'start',
            textAlign: 'center',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            fontFamily: 'Open Sans, sans-serif',
            fontStyle: 'normal',
            fontVariant: 'normal',
            lineHeight: 'unset',
            fontSize: 'calc(11px + 1vw)',
            fontStretch: 'semi-condensed',
          }}
        >
          {energy}/100
        </Typography>
        <Typography
          sx={{
            color: 'FFFFFF',
            fontWeight: '1000',
            paddingLeft: '35vw',
            alignContent: 'start',
            textAlign: 'center',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            fontFamily: 'Open Sans, sans-serif',
            fontStyle: 'normal',
            fontVariant: 'normal',
            lineHeight: 'unset',
            fontSize: 'calc(11px + 1vw)',
            fontStretch: 'semi-condensed',
          }}
        >
          {formatTime(remainingSeconds)}
        </Typography>
      </TextContainer>
      <EnergyContainer>
        <EnergyImage src={energyImage} />
      </EnergyContainer>
    </MainContainer>
  );
};

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  border: none;
  outline: none;
  box-shadow: none;
`;

const Container = styled.div`
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  transition: transform 0.01s ease-in-out;
  border: none;
  outline: none;
  box-shadow: none;

  &.clicked {
    img {
      transform: scale(0.95);
      border: none;
      outline: none;
      box-shadow: none;
    }
  }
`;

const OverlayContainer = styled.div`
  position: relative;
  width: 170%;
  height: 170%;
`;

const CharacterImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.01s ease-in-out;
  border: none;
  outline: none;
  box-shadow: none;
`;

const OverlayImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.01s ease-in-out;
  border: none;
  outline: none;
  box-shadow: none;
  pointer-events: none; /* To ensure the images don't interfere with click events */
  z-index: ${(props) => props.zIndex}; /* Use zIndex prop */
`;

const CenteredButton = styled.button`
  position: absolute;
  top: 46%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60vw;
  height: 60vh;
  background-color: transparent;
  border: none;
  border-radius: 50%;
  font-size: 1.5em;
  display: flex;
  justify-content: center;
  align-items: center;
  
  /* Prevent the flickering black background on click */
  &:focus, &:active, &:hover, &:visited {
    outline: none;
    border: none;
    background-color: transparent;
  }

  /* Prevent flickering on mobile devices */
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  user-select: none;
`;

const EnergyContainer = styled.div`
  position: absolute;
  top: 79vh;
  left: 2vh;
  width: 95%;
`;

const EnergyImage = styled.img`
  width: 100%;
  height: 6vh;
  object-fit: cover;
`;

const TextContainer = styled.div`
  position: absolute;
  display: flex;
  width: 100%;
  padding-left: 16vw;
  top: 76vh;
  margin: 0 5vw;
;`