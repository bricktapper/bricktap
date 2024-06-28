import { FC, useCallback, useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppBar, Toolbar, Container, Grid, Typography, Box, CircularProgress } from '@mui/material';

import { setActiveNavTab } from '../store/app/actions';
import { getActiveNavTab } from '../store/app/selectors';

import usePreloadImages from '../hooks/usePreloadImages';

const getTabImagePath = async (tabName: string) => {
  try {
    const module = await import(`../images/mainPage/${tabName}.webp`);
    return module.default;
  } catch (error) {
    console.error('Image loading failed:', error);
    return '';
  }
};

const tabs = [
  { id: 'inventory', label: 'ВЕЩИ', src: 'path_to_inventory_image.png', activeSrc: 'path_to_inventory_active_image.png' },
  { id: 'tasks', label: 'ЗАДАНИЯ', src: 'path_to_tasks_image.png', activeSrc: 'path_to_tasks_active_image.png' },
  { id: 'main', label: 'ГЛАВНАЯ', src: 'path_to_main_image.png', activeSrc: 'path_to_main_active_image.png' },
  { id: 'friends', label: 'ДРУЗЬЯ', src: 'path_to_friends_image.png', activeSrc: 'path_to_friends_active_image.png' },
  { id: 'roadmap', label: 'РОАДМАП', src: 'path_to_roadmap_image.png', activeSrc: 'path_to_roadmap_active_image.png' }
];

export const Footer: FC = () => {
  const dispatch = useDispatch();
  const selectedTab = useSelector(getActiveNavTab);
  const [tabImages, setTabImages] = useState<{ [key: string]: { src: string, activeSrc: string } }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadImages = async () => {
      const images: { [key: string]: { src: string, activeSrc: string } } = {};
      for (const tab of tabs) {
        const src = await getTabImagePath(tab.id);
        const activeSrc = await getTabImagePath(`${tab.id}_active`);
        images[tab.id] = { src, activeSrc };
      }
      setTabImages(images);
      setLoading(false);
    };
    loadImages();
  }, []);

  // Prepare URLs for preloading
  const tabImageUrls = useMemo(() => 
    tabs.reduce<string[]>((acc, tab) => {
      if (tabImages[tab.id]) {
        acc.push(tabImages[tab.id].src, tabImages[tab.id].activeSrc);
      }
      return acc;
    }, []),
  [tabImages]);

  usePreloadImages(tabImageUrls);

  const handleTabClick = useCallback(
    (value: string) => {
      dispatch(setActiveNavTab(value));
    },
    [dispatch]
  );

  if (loading) {
    return (
      <AppBar position="fixed" sx={{
        top: 'auto',
        bottom: 0,
        backgroundColor: 'transparent',
        boxShadow: 'none',
        marginTop: 'auto',
        paddingTop: '3vh',
        paddingBottom: '2vh',
      }}>
        <Container
        maxWidth="xl"
        sx={{
          backgroundColor: '#fef445',
          borderRadius: '1vh',
          height: '11vh',
          width: '97vw',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 0,
          overflow: 'hidden'
        }}
      >
        <Toolbar disableGutters sx={{ width: '100%', height: '100%' }}>
        <CircularProgress sx={{color: '#EA3636', margin: 'auto'}}/>
        </Toolbar>
      </Container>
    </AppBar>
      )
  }

  return (
    <AppBar position="fixed" sx={{
      top: 'auto',
      bottom: 0,
      backgroundColor: 'black',
      boxShadow: 'none',
      marginTop: 'auto',
      paddingBottom: '2vh',
    }}>
      <Container
        maxWidth="xl"
        sx={{
          backgroundColor: '#fef445',
          borderRadius: '1vh',
          height: '12vh',
          width: '97vw',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 0,
          overflow: 'hidden'
        }}
      >
        <Toolbar disableGutters sx={{ width: '100%', height: '100%' }}>
          <Grid container spacing={0} justifyContent="space-between" sx={{ width: '100%', height: '100%' }}>
            {tabs.map((tab) => (
              <Grid
                item
                key={tab.id}
                xs={12 / tabs.length}
                sx={{
                  textAlign: 'center',
                  borderRadius: selectedTab === tab.id ? '3vh' : '0',
                  border: selectedTab === tab.id ? '1px solid black' : 'none',
                  backgroundColor: selectedTab === tab.id ? 'rgba(0,0,0, 0.2)' : 'transparent',
                  padding: selectedTab === tab.id ? '0' : '0'
                }}
                onClick={() => handleTabClick(tab.id)}
              >
                {tabImages[tab.id] && (
                  <Box
                    component="img"
                    src={selectedTab === tab.id && tabImages[tab.id].activeSrc ? tabImages[tab.id].activeSrc : tabImages[tab.id].src}
                    alt={tab.label}
                    sx={{
                      width: '9vh',
                      height: '9vh',
                      maxWidth: '70px',
                      margin: '0 auto',
                      scale: '1.2',
                    }}
                  />
                )}
                <Typography variant="body2" sx={{ color: 'black', font: 'Open Sans, sans-serif', fontSize: 'calc(8px + 1vw)', fontWeight: '700' }}>
                  {tab.label}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
