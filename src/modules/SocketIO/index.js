import SocketIOClient from 'socket.io-client';
import Constants, { baseURlDEV } from '../../constants';

const SOCKET_URL = 'http://208.115.210.219';
const SOCKET_PORT_DEV = '5153'; // dev port
const SOCKET_PORT_QA = '5154'; // qa port

//DEV
// export const BASE_URL_SOCKET = `${SOCKET_URL}:${Constants.baseURL == baseURlDEV ? SOCKET_PORT_DEV : SOCKET_PORT_DEV}`;
export const BASE_URL_SOCKET = `${SOCKET_URL}:${Constants.baseURL == baseURlDEV ? SOCKET_PORT_QA : SOCKET_PORT_QA}`;

console.log('socket url : ', BASE_URL_SOCKET);

let isReceivedMessageListenerInitialized = false;

export const EVENTS = {
  LOAD_ROOM: '_loadRoom',
  LOAD_RECENT_CHAT: '_loadRecentChatCb',
  LOAD_CHAT_HISTORY: '_loadChatHistoryWithCb',
  GET_ROOM: '_getRoom',
  GET_ROOM_ID: '_getRoomIdWithCb',
  RECEIVED_MESSAGE: '_receivedMessage',
  LEAVE_ROOM: '_leave',
  LOGOUT_USER: '_logoutUser',
  JOIN_SOCKET_CB: '_joinSocketCb',
  JOIN_SOCKET: '_joinSocket',
  DELETE_CHAT_THREAD: '_deleteRecentChatWithCb',
};

export const STREAM_EVENTS = {
  // emits
  JOIN_STREAM: '_joinStreamWithCb',
  COMMENT_STREAM: '_commentStreamWithCb',
  LEAVE_STREAM: '_leaveStreamWithCb',
  STOP_STREAM: '_stopStreamWithCb',

  // on
  USER_JOIN_STREAM: '_userJoinStream',
  USER_COMMENT_STREAM: '_userCommentStream',
  USER_LEFT_STREAM: '_userLeftStream',
  USER_STOP_STREAM: '_userStopStream',
};

export default class SocketIO {
  static myInstance = null;
  static socketInstance = null;
  // static socketAuth = null;
  // queue = [];

  /*
  creating class instance
  */
  static getInstance() {
    if (SocketIO.myInstance == null) {
      SocketIO.myInstance = new SocketIO();
    }
    return this.myInstance;
  }

  /*
   creating socket instance and
   connecting to socket
  */
  static init(user) {
    global.log('SOCKET INITIALIZING');

    SocketIO.getInstance().socketInstance = new SocketIOClient(
      BASE_URL_SOCKET,
      {
        transports: ['websocket'], // this is important as default transport type is "polling",
        autoConnect: true,
        query: {
          authorization: user.token,
          device_type: user.device_type,
          device_token: user.device_token,
        },
      },
    );

    return SocketIO.getInstance().socketInstance;
  }

  /*
  connect to socket manually
  */
  static connectToSocket(user) {
    console.log('connect to socket called');
    SocketIO.getInstance().socketInstance.io.opts = {
      ...SocketIO.getInstance().socketInstance.io.opts,
      path: '/socket.io',
      autoConnect: true,
    };

    SocketIO.getInstance().socketInstance.connect();

    SocketIO.getInstance().socketInstance.on('connect', () => {
      console.log('socket connected');
      if (!isReceivedMessageListenerInitialized) {
        isReceivedMessageListenerInitialized = true;
        SocketIO.getInstance().emit(EVENTS.JOIN_SOCKET_CB, user, (data) => {
          console.log('_joinSocketCb response event : ', data);
        });
        SocketIO.getInstance().emit(
          EVENTS.LOAD_RECENT_CHAT,
          { user_id: user.id },
          () => { },
        );
        // SocketIO.getInstance().addListners();
      }
    });
  }

  addListners = () => {
    SocketIO.getInstance().requestOnSuccess(
      'connect_error',
      SocketIO.getInstance().connect_error,
    );
    SocketIO.getInstance().requestOnSuccess(
      'connect_timeout',
      SocketIO.getInstance().connect_timeout,
    );
    SocketIO.getInstance().requestOnSuccess(
      'error',
      SocketIO.getInstance().error,
    );
    SocketIO.getInstance().requestOnSuccess(
      'disconnect',
      SocketIO.getInstance().disconnect,
    );
    SocketIO.getInstance().requestOnSuccess(
      'reconnect',
      SocketIO.getInstance().reconnect,
    );
    SocketIO.getInstance().requestOnSuccess(
      'reconnect_attempt',
      SocketIO.getInstance().reconnect_attempt,
    );
    SocketIO.getInstance().requestOnSuccess(
      'reconnecting',
      SocketIO.getInstance().reconnecting,
    );
    SocketIO.getInstance().requestOnSuccess(
      'reconnect_error',
      SocketIO.getInstance().reconnect_error,
    );
    SocketIO.getInstance().requestOnSuccess(
      'reconnect_failed',
      SocketIO.getInstance().reconnect_failed,
    );
  };

  connect_error = (error) => {
    console.log('connect_error to the socket.io', error);
  };
  connect_timeout = (timeout) => {
    console.log('connect_timeout to the socket.io', timeout);
  };
  error = (error) => {
    console.log('error to the socket.io', error);
  };
  disconnect = (reason) => {
    console.log('disconnect to the socket.io', reason);

    SocketIO.getInstance().socketInstance.removeAllListeners(
      EVENTS.RECEIVED_MESSAGE,
    );
    SocketIO.getInstance().socketInstance.removeAllListeners('disconnect');

    if (reason === 'io server disconnect') {
      // the disconnection was initiated by the server, you need to reconnect manually
      //SocketIO.getInstance().socketInstance.connect();
    }
    // if (this.socket) this.socket.disconnect();
  };
  reconnect = (attemptNumber) => {
    console.log('reconnect to the socket.io', attemptNumber);
  };
  reconnect_attempt = (attemptNumber) => {
    console.log('reconnect_attempt to the socket.io', attemptNumber);
  };
  reconnecting = (attemptNumber) => {
    console.log('reconnecting to the socket.io', attemptNumber);
  };
  reconnect_error = (error) => {
    console.log('reconnect_error to the socket.io', error);
  };
  reconnect_failed = () => {
    console.log('reconnect_failed to the socket.io');
  };
  requestDisconnect = () => {
    /*
    if (
      SocketIO.getInstance().socketInstance !== null &&
      SocketIO.getInstance().socketInstance !== undefined
    ) {
      SocketIO.getInstance().socketInstance.disconnect();
      console.log(
        'disconnected-socket ',
        SocketIO.getInstance().socketInstance,
      );
    } else {
      console.log('Can not disconnect');
    }
    */
  };

  resetIsReceivedMessageListenerLock = () => {
    isReceivedMessageListenerInitialized = false;
  };

  getIsReceivedMessageListenerLockStatus = () =>
    isReceivedMessageListenerInitialized;

  closeSocket = () => {
    if (
      SocketIO.getInstance().socketInstance !== null &&
      SocketIO.getInstance().socketInstance !== undefined
    )
      SocketIO.getInstance().socketInstance.close();
  };

  /*
  listen to an event
  */
  listen = (eventName, onSuccess) => {
    // console.log('socket status : ', SocketIO.getInstance());
    if (
      SocketIO.getInstance().socketInstance &&
      SocketIO.getInstance().socketInstance.connected
    ) {
      console.log('event calling : ', eventName);
      SocketIO.getInstance().socketInstance.on(eventName, (data) => {
        console.log(`${eventName} socket on : `, data);
        onSuccess && onSuccess(data);
      });
    }
  };

  /*
  release an event
  */
  emit = (eventName, args, onSuccess) => {
    if (
      SocketIO.getInstance().socketInstance &&
      SocketIO.getInstance().socketInstance.connected
    ) {
      global.log({
        eventName,
        args,
        onSuccess,
        inst: SocketIO.getInstance().socketInstance,
      });
      SocketIO.getInstance().socketInstance.emit(eventName, args, (data) => {
        console.log('response emit : ', data);
        onSuccess?.(data?.data);
      });
    }
  };

  requestOnSuccess = (event, success) => {
    console.log('requestOnSuccess--', event);
    if (SocketIO.getInstance().socketInstance !== null) {
      SocketIO.getInstance().socketInstance.on(event, (data) => {
        success(data.data);
      });
    }
  };
}
