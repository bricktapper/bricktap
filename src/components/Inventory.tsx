import { Box, Typography, CircularProgress, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { getId, getInventoryLS, getInventoryPage, getShopLS, getShopPage, getBuyError } from '../store/app/selectors';
import { fetchGetShop, fetchBuyWardrobe, fetchGetInventory, fetchEquipWardrobe, fetchInfo } from '../store/app/async-actions';
import usePreloadImages from '../hooks/usePreloadImages';
import { InventoryPage } from '../store/types';
import { LoadingStates } from '../const';
import { TaskModal } from './TaskModal';

const getTabImagePath = async (fileName: string) => {
  try {
    const module = await import(`../images/mainPage/startItemsForInventoryPage/${fileName}.webp`);
    return module.default;
  } catch (error) {
    console.error('Image loading failed:', error);
    return '';
  }
};


const TabButton = ({ active, onClick, children }: TabButtonProps) => (
  <Button
    onClick={onClick}
    sx={{
      fontFamily: 'Open Sans, sans-serif',
      fontStyle: 'normal',
      fontVariant: 'normal',
      fontWeight: 1000,
      fontSize: 'calc(1vh + 1vw)',
      color: 'black',
      backgroundColor: active ? '#EA3636' : 'yellow',
      border: '2px solid black',
      borderRadius: '5px',
      margin: '1vw',
      zIndex: '1400',
      width: '30vw',
      '&:hover': {
        backgroundColor: active ? '#EA3636' : 'yellow',
      },
    }}
  >
    {children}
  </Button>
);



export const Inventory = () => {
  const dispatch = useDispatch();
  const tg_id = useSelector(getId);
  const shopData = useSelector(getShopPage);
  const inventoryData = useSelector(getInventoryPage)
  const invLS = useSelector(getInventoryLS)
  const shopLS = useSelector(getShopLS)
  const [modalOpen, setModalOpen] = useState(false)
  const error = useSelector(getBuyError)

  const [page, setPage] = useState(1);


  const [tabImages, setTabImages] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);

  // State for current tab
  const [currentTab, setCurrentTab] = useState('shop'); // 'shop' or 'inventory'

  useEffect(() => {
    const loadImages = async (data: InventoryPage) => {
      const images: { [key: string]: string } = {};
      for (const item of data?.content || []) {
        const src = await getTabImagePath(item.img as string);
        images[item.img as string] = src;
      }
      setTabImages(images);
      setLoading(false);
    };

    if (currentTab === 'shop') {
      if (shopData?.content) {
        loadImages(shopData);
      }
    } else if (currentTab === 'inventory') {
      if (inventoryData?.content) {
        loadImages(inventoryData);
      }
    }
  }, [shopData, inventoryData, currentTab]);

  // Prepare URLs for preloading
  let tabImageUrls: string[] = [];
  if (currentTab === 'shop') {
    tabImageUrls = shopData?.content?.map(item => tabImages[item.img as string]) || [];
  } else if (currentTab === 'inventory') {
    tabImageUrls = inventoryData?.content?.map(item => tabImages[item.img as string]) || [];
  }

  usePreloadImages(tabImageUrls);

  useEffect(() => {
    if (tg_id && currentTab === 'shop') {
      dispatch(fetchGetShop(tg_id, page));
    } else if (tg_id && currentTab === 'inventory') {
      dispatch(fetchGetInventory(tg_id, page));
    }
  }, [dispatch, tg_id, page, currentTab]);

  const handleClick = async (clothId: number, currency?: number) => {
    await dispatch(fetchBuyWardrobe(tg_id, clothId, currency || 'null'));
    dispatch(fetchGetShop(tg_id, page))
    setModalOpen(true) 
    dispatch(fetchInfo(tg_id))
  }

  const handleClickInventory = async (clothId: number, isEquipped: boolean) => {
    await dispatch(fetchEquipWardrobe(tg_id, clothId, isEquipped ? 'СНЯТЬ' : 'НАДЕТЬ'))
    dispatch(fetchGetInventory(tg_id, page))
  }

  if (loading) {
    return (
      <MainContainer>
        <Container>
          <Ellipse2 >
            <CircularProgress sx={{ color: '#EA3636' }} />
          </Ellipse2>
        </Container>
      </MainContainer>
    );
  }

  return (
    <MainContainer>
      <TabButtonContainer>
        <TabButton active={currentTab === 'shop'} onClick={() => setCurrentTab('shop')}>
          Магазин
        </TabButton>
        <TabButton active={currentTab === 'inventory'} onClick={() => setCurrentTab('inventory')}>
          Инвентарь
        </TabButton>
      </TabButtonContainer>

      <Container>
        {currentTab === 'shop' && (
          <>
            {shopLS === LoadingStates.SUCCEEDED && !!shopData?.content && shopData?.content?.length > 0 && shopData?.content?.map((cloth, index: number) => (
              <Ellipse key={index}>
                <Typography sx={{
                  fontFamily: 'Open Sans, sans-serif',
                  fontStyle: 'normal',
                  fontVariant: 'normal',
                  fontSize: 'calc(1vh + 1vw)',
                  fontWeight: '1000',
                }}>{cloth.name?.toUpperCase()}</Typography>
                <CenteredBox>
                  <CenteredImage
                    component="img"
                    src={tabImages[cloth.img as string]}
                    alt={cloth.name}
                    sx={{
                      width: '100%',
                      height: 'auto',
                      maxWidth: '16vh',
                      maxHeight: '16vh',
                      backgroundColor: 'transparent',
                      transform: 'scale(1.3)',
                      borderRadius: '15%',
                      opacity: 1, // По умолчанию 1, полностью видимое изображение
                      transition: 'opacity 0.3s ease-in-out', // Плавная анимация изменения opacity
                    }}
                  />
                </CenteredBox>
                <Typography
                  sx={{
                    fontFamily: 'Open Sans, sans-serif',
                      fontStyle: 'normal',
                      fontVariant: 'normal',
                      fontWeight: '800',
                      width: '100%',
                    alignContent: 'center',
                    textAlign: 'center',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    fontSize: 'calc(1.2vh + 1vw)',
                    marginTop: '1vh',
                    height: '4vh',
                    maxWidth: '22vh',
                    backgroundColor: 'transparent',
                      border: '0.5vw dashed black',
                      borderRadius: '0.6em',
                  }}
                >
                  {cloth.desc?.toUpperCase()}
                </Typography>
                <CurrencyContainer>
                  {cloth.currency?.map((curr, i) => (
                    <CurrencyEllipse key={i} onClick={() => handleClick(cloth.cloth_id, curr.currency)}>
                      <Typography sx={{
                        fontFamily: 'Open Sans, sans-serif',
                        fontStyle: 'normal',
                        fontVariant: 'normal',
                        fontWeight: '1000',
                        fontSize: 'calc(1.3vh + 1vw)',
                      }}>{curr.price} ${curr.currency}</Typography>
                    </CurrencyEllipse>
                  ))}
                </CurrencyContainer>
              </Ellipse>
            ))}
            {shopLS === LoadingStates.SUCCEEDED && shopData?.content && shopData?.content?.length == 0 && (
              <Ellipse2 >
                <Typography sx={{
                  fontFamily: 'Open Sans, sans-serif',
                  fontStyle: 'normal',
                  fontVariant: 'normal',
                  fontSize: 'calc(2vh + 1vw)',
                  fontWeight: '1000',
                }}>МАГАЗИН ПУСТ.</Typography>
                <Typography sx={{
                  fontFamily: 'Open Sans, sans-serif',
                  fontStyle: 'normal',
                  fontVariant: 'normal',
                  fontSize: 'calc(2vh + 1vw)',
                  fontWeight: '1000',
                }}>НОВЫЕ ВЕЩИ СКОРО ПОЯВЯТСЯ.</Typography>
              </Ellipse2>
            )}
            {shopLS === LoadingStates.LOADING && (
              <Ellipse2 >
                <CircularProgress sx={{ color: '#EA3636' }} />
              </Ellipse2>
            )}
          </>
        )}




        {currentTab === 'inventory' && (
          <>
            {invLS === LoadingStates.SUCCEEDED && !!inventoryData?.content && inventoryData?.content?.length > 0 && inventoryData?.content?.map((cloth, index: number) => (
              <Ellipse key={index}>
                <Typography sx={{
                  fontFamily: 'Open Sans, sans-serif',
                  fontStyle: 'normal',
                  fontVariant: 'normal',
                  fontSize: 'calc(1.2vh + 1vw)',
                  fontWeight: '1000',
                }}>{cloth.name?.toUpperCase()}</Typography>
                <CenteredBox>
                  <CenteredImage
                    component="img"
                    src={tabImages[cloth.img as string]}
                    alt={cloth.name}
                    sx={{
                      width: '100%',
                      height: 'auto',
                      maxWidth: '16vh',
                      maxHeight: '16vh',
                      backgroundColor: 'transparent',
                      transform: 'scale(1.1)',
                      borderRadius: '15%',
                      opacity: 1, // По умолчанию 1, полностью видимое изображение
                      transition: 'opacity 0.3s ease-in-out', // Плавная анимация изменения opacity
                    }}
                  />
                </CenteredBox>
                <Typography sx={{
                      fontFamily: 'Open Sans, sans-serif',
                      fontStyle: 'normal',
                      fontVariant: 'normal',
                      fontWeight: '800',
                      width: '100%',
                    alignContent: 'center',
                    textAlign: 'center',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    fontSize: 'calc(1.2vh + 1vw)',
                    marginTop: '1vh',
                    height: '4vh',
                    maxWidth: '22vh',
                    backgroundColor: 'transparent',
                      border: '0.5vw dashed black',
                      borderRadius: '0.6em',
                    }}>{cloth.desc?.toUpperCase()}</Typography>
                <CurrencyContainer>
                  <CurrencyEllipse onClick={() => handleClickInventory(cloth.cloth_id, cloth.isEquipped)}>
                    <Typography sx={{
                      fontFamily: 'Open Sans, sans-serif',
                      fontStyle: 'normal',
                      fontVariant: 'normal',
                      fontWeight: '1000',
                      fontSize: 'calc(1.3vh + 1vw)',
                    }}>{cloth.isEquipped ? 'СНЯТЬ' : ' НАДЕТЬ'}</Typography>

                  </CurrencyEllipse>
                </CurrencyContainer>
              </Ellipse>
            ))}
            {invLS === LoadingStates.SUCCEEDED && inventoryData?.content && inventoryData?.content?.length == 0 && (
              <Ellipse2 >
                <Typography sx={{
                  fontFamily: 'Open Sans, sans-serif',
                  fontStyle: 'normal',
                  fontVariant: 'normal',
                  fontSize: 'calc(2vh + 1vw)',
                  fontWeight: '1000',
                }}>ИНВЕНТАРЬ ПУСТ.</Typography>
                <Typography sx={{
                  fontFamily: 'Open Sans, sans-serif',
                  fontStyle: 'normal',
                  fontVariant: 'normal',
                  fontSize: 'calc(2vh + 1vw)',
                  fontWeight: '1000',
                }}></Typography>
              </Ellipse2>
            )}
            {invLS === LoadingStates.LOADING && (
              <Ellipse2 >
                <CircularProgress sx={{ color: '#EA3636' }} />
              </Ellipse2>
            )}
          </>
        )}
      </Container>
      <TaskModal
                        isOpen={modalOpen} // Pass modalOpen state to manage modal visibility
                        onClose={() => setModalOpen(false)} // Function to close the modal
                        error={error} // Optional: Pass error state if you want to display it in TaskModal
                    />

    </MainContainer>
  );
};

const TabButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`;


interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const LoadingContainer = styled.div`
position: absolute;
  width: 55vh;
  height: 20vh;
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

const MainContainer = styled.div`
 display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh; /* Минимальная высота контейнера, чтобы занимал всю высоту экрана */
  padding-top: 12vh; /* Отступ сверху, чтобы контент не налезал на хедер */
  padding-bottom: 27vh; /* Отступ снизу, чтобы контент не налезал на футер */
`;

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 3vh;
  padding: 2vw;
  height: 56vh;
  width: 100%;
  box-sizing: border-box;
`;

const Ellipse = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: #fef445;
  border-radius: 2rem;
  width: 100%;
  height: 33vh;
  position: relative;
`;

const Ellipse2 = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: #fef445;
  border-radius: 1rem;
  width: 96vw;
  height: 15vh;
  position: relative;
`;

const Ellipse3 = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: transparent;
  border-radius: 1rem;
  width: 96vw;
  height: 15vh;
  position: relative;
`;

const CenteredBox = styled(Box)`
  position: relative;
`;

const CenteredImage = styled(Box)`
  z-index: 1; /* Ensure image is on top of white background */
`;

const CurrencyContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1vh;
  margin-top: 1vh;
`;

const CurrencyEllipse = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  background-color: #FAC710;
  border: 0.5vw solid black;
  border-radius: 0.6em;
  width: 22vh;
  height: 5vh;
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

const Contain = styled.div`
`