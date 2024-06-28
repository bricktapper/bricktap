import axios, { AxiosInstance } from 'axios'
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
    fetchGetTasksPage,
    fetchGetTasksPageSuccess,
    fetchGetTasksPageError,
    fetchGetTask,
    fetchGetTaskError,
    fetchGetTaskSuccess,
    fetchGetShopPage,
    fetchGetShopPageError,
    fetchGetShopPageSuccess,
    fetchBuy,
    fetchBuyError,
    fetchBuySuccess,
    fetchGetInventoryPage,
    fetchGetInventoryPageSuccess,
    fetchGetInventoryPageError,
    fetchEquip,
    fetchEquipSuccess,
    fetchEquipError,
    fetchCheckTask,
    fetchCheckTaskSuccess,
    fetchCheckTaskError,
} from './actions'
import { AppDispatch } from '../store'

const api = axios.create({
    headers: {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true',
    },
    baseURL: process.env.REACT_APP_SERVER_URL,
  });

export const fetchInfo = (id: string | number): any => {
    return (dispatch: AppDispatch) => {
      dispatch(fetchGetInfo());
      return api
        .get(`/info/${id}`)
        .then((res: any) => {
          dispatch(fetchGetInfoSuccess(res.data));
        })
        .catch((error) => {
          console.log(error);
          dispatch(fetchGetInfoError(error?.message ? error?.message : error.toString()));
        });
    };
  };


export const getTap = (id: string | number): any => {
    return (dispatch: AppDispatch) => {
      dispatch(fetchGetTap());
      return api
        .get(`/tap/${id}`)
        .then((res: any) => {
          dispatch(fetchGetTapSuccess(res.data));
        })
        .catch((error) => {
          console.log(error);
          dispatch(fetchGetTapError(error?.message ? error?.message : error.toString()));
        });
    };
  };
  

  export const fetchFriendsInfo = (id: string | number, page: number): any => {
    return (dispatch: AppDispatch) => {
      dispatch(fetchGetFriendsPage());
      return api
        .get(`/friends/${id}?page_size=100&page=${page}`)
        .then((res: any) => {
          dispatch(fetchGetFriendsPageSuccess(res.data));
        })
        .catch((error) => {
          console.log(error);
          dispatch(fetchGetFriendsPageError(error?.message ? error?.message : error.toString()));
        });
    };
  };

  export const fetchTasksInfo = (id: string | number, page: number): any => {
    return (dispatch: AppDispatch) => {
      dispatch(fetchGetTasksPage());
      return api
        .get(`/tasks/${id}?page_size=100&page=${page}`)
        .then((res: any) => {
          dispatch(fetchGetTasksPageSuccess(res.data));
        })
        .catch((error) => {
          console.log(error);
          dispatch(fetchGetTasksPageError(error?.message ? error?.message : error.toString()));
        });
    };
  };

  export const fetchTask = (id: string | number, taskId: string | number): any => {
    return (dispatch: AppDispatch) => {
      dispatch(fetchGetTask());
      return api
        .get(`/tasks/${id}/${taskId}`)
        .then((res: any) => {
          dispatch(fetchGetTaskSuccess(res.data));
        })
        .catch((error) => {
          console.log(error);
          dispatch(fetchGetTaskError(error?.message ? error?.message : error.toString()));
        });
    };
  };


  export const fetchGetShop = (id: string | number, page: number): any => {
    return (dispatch: AppDispatch) => {
      dispatch(fetchGetShopPage());
      return api
        .get(`/wardrope/shop/${id}?page_size=100&page=${page}`)
        .then((res: any) => {
          dispatch(fetchGetShopPageSuccess(res.data));
        })
        .catch((error) => {
          console.log(error);
          dispatch(fetchGetShopPageError(error?.message ? error?.message : error.toString()));
        });
    };
  };

  export const fetchGetInventory = (id: string | number, page: number): any => {
    return (dispatch: AppDispatch) => {
      dispatch(fetchGetInventoryPage());
      return api
        .get(`/wardrope/inventory/${id}?page_size=100&page=${page}`)
        .then((res: any) => {
          dispatch(fetchGetInventoryPageSuccess(res.data));
        })
        .catch((error) => {
          console.log(error);
          dispatch(fetchGetInventoryPageError(error?.message ? error?.message : error.toString()));
        });
    };
  };

  export const fetchBuyWardrobe = (id: string | number, item_id: string | number, currency_type: string | number): any => {
    return (dispatch: AppDispatch) => {
      dispatch(fetchBuy());
      return api
        .get(`/wardrope/buy/${id}/${item_id}/${currency_type}`)
        .then((res: any) => {
          dispatch(fetchBuySuccess(res.data));
        })
        .catch((error) => {
          console.log(error);
          dispatch(fetchBuyError(error?.response?.data?.detail ? error?.response?.data?.detail : error.toString()));
        });
    };
  };

  export const fetchEquipWardrobe = (id: string | number, item_id: string | number, action: string): any => {
    return (dispatch: AppDispatch) => {
      dispatch(fetchEquip());
      return api
        .post(`/wardrope/equip/${id}/${item_id}/${action.toString()}`)
        .then((res: any) => {
          dispatch(fetchEquipSuccess(res.data));
        })
        .catch((error) => {
          console.log(error);
          dispatch(fetchEquipError(error?.message ? error?.message : error.toString()));
        });
    };
  };

  export const fetchStatusTask = (id: string | number, task_id: string | number): any => {
    return (dispatch: AppDispatch) => {
      dispatch(fetchCheckTask());
      return api
        .get(`/tasks/check/${id}/${task_id}`)
        .then((res: any) => {
          dispatch(fetchCheckTaskSuccess(res.data));
        })
        .catch((error) => {
          console.log(error);
          dispatch(fetchCheckTaskError(error?.response?.data?.detail ? error?.response?.data?.detail : error.toString()));
        });
    };
  };
