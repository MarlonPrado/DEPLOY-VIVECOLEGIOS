import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import { getCurrentTime } from '../../../helpers/Utils';

import contactsData from '../../data/chat.contacts.json';
import conversationsData from '../../data/chat.conversations.json';
import {
  CHAT_GET_CONTACTS,
  CHAT_GET_CONVERSATIONS,
  CHAT_ADD_MESSAGE_TO_CONVERSATION,
  CHAT_CREATE_CONVERSATION,
} from '../../reducers/types/aplicationsTypes';

import {
  getContactsSuccess,
  getContactsError,
  getConversationsSuccess,
  getConversationsError,
} from './ChatActions';

function* loadContacts(): any {
  try {
    // eslint-disable-next-line no-use-before-define
    const response = yield call(loadContactsAsync);
    const { contacts, currentUser } = response;
    yield put(getContactsSuccess(contacts, currentUser));
  } catch (error) {
    yield put(getContactsError(error));
  }
}

const loadContactsAsync = async () => {
  const contacts = contactsData.data;
  const currentUser = contacts[0];
  // eslint-disable-next-line no-return-await
  //console.log(contacts, 'CONTACTOS')
  return await new Promise((success) => {
    setTimeout(() => {
      success({ contacts, currentUser });
    }, 2000);
  })
    .then((response) => response)
    .catch((error) => error);
};

function* loadConversations(userId: any): any {
  try {
    // eslint-disable-next-line no-use-before-define
    const response = yield call(loadConversationsAsync, userId);
    const { conversations, selectedUser } = response;
    yield put(getConversationsSuccess(conversations, selectedUser));
  } catch (error) {
    yield put(getConversationsError(error));
  }
}

const loadConversationsAsync = async ({ payload }: any) => {
  let conversations = conversationsData.data;
  conversations = conversations.filter((x: { users: string | any[]; }) => x.users.includes(payload));
  //console.log(conversations);
  const selectedUser = conversations[0].users.find((x: any) => x !== payload);
  // eslint-disable-next-line no-return-await
  return await new Promise((success) => {
    setTimeout(() => {
      success({ conversations, selectedUser });
    }, 1000);
  })
    .then((response) => response)
    .catch((error) => error);
};

function* addMessageToConversation({ payload }: any): any {
  try {
    const { currentUserId, selectedUserId, message, allConversations } =
      payload;

    const response = yield call(
      // eslint-disable-next-line no-use-before-define
      addMessageToConversationAsync,
      currentUserId,
      selectedUserId,
      message,
      allConversations
    );
    const { conversations, selectedUser } = response;
    yield put(getConversationsSuccess(conversations, selectedUser));
  } catch (error) {
    yield put(getConversationsError(error));
  }
}

const addMessageToConversationAsync = async (
  currentUserId: any,
  selectedUserId: any,
  message: any,
  allConversations: any[]
  // eslint-disable-next-line consistent-return
) => {
  const conversation = allConversations.find(
    (x: { users: string | any[]; }) => x.users.includes(currentUserId) && x.users.includes(selectedUserId)
  );
  const time = getCurrentTime();
  if (conversation) {
    conversation.messages.push({
      sender: currentUserId,
      time,
      text: message,
    });
    conversation.lastMessageTime = time;
    const conversations = allConversations.filter(
      (x: { id: any; }) => x.id !== conversation.id
    );
    conversations.splice(0, 0, conversation);

    // eslint-disable-next-line no-return-await
    return await new Promise((success) => {
      setTimeout(() => {
        success({ conversations, selectedUser: selectedUserId });
      }, 500);
    })
      .then((response) => response)
      .catch((error) => error);
  }
};

function* createNewConversation({ payload }: any): any {
  try {
    const { currentUserId, selectedUserId, allConversations } = payload;
    const response = yield call(
      // eslint-disable-next-line no-use-before-define
      createNewConversationAsync,
      currentUserId,
      selectedUserId,
      allConversations
    );
    const { conversations, selectedUser } = response;
    yield put(getConversationsSuccess(conversations, selectedUser));
  } catch (error) {
    yield put(getConversationsError(error));
  }
}

const createNewConversationAsync = async (
  currentUserId: any,
  selectedUserId: any,
  allConversations: any[]
) => {
  const conversation: any = {
    id: allConversations.length + 1,
    users: [currentUserId, selectedUserId],
    lastMessageTime: '-',
    messages: [],
  };

  allConversations.splice(0, 0, conversation);
  // eslint-disable-next-line no-return-await
  return await new Promise((success) => {
    setTimeout(() => {
      success({
        conversations: allConversations,
        selectedUser: selectedUserId,
      });
    }, 500);
  })
    .then((response) => response)
    .catch((error) => error);
};

export function* watchGetContact() {
  yield takeEvery(CHAT_GET_CONTACTS, loadContacts);
}

export function* watchGetConversation() {
  yield takeEvery(CHAT_GET_CONVERSATIONS, loadConversations);
}

export function* watchAddMessageToConversation() {
  yield takeEvery(CHAT_ADD_MESSAGE_TO_CONVERSATION, addMessageToConversation);
}

export function* watchCreateConversation() {
  yield takeEvery(CHAT_CREATE_CONVERSATION, createNewConversation);
}

export default function* rootSaga() {
  yield all([
    fork(watchGetContact),
    fork(watchGetConversation),
    fork(watchAddMessageToConversation),
    fork(watchCreateConversation),
  ]);
}
