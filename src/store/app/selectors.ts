import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "../store";

export const getActiveNavTab = createSelector(
    (state: RootState) => state.app.activeNavTab,
    (activeNavTab) => activeNavTab
)

export const getId = createSelector(
    (state: RootState) => state.app.id,
    (id) => id
)

export const getBalance = createSelector(
    (state: RootState) => state.app.balance,
    (balance) => balance
)
export const getTime = createSelector(
    (state: RootState) => state.app.time,
    (time) => time
)

export const getEnergy = createSelector(
    (state: RootState) => state.app.energy,
    (balance) => balance
)

export const getInfo = createSelector(
    (state: RootState) => state.app.infoData,
    (infoData) => infoData
)

export const getInfoLS = createSelector(
    (state: RootState) => state.app.loadingInfoData,
    (loadingInfoData) => loadingInfoData
)

export const getInfoError = createSelector(
    (state: RootState) => state.app.loadingInfoError,
    (loadingInfoError) => loadingInfoError
)

export const getFriends = createSelector(
    (state: RootState) => state.app.friendsPage,
    (friendsPage) => friendsPage
)

export const getTasks = createSelector(
    (state: RootState) => state.app.tasksPage,
    (tasksPage) => tasksPage
)

export const getTask = createSelector(
    (state: RootState) => state.app.task,
    (task) => task
)

export const getFriendsLS = createSelector(
    (state: RootState) => state.app.loadingFriendsPage,
    (loadingFriendsPage) => loadingFriendsPage
)

export const getFriendsError = createSelector(
    (state: RootState) => state.app.loadingFriendsPageError,
    (loadingFriendsPageError) => loadingFriendsPageError
)

export const getShopPage = createSelector(
    (state: RootState) => state.app.shopPage,
    (shopPage) => shopPage
)

export const getInventoryPage = createSelector(
    (state: RootState) => state.app.inventoryPage,
    (inventoryPage) => inventoryPage
)

export const getBuyError = createSelector(
    (state: RootState) => state.app.buyError,
    (buyStatus) => buyStatus
)

export const getEquipStatus = createSelector(
    (state: RootState) => state.app.equipStatus,
    (equipStatus) => equipStatus
)

export const getTotalPages = createSelector(
    (state: RootState) => state.app.totalPages,
    (totalPages) => totalPages
)

export const getInventoryLS = createSelector(
    (state: RootState) => state.app.loadingInventoryPage,
    (loadingInventoryPage) => loadingInventoryPage
)

export const getShopLS = createSelector(
    (state: RootState) => state.app.loadingShopPage,
    (loadingShopPage) => loadingShopPage
)

export const getCheckError = createSelector(
    (state: RootState) => state.app.checkTaskError,
    (checkTaskError) => checkTaskError
)