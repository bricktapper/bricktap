import { createAction } from '@reduxjs/toolkit'

export const setActiveNavTab = createAction(
    'app/setActiveNavTab',
    (data) => ({
        payload: data,
    })
)
export const setId = createAction(
    'app/setId',
    (data) => ({
        payload: data,
    })
)

export const fetchGetInfo = createAction('app/fetchGetInfo')
export const fetchGetInfoSuccess = createAction('app/fetchGetInfoSuccess', 
    (data) => ({
        payload: data
    })
)
export const fetchGetInfoError = createAction('app/fetchGetInfoError', 
    (data) => ({
        payload: data
    })
)

export const fetchGetTap = createAction('app/fetchGetTap')
export const fetchGetTapSuccess = createAction('app/fetchGetTapSuccess', 
    (data) => ({
        payload: data
    })
)
export const fetchGetTapError = createAction('app/fetchGetTapError', 
    (data) => ({
        payload: data
    })
)

export const fetchGetTasksPage = createAction('app/fetchGetTasksPage')
export const fetchGetTasksPageSuccess = createAction('app/fetchGetTasksPageSuccess', 
    (data) => ({
        payload: data
    })
)
export const fetchGetTasksPageError = createAction('app/fetchGetTasksPageError', 
    (data) => ({
        payload: data
    })
)

export const fetchGetTask = createAction('app/getchGetTask')
export const fetchGetTaskSuccess = createAction('app/fetchGetTaskSuccess', 
    (data) => ({
        payload: data
    })
)
export const fetchGetTaskError = createAction('app/fetchGetTaskError', 
    (data) => ({
        payload: data
    })
)

export const fetchGetFriendsPage = createAction('app/fetchGetFriendsPage')
export const fetchGetFriendsPageSuccess = createAction('app/fetchGetFriendsPageSuccess', 
    (data) => ({
        payload: data
    })
)
export const fetchGetFriendsPageError = createAction('app/fetchGetFriendsPageError', 
    (data) => ({
        payload: data
    })
)

export const fetchGetShopPage = createAction('app/fetchGetShopPage')
export const fetchGetShopPageSuccess = createAction('app/fetchGetShopPageSuccess', 
    (data) => ({
        payload: data
    })
)
export const fetchGetShopPageError = createAction('app/fetchGetShopPageError', 
    (data) => ({
        payload: data
    })
)

export const fetchGetInventoryPage = createAction('app/fetchGetInventoryPage')
export const fetchGetInventoryPageSuccess = createAction('app/fetchGetInventoryPageSuccess', 
    (data) => ({
        payload: data
    })
)
export const fetchGetInventoryPageError = createAction('app/fetchGetInventoryPageError', 
    (data) => ({
        payload: data
    })
)

export const fetchBuy = createAction('app/fetchBuy')
export const fetchBuySuccess = createAction('app/fetchBuySuccess', 
    (data) => ({
        payload: data
    })
)
export const fetchBuyError = createAction('app/fetchBuyError', 
    (data) => ({
        payload: data
    })
)

export const fetchEquip = createAction('app/fetchEquip')
export const fetchEquipSuccess = createAction('app/fetchEquipSuccess', 
    (data) => ({
        payload: data
    })
)
export const fetchEquipError = createAction('app/ffetchEquipError', 
    (data) => ({
        payload: data
    })
)

export const fetchCheckTask = createAction('app/fetchCheckTask')
export const fetchCheckTaskSuccess = createAction('app/fetchCheckTaskSuccess', 
    (data) => ({
        payload: data
    })
)
export const fetchCheckTaskError = createAction('app/fetchCheckTaskError', 
    (data) => ({
        payload: data
    })
)