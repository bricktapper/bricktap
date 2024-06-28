import { useEffect, useState, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, CircularProgress } from '@mui/material';
import { fetchStatusTask, fetchTasksInfo } from '../store/app/async-actions';
import { getTasks, getId, getCheckError } from '../store/app/selectors';
import usePreloadImages from '../hooks/usePreloadImages';
import styled from 'styled-components';
import { TaskModal } from './TaskModal';


interface Task {
    name?: string;
    id?: number;
    status?: 'open' | 'done' | 'check' | 'not_done';
    ref_url?: string;
    points?: string;
    img?: string;
}


const getTaskImagePath = async (fileName: string) => {
    try {
        const module = await import(`../images/mainPage/${fileName}.webp`);
        return module.default;
    } catch (error) {
        console.error('Image loading failed:', error);
        return '';
    }
};

export const Tasks = () => {
    const dispatch = useDispatch();
    const tg_id = useSelector(getId);
    const data = useSelector(getTasks);
    const [page, setPage] = useState(1);
    const totalPages = data?.tasks?.total_pages ?? 1;
    const [isLoading, setIsLoading] = useState(true);
    const [taskImages, setTaskImages] = useState<{ [key: string]: string }>({});
    const [modalOpen, setModalOpen] = useState(false)
    const error = useSelector(getCheckError)

    console.log(error)

    useEffect(() => {
        const loadImages = async () => {
            const images: { [key: string]: string } = {};
            for (const task of data?.tasks?.content || []) {
                const src = await getTaskImagePath(task.img as string);
                images[task.img as string] = src;
            }
            setTaskImages(images);
            setIsLoading(false);
        };

        if (data?.tasks?.content) {
            loadImages();
        }
    }, [data]);

    useEffect(() => {
        const fetchData = () => {
            if (tg_id) {
                dispatch(fetchTasksInfo(tg_id, page));
            }
        };

        fetchData(); // Initial fetch

        const interval = setInterval(fetchData, 180000); // Fetch data every 3 minutes

        return () => clearInterval(interval); // Clear interval on component unmount
    }, [tg_id, page]);

    // Prepare URLs for preloading
    const taskImageUrls = data?.tasks?.content?.map(task => taskImages[task.img as string]) || [];
    usePreloadImages(taskImageUrls);

    const handleClick = async (taskId: number | undefined) => {
        if (taskId != undefined) {
                await dispatch(fetchStatusTask(tg_id, taskId));
               setModalOpen(true) 
               dispatch(fetchTasksInfo(tg_id, 1));
        }
    };

    const handleStatusClick = (url: string) => {
        window.location.href = url;
    }

    const statuses = useMemo(() => ({
        open: 'ВЫПОЛНИТЬ',
        done: 'ВЫПОЛНЕНО',
        check: 'НА ПРОВЕРКЕ',
        not_done: 'НЕ ВЫПОЛНЕНО',
        null: '-',
    }), []);

    const getStatus = useCallback((status: keyof typeof statuses | null): string => {
        return statuses[status || 'null'] || '-';
    }, [statuses]);

    if (isLoading || !data?.tasks?.content) {
        return (
            <LoadingContainer>
                <CircularProgress sx={{ color: '#EA3636' }} />
            </LoadingContainer>
        );
    }

    return (
        <MainContainer>
            <FriendsContainer>
                {data.tasks.content && data.tasks.content.length > 0 && data.tasks.content.map((task: Task, index: number) => (
                    <OneFriendEllipse key={index}>
                        <EllipsesContainer>
                            <NameEllipse>{task?.name}</NameEllipse>
                            <Box
                                sx={{
                                    position: 'relative',
                                    width: '40vh',
                                    height: 'auto',
                                    maxWidth: '18vh',
                                    maxHeight: '18vh',
                                    backgroundColor: '#fef445',
                                    border: '0.5vw solid black',
                                    borderRadius: '2rem',
                                    margin: '1vh',
                                }}
                            >
                                <Box
                                    component="img"
                                    src={taskImages[task.img as string] || 'brick'}
                                    alt={task.img || 'brick'}
                                    sx={{
                                        width: '100%',
                                        height: '100%',
                                        borderRadius: '2rem',
                                        transition: 'opacity 0.3s ease-in-out', // Плавная анимация изменения opacity
                                        scale: '0.7',
                                        position: 'relative',
                                        top: '-3vh',
                                    }}
                                />
                                <Typography
                                    sx={{
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        width: '100%',
                                        textAlign: 'center',
                                        fontWeight: '1000',
                                        fontFamily: 'Open Sans, sans-serif',
                                        fontStyle: 'normal',
                                        fontVariant: 'normal',
                                        fontSize: 'calc(3vh + 1vw)',
                                        borderRadius: '0 0 2rem 2rem', // Закругление углов нижней части
                                    }}
                                >
                                    {task?.points}
                                </Typography>
                            </Box>
                        </EllipsesContainer>
                        <StyledTypographyContainer>
                            <NameEllipse2 onClick={() => task.status === 'open' ? handleStatusClick(task?.ref_url || "https://t.me/brick_ton") : null}>{getStatus(task?.status || null)}</NameEllipse2>
                            <NameEllipse3 onClick={() => handleClick(task.id)}>
                                ПРОВЕРИТЬ
                            </NameEllipse3>
                        </StyledTypographyContainer>
                    </OneFriendEllipse>
                ))}

                {data.tasks.content && data.tasks.content.length == 0 && (
                    <OneFriend2Ellipse>
                        <Typography
                            sx={{
                                width: '100%',
                                textAlign: 'center',
                                fontWeight: '1000',
                                fontFamily: 'Open Sans, sans-serif',
                                fontStyle: 'normal',
                                fontVariant: 'normal',
                                fontSize: 'calc(1.5vh + 1vw)',
                                borderRadius: '0 0 2rem 2rem', // Закругление углов нижней части
                            }}
                        >
                            ВЫ ВЫПОЛНИЛИ ВСЕ ЗАДАНИЯ. НОВЫЕ ЗАДАНИЯ СКОРО ПОЯВЯТСЯ.
                        </Typography>
                    </OneFriend2Ellipse>
                )}
                    <TaskModal
                        isOpen={modalOpen} // Pass modalOpen state to manage modal visibility
                        onClose={() => setModalOpen(false)} // Function to close the modal
                        error={error} // Optional: Pass error state if you want to display it in TaskModal
                    />
            </FriendsContainer>
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
  min-height: 100vh;
  padding-top: 10vh; /* Отступ сверху, чтобы контент не налезал на хедер */
  padding-bottom: 15vh; /* Отступ снизу, чтобы контент не налезал на футер */
`;

const EllipsesContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 80vw;
  align-items: center;
`;

const FriendsContainer = styled.div`
  margin-top: 20px;
`;


const NameEllipse = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: #fef445;
  border-radius: 2rem;
  width: 100%;
  height: 18vh;
  position: relative;
  border: 0.5vw solid black;
  margin: 1vh;
  font-family: 'Open Sans', sans-serif;
  font-style: normal;
  font-variant: normal;
  font-size: calc(10px + 1vw);
text-align: center;
`;

const NameEllipse2 = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: #fef445;
  border-radius: 0.7rem;
  width: 100%;
  height: 6vh;
  position: relative;
  border: 0.5vw solid black;
  margin: 1vh;
  font-weight: 600;
  font-family: 'Open Sans', sans-serif;
  font-style: normal;
  font-variant: normal;
  font-size: calc(10px + 1vw);
`;

const NameEllipse3 = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: #fef445;
  border-radius: 0.7rem;
  width: 100%;
  max-width: 18vh;
  height: 6vh;
  position: relative;
  border: 0.5vw solid black;
  margin: 1vh;
  font-weight: 600;
  font-family: 'Open Sans', sans-serif;
  font-style: normal;
  font-variant: normal;
  font-size: calc(10px + 1vw);
`;
const OneFriendEllipse = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 89vw;
  height: auto;
  margin-top: 2vh;
  background-color: #fef445;
  border-radius: 2vh;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const OneFriend2Ellipse = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 89vw;
  height: 20vh;
  margin-top: 2vh;
  background-color: #fef445;
  border-radius: 2vh;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const StyledTypographyContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 80vw;
  align-items: center;
`;

const StyledTypography = styled(Typography)`
  color: black;
  font-weight: 1000;
  align-content: start;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: 'Open Sans', sans-serif;
  font-style: normal;
  font-variant: normal;
  line-height: unset;
  font-size: calc(11px + 1vw);
  font-stretch: semi-condensed;
  border: 1px solid black;
  border-radius: 8px;
  padding: 8px;
  background-color: white;
  width: 16vh;
  margin: 1vh;
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
    width: '100%',
};

const friendTextStyle2 = {
    width: '100%',
    height: 'auto',
    maxWidth: '16vh',
    maxHeight: '5vh',
    backgroundColor: 'white',
    border: '0.5vw solid black',
    borderRadius: '2rem',
    opacity: 1, // По умолчанию 1, полностью видимое изображение
    transition: 'opacity 0.3s ease-in-out', // Плавная анимация изменения opacity
    margin: '1vh',
};
