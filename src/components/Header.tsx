import { FC, useEffect, useMemo, useCallback, Suspense } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { AppBar, Toolbar, Container, Box, Typography } from '@mui/material';

import { fetchInfo } from '../store/app/async-actions';
import { getInfo, getId, getBalance } from '../store/app/selectors';

import headerBlockImage from '../images/mainPage/headerBlock2.png';
import usePreloadImages from '../hooks/usePreloadImages';

export const Header: FC = () => {
  const dispatch = useDispatch();
  const tg_id = useSelector(getId);
  const balance = useSelector(getBalance);
  const data = useSelector(getInfo);

  const nickHandled = useMemo(() => {
    return data?.nick && data.nick.split(' ')[0].length > 10 ? `${data.nick.slice(0, 10)}...` : data.nick?.split(' ')[0];
  }, [data?.nick]);

  const imagesToPreload = useMemo(() => [headerBlockImage], []);

  usePreloadImages(imagesToPreload);

  useEffect(() => {
    if (tg_id) {
      dispatch(fetchInfo(tg_id));
    }
  }, [tg_id]);

  const renderInfoBox = useCallback(
    (item: { text: string; bottomText: string | undefined }, index: number) => (
      <Box
        key={index}
        sx={{
          flexGrow: 1,
          mx: '-1%',
          p: '0.6rem',
          textAlign: 'center',
          position: 'relative',
          height: '10vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          backgroundImage: `url(${headerBlockImage})`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          color: 'white',
          overflow: 'hidden',
          width: 'calc(100% - 2%)',
        }}
      >
        <Box sx={{ position: 'absolute', top: '67%', left: '50%', transform: 'translate(-50%, -50%)', width: '80%', alignItems: 'center' }}>
          <Typography
            sx={{
              color: '#2B2B2B',
              fontWeight: '1000',
              width: '100%',
              alignContent: 'center',
              textAlign: 'center',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              fontFamily: 'Open Sans, sans-serif',
              fontStyle: 'normal',
              fontVariant: 'normal',
              fontSize: 'calc(10px + 1vw)',
              lineHeight: 'unset',
              paddingTop: '1vh',
            }}
          >
            {item.text}
          </Typography>
          <Typography
            sx={{
              color: '#EA3636',
              fontWeight: '1000',
              width: '100%',
              alignContent: 'center',
              textAlign: 'center',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              fontFamily: 'Open Sans, sans-serif',
              fontStyle: 'normal',
              fontVariant: 'normal',
              lineHeight: 'unset',
              fontSize: item.text === 'НИКНЕЙМ' ? 'calc(11px + 1vw)' : 'calc(16px + 1vw)',
            }}
          >
            {item.bottomText}
          </Typography>
        </Box>
      </Box>
    ),
    []
  );

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AppBar position="fixed" sx={{ backgroundColor: '#151515', boxShadow: 'none', paddingTop: '1vh', paddingBottom: '2vh',  zIndex: 1500, top: '-2vh' }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '10vh' }}>
              {[
                { text: 'НИКНЕЙМ', bottomText: nickHandled },
                { text: 'БАЛАНС', bottomText: balance?.toString() },
                { text: 'СИЛА ТАПА', bottomText: data?.damage?.toString() }
              ].map((item, index) => renderInfoBox(item, index))}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </Suspense>
  );
};

