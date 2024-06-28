import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { Dialog, DialogContent, DialogContentText, DialogTitle, IconButton, Box, Typography, CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import styled from 'styled-components';

import { fetchTask, fetchTasksInfo } from '../store/app/async-actions';
import { getTask, getId } from '../store/app/selectors';

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    error?: string | null; // Optional prop for passing error from parent
}

export const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, error }) => {
    const dispatch = useDispatch();
    const tg_id = useSelector(getId);

    const handleClose = () => {
        onClose();
        dispatch(fetchTasksInfo(tg_id, 1));
    };

    return (
        <Dialog PaperProps={{
            style: {
              backgroundColor: '#fef445',
              
            },
          }} open={!!error && isOpen} onClose={handleClose} fullWidth={true} sx={{ backdropFilter: 'blur(5px)'}}>
            <DialogTitle>
                <IconButton aria-label="close" onClick={handleClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                {error ? (
                    <SaleTextContainer>{error}</SaleTextContainer>
                ) : (
                    <DialogContentText><CircularProgress sx={{ color: '#EA3636'}}/></DialogContentText>
                )}
            </DialogContent>
        </Dialog>
    );
};

const MainContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 70vh;
`;

const URLEllipse = styled(Box)`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 60vw;
    height: 35vh;
    margin-top: 2vh;
    background-color: white;
    border: 2px solid #000;
    border-radius: 2vw;
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

const TotalFriendsEllipse = styled(Box)`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    width: 60vw;
    height: 25vh;
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
    width: 45vw;
    height: 10vh;
    margin-top: -1vh;
    margin-bottom: 2vh;
    background-color: white;
    border-radius: 2vh;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
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


TaskModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    error: PropTypes.string, // Здесь error может быть необязательным, если это нужно
};