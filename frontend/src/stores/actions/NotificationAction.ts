import { createNotification } from '../../helpers/Notification';
import { client } from '../graphql';
import { MUTATION_CREATE_NOTIFICATION, MUTATION_UPDATE_NOTIFICATION } from '../graphql/Notifications/NotificationMutations';
import { QUERY_GET_ALL_NOTIFICATION, QUERY_GET_DROPDOWNS_NOTIFICATION, QUERY_GET_SOME_NOTIFICATION } from '../graphql/Notifications/NotificationQuerys';


export const getListAllNotification = (userId: any) => {
  return async (dispatch: any) => {
    try {
      let listData = {};
      await client
        .query({
          query: QUERY_GET_ALL_NOTIFICATION,
          variables: {
            userId: userId
          }
        })
        .then((result: any) => {
          listData = result.data.data.edges;
        });
        console.log(listData);
      return listData;
    } catch (error) {
      createNotification('error', 'error', '');
      return error;
    }
  };
};

export const getListSomeNotification = (userId: any) => {
  return async (dispatch: any) => {
    try {
      let listData = {};
      await client
        .query({
          query: QUERY_GET_SOME_NOTIFICATION,
          variables: {
            userId: userId
          }
        })
        .then((result: any) => {
          listData = result.data.data.edges;
        });
      return listData;
    } catch (error) {
      createNotification('error', 'error', '');
      return error;
    }
  };
};

export const saveNewNotification = (data: any) => {
  return async (dispatch: any) => {
    try {
      let model: any = {};
      model = {
        ...model,
      };
      model = {
        ...model,
        ...data,
      };
      let dataCreate = null;    
      await client
        .mutate({
          mutation: MUTATION_CREATE_NOTIFICATION,
          variables: { input: model },
        })
        .then((dataResponse: any) => {
          if (dataResponse.errors?.length > 0) {
            dataResponse.errors.forEach((error: any) => {
              createNotification('error', 'error', '');
            });
          } else {
            dataCreate = dataResponse.data.create.id;
            createNotification('success', 'success', '');
          }
        });
      return dataCreate as any;
    } catch (error) {
      createNotification('error', 'error', '');
      return error;
    }
  };
};

export const updateNotification = (data: any, id: any) => {
  return async (dispatch: any) => {
    try {
      let model: {};
      model = {
        ...model,
      };
      model = {
        ...model,
        ...data,
      };
      let dataUpdate = null;
      await client
        .mutate({
          mutation: MUTATION_UPDATE_NOTIFICATION,
          variables: { id, input: model },
        })
        .then((dataReponse: any) => {
          if (dataReponse.errors?.length > 0) {
            dataReponse.errors.forEach((error: any) => {
              createNotification('error', 'error', '');
            });
          } else {
            dataUpdate = dataReponse.data.update.id;
            createNotification('success', 'success', '');
          }
        });
      return dataUpdate as any;
    } catch (error) {
      createNotification('error', 'error', '');
      return error;
    }
  };
};


export const getDropdownsNotification = () => {
  return async (dispatch: any) => {
    try {
      let listData = {};
      await client
        .query({
          query: QUERY_GET_DROPDOWNS_NOTIFICATION,
        })
        .then((result: any) => {
          listData = result.data;
        });
      console.log(listData);
      return listData;
    } catch (error) {
      createNotification('error', 'error', '');
      return error;
    }
  };
};

