import { createReducer} from '@reduxjs/toolkit'

import { fetchEquip, fetchEquipError, fetchEquipSuccess, fetchGetInventoryPage, fetchGetInventoryPageSuccess, setActiveNavTab } from './actions'
import { Store } from '../types'

import {
    fetchGetInfo,
    fetchGetInfoSuccess,
    fetchGetInfoError,
    fetchGetTap,
    fetchGetTapSuccess,
    fetchGetTapError,
    fetchGetFriendsPage,
    fetchGetFriendsPageSuccess,
    fetchGetFriendsPageError,
    fetchGetTasksPageError,
    fetchGetTasksPage,
    fetchGetTasksPageSuccess,
    fetchGetTask,
    fetchGetTaskSuccess,
    fetchBuy,
    fetchBuyError,
    fetchBuySuccess,
    fetchGetShopPage,
    fetchGetShopPageError,
    fetchGetShopPageSuccess,
    fetchCheckTask,
    fetchCheckTaskSuccess,
    fetchCheckTaskError,
} from './actions'
import { LoadingStates } from '../../const'
import WebApp from '@twa-dev/sdk'

const initialState: Store = {
    id: WebApp?.initDataUnsafe?.user?.id || 225883207,
    activeNavTab: 'main',
    balance: null,
    energy: null,
    time: 0,
    current_time: 0,
    infoData: {
        time: 0,
        current_time: 0
    },
    friendsPage: {
        url: ''
    },
    task: {},
    tasksPage: {},
    inventoryPage: {},
    shopPage: {},
    buyError: null,
    equipStatus: null,
    loadingInventoryPage: LoadingStates.IDLE,
    loadingInventoryPageError: null,
    loadingShopPage: LoadingStates.IDLE,
    loadingShopPageError: null,
    loadingFriendsPage: LoadingStates.IDLE,
    loadingTapRes: LoadingStates.IDLE,
    loadingInfoData: LoadingStates.IDLE,
    loadingFriendsPageError: null,
    loadingTapResError: null,
    loadingInfoError: null,
    totalPages: null,
    checkTaskError: null,
}

export const appReducer = createReducer(initialState, (builder) => {
    builder
    .addCase(setActiveNavTab, (state, {payload }) => {
        state.activeNavTab = payload
    })
    .addCase(fetchGetInfo, (state) => {
        state.loadingInfoData = LoadingStates.LOADING
        state.infoData = initialState.infoData
        state.loadingInfoError = initialState.loadingInfoError
    })
    .addCase(fetchGetTasksPage, (state) => {
        state.tasksPage = initialState.tasksPage
    })
    .addCase(fetchGetTasksPageSuccess, (state, {payload}) => {
        state.tasksPage = payload
    })
    .addCase(fetchGetTask, (state) => {
        state.task = initialState.task
    })
    .addCase(fetchGetTaskSuccess, (state, {payload}) => {
        state.task = payload
    })
    .addCase(fetchGetInfoSuccess, (state, {payload}) => {
        state.infoData = payload
        state.balance = payload.balance
        state.energy = payload.energy
        state.time = payload.time
        state.current_time = payload.current_time
        state.loadingInfoError = initialState.loadingInfoError
        state.loadingInfoData = LoadingStates.SUCCEEDED
    })
    .addCase(fetchGetInfoError, (state, {payload}) => {
        state.loadingInfoError = payload
        state.loadingInfoData = LoadingStates.FAILED
    })
    .addCase(fetchGetTap, (state) => {
        state.loadingTapRes = LoadingStates.LOADING
        state.balance = state?.balance || null
        state.energy = state?.energy || null
        state.time = state?.time || null
        state.current_time = state?.current_time || null
        state.loadingTapResError = initialState.loadingInfoError
    })
    .addCase(fetchGetTapSuccess, (state, { payload }) => {
        state.balance = payload.balance
        state.energy = payload.energy
        state.time = payload.time
        state.current_time = payload.current_time
        state.loadingTapResError = initialState.loadingInfoError
        state.loadingTapRes = LoadingStates.SUCCEEDED
    })
    .addCase(fetchGetTapError, (state, {payload}) => {
        state.loadingTapResError = payload
        state.loadingTapRes = LoadingStates.FAILED
    })
    .addCase(fetchGetFriendsPage, (state) => {
        state.loadingFriendsPage = LoadingStates.LOADING
        state.friendsPage = initialState.friendsPage
        state.loadingFriendsPageError = initialState.loadingFriendsPageError
    })
    .addCase(fetchGetFriendsPageSuccess, (state, {payload}) => {
        state.friendsPage = payload
        state.loadingFriendsPageError = initialState.loadingFriendsPageError
        state.loadingFriendsPage = LoadingStates.SUCCEEDED
    })
    .addCase(fetchGetFriendsPageError, (state, {payload}) => {
        state.loadingFriendsPageError = payload
        state.loadingFriendsPage = LoadingStates.FAILED
    })
    .addCase(fetchGetShopPage, (state) => {
        state.loadingShopPage = LoadingStates.LOADING
        state.shopPage = initialState.shopPage
    })
    .addCase(fetchGetShopPageSuccess, (state, {payload}) => {
        state.shopPage = payload
        state.loadingShopPage = LoadingStates.SUCCEEDED
    })
    .addCase(fetchGetInventoryPage, (state) => {
        state.loadingInventoryPage = LoadingStates.LOADING
        state.inventoryPage = initialState.inventoryPage
    })
    .addCase(fetchGetInventoryPageSuccess, (state, {payload}) => {
        state.inventoryPage = payload
        state.loadingInventoryPage = LoadingStates.SUCCEEDED
    })
    .addCase(fetchBuySuccess, (state, { payload }) => {
        state.buyError = initialState.checkTaskError
    })
    .addCase(fetchBuyError, (state, { payload }) => {
        state.buyError = payload
    })
    .addCase(fetchEquip, (state) => {
        state.equipStatus = null
    })
    .addCase(fetchEquipSuccess, (state, { payload }) => {
        state.equipStatus = payload
    })
    .addCase(fetchEquipError, (state, { payload }) => {
        state.equipStatus = payload
    })
    
    .addCase(fetchCheckTaskSuccess, (state) => {
        state.checkTaskError = initialState.checkTaskError
    })
    .addCase(fetchCheckTaskError, (state, { payload}) => {
        state.checkTaskError = payload
    })
})