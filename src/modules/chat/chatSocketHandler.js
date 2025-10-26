import SocketIO, {EVENTS} from '../SocketIO';

// chat related emits
export const emitLoadChatHistory = (payload, cbChatHistory) => {
  SocketIO.getInstance().emit(EVENTS.LOAD_CHAT_HISTORY, payload, (data) => {
    console.log('_loadChatHistoryWithCb : ', data);
    cbChatHistory && cbChatHistory(data);
  });
};

export const sendMessage = (payload) => {
  SocketIO.getInstance().emit('_sendMessage', payload);
};

export const emitGetChatRoomId = (payload, cbChatRoomIdReceived) => {
  SocketIO.getInstance().emit(EVENTS.GET_ROOM_ID, payload, (res) => {
    console.log('_getRoomIdWithCb : ', res);
    cbChatRoomIdReceived && cbChatRoomIdReceived(res);
  });
};

export const emitLeaveRoom = (payload) => {
  SocketIO.getInstance().emit(EVENTS.LEAVE_ROOM, payload, (res) =>
    console.log('leave response : ', res),
  );
};

export const removeChatListeners = () => {
  SocketIO.getInstance().socketInstance.removeAllListeners(
    EVENTS.RECEIVED_MESSAGE,
  );
};

// chat listeners
export const chatListeners = (cbOnNewMessageReceived) => {
  SocketIO.getInstance().listen(EVENTS.RECEIVED_MESSAGE, ({data}) =>
    cbOnNewMessageReceived(data),
  );
};
