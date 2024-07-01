import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Box, Typography, CircularProgress } from '@mui/material';
import styled from 'styled-components';

import { fetchFriendsInfo } from '../store/app/async-actions';
import { getFriends, getId, getFriendsLS, getFriendsError } from '../store/app/selectors';

import { LoadingStates } from '../const';

interface Friend {
  nickname: string;
  profit: string;
}

export const FriendsPage: FC = () => {
  const dispatch = useDispatch();
  const tg_id = useSelector(getId);
  const data = useSelector(getFriends);
  const ls = useSelector(getFriendsLS);
  const error = useSelector(getFriendsError);
  const [page, setPage] = useState(1);
  const totalPages = data?.friends?.total_pages || 1;

  const [buttonText, setButtonText] = useState('Скопировать ссылку');
  const [isActive, setIsActive] = useState(false);

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setButtonText('Скопировано!');
      setIsActive(true);
      setTimeout(() => {
        setButtonText('Скопировать ссылку');
        setIsActive(false);
      }, 3000);
    } catch (error) {
      console.error('Не удалось скопировать текст с помощью API Clipboard: ', error);
      try {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "absolute";
        textArea.style.left = "-999999px";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
        setButtonText('Скопировано!');
        setIsActive(true);
        setTimeout(() => {
          setButtonText('Скопировать ссылку');
          setIsActive(false);
        }, 3000);
      } catch (innerError) {
        console.error('Не удалось скопировать текст с помощью document.execCommand: ', innerError);
        setButtonText('Не удалось скопировать текст');
        setIsActive(true);
        setTimeout(() => {
          setButtonText('Скопировать ссылку');
          setIsActive(false);
        }, 3000);
      }
    }
  }, []);

  useEffect(() => {
    dispatch(fetchFriendsInfo(tg_id, page));
  }, [dispatch, tg_id, page]);

  const friendsContent = useMemo(() => (
    data?.friends?.content?.map((friend: Friend, index: number) => (
      <OneFriendEllipse key={index}>
        <Typography sx={friendTextStyle}>{friend.nickname}</Typography>
        <Typography sx={friendTextStyle}>{friend.profit}</Typography>
      </OneFriendEllipse>
    ))
  ), [data]);

  return (
    <MainContainer>
      <URLEllipse>
        <SaleTextContainer>За каждого приглашенного друга вы получите вознаграждение в размере 300 $BRICK +10% от его заработка в игре</SaleTextContainer>
        <CopyLinkButton className={isActive ? 'active' : ''} onClick={() => copyToClipboard(data?.url)}>
          {buttonText}
        </CopyLinkButton>
      </URLEllipse>
      {ls === LoadingStates.SUCCEEDED && (
        <>
          <TotalFriendsEllipse>
            <Typography sx={friendTextStyle}>Приглашено друзей:</Typography>
            <Typography sx={friendTextStyle}>{data?.total_friends}</Typography>
          </TotalFriendsEllipse>
          <FriendsContainer>
            {friendsContent}
          </FriendsContainer>
        </>
      )}
      
      {ls === LoadingStates.LOADING && (
        <FriendsContainer>
          <CircularProgress sx={{ color: '#EA3636'}}/>
        </FriendsContainer>
      )}

      {ls === LoadingStates.FAILED && (
        <TotalFriendsEllipse>
          <Typography sx={friendTextStyle}>{error}</Typography>
        </TotalFriendsEllipse>
      )}
    </MainContainer>
  );
};

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh; /* Минимальная высота контейнера, чтобы занимал всю высоту экрана */
  padding-top: 15vh; /* Отступ сверху, чтобы контент не налезал на хедер */
  padding-bottom: 15vh; /* Отступ снизу, чтобы контент не налезал на футер */
`;

const FriendsContainer = styled.div`
  margin-top: 20px;
`;

const URLEllipse = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 89vw;
  height: 20vh;
  background-color: #fef445;
  border-radius: 3vh;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const TotalFriendsEllipse = styled(Box)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 89vw;
  height: 6vh;
  margin-top: 2vh;
  background-color: #fef445;
  border-radius: 2vh;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const OneFriendEllipse = styled(Box)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 89vw;
  height: 6vh;
  margin-top: 2vh;
  background-color: #fef445;
  border-radius: 2vh;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const SaleTextContainer = styled(Box)`
  max-width: 100%;
  text-align: center;
  font-weight: 1000;
  align-content: start;
  font-family: 'Open Sans', sans-serif;
  font-style: normal;
  font-variant: normal;
  line-height: unset;
  font-size: calc(11px + 1vw);
  font-stretch: semi-condensed;
`;

const CopyLinkButton = styled(Box)`
  max-width: 100%;
  margin-top: 3vh;
  border: 2px solid #000;
  border-radius: 10px;
  text-align: center;
  font-weight: 1000;
  align-content: start;
  font-family: 'Open Sans', sans-serif;
  font-style: normal;
  font-variant: normal;
  line-height: unset;
  font-size: calc(11px + 1vw);
  font-stretch: semi-condensed;
  padding: 12px;
`;

const friendTextStyle = {
  color: 'black',
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
  paddingLeft: '4vw',
  paddingRight: '4vw',
};

