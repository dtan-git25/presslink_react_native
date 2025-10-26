import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {
  View,
  Image,
  Platform,
  Keyboard,
  TextInput,
  SafeAreaView,
} from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import { ButtonView, ImageButton, ImageHandler, Loader } from '../../reuseableComponents';
import { push } from '../../services/NavigationService';
import { selectSingleImage } from '../../services/MultipickerUtils';
import { Colors, AppStyles, Images, Metrics } from '../../theme';
import Utils from '../../utility';
import KeyboardSpacer from 'react-native-keyboard-spacer';

// redux imports
import { useSelector } from 'react-redux';

// socket chat imports
import {
  sendMessage,
  emitGetChatRoomId,
  emitLoadChatHistory,
  emitLeaveRoom,
  removeChatListeners,
  chatListeners,
} from './chatSocketHandler';
import { modalInToGiftedChatObjects, uploadImage } from './chatHelper';
import utility from '../../utility';

const ChatScreen = ({ route, navigation }) => {
  const inputRef = useRef();
  const { otherUser } = route.params;
  const [state, setState] = useState({
    chatRoomId: 0,
    messages: [],
    isLoadEarlier: false,
    isLoadingEarlier: false,
    isFetching: true,
  });
  const user = useSelector(({ userReducer }) => userReducer.data);
  console.log('otherUser', otherUser)
  navigation.setOptions({
    title: user.user_group_id == 1 ? otherUser.business_name : otherUser.name,
    headerTitleStyle: styles.titleStyle,
    headerTitleAlign: 'center',
    headerTransparent: false
  });
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  useEffect(() => {
    chatListeners(onNewMessageReceived);
    emitGetChatRoomId(
      {
        user_id: user.id,
        target_id: otherUser.id,
        is_anonymous: 0,
        created_by: user.id,
        group_type: 'single',
      },
      onChatRoomIdReceived,
    );
    return () => {
      removeChatListeners();
    };
  }, []);

  const showActionSheet = () => {
    actionSheet?.current?.show && actionSheet.current.show();
  };

  const onSelectCallOption = (index) => {
    if (index !== 2) {
      const targetUser = {
        ...otherUser,
        image_url: otherUser.image,
        image_thumb: otherUser.image_url,
      };

      // audio call
      !index &&
        push('CallScreen', {
          targetUser,
          isAudioCall: true,
        });
      // video call
      index && push('CallScreen', { targetUser });
    }
  };

  const onChatRoomIdReceived = (data) => {
    setState((prevState) => ({ ...prevState, chatRoomId: data.chat_room_id }));
    const payload = {
      user_id: user.id,
      chat_room_id: data.chat_room_id,
      is_anonymous: 0,
    };
    emitLoadChatHistory(payload, onChatHistoryReceived);
  };

  const onChatHistoryReceived = (messages, isConcat = false) => {
    setState((prevState) => ({
      ...prevState,
      isLoadEarlier:
        messages.length && messages.length % 20 == 0 ? true : false,
      isLoadingEarlier: false,
      isFetching: false,
      messages: isConcat
        ? [...prevState.messages, ...modalInToGiftedChatObjects(messages)]
        : modalInToGiftedChatObjects(messages),
    }));
  };

  const onNewMessageReceived = (data) => {
    const { chat_room_id } = data;
    const { chatRoomId } = state;

    if (chat_room_id == chatRoomId) {
      setState((prevState) => ({
        ...prevState,
        messages: [
          ...modalInToGiftedChatObjects([data]),
          ...prevState.messages,
        ],
      }));
    } else {
      if (chatRoomId == 0) {
        setState((prevState) => ({
          ...prevState,
          messages: [
            ...modalInToGiftedChatObjects([data]),
            ...prevState.messages,
          ],
          chatRoomId: chat_room_id,
        }));
      }
    }
  };



  onLoadEarlier = () => {
    setState((prevState) => ({ ...prevState, isLoadingEarlier: true }));
    const { messages, chatRoomId } = state;
    const payload = {
      user_id: user.id,
      chat_room_id: chatRoomId,
      is_anonymous: 0,
      last_record_id: messages[messages.length - 1]._id,
    };
    emitLoadChatHistory(payload, (messages) =>
      onChatHistoryReceived(messages, true),
    );
  };

  const onSend = (messages = []) => {
    const message = inputRef.current.getValue();

    if (message.length) {
      const payload = {
        user_id: user.id,
        target_id: otherUser.id,
        group_type: 'single',
        chat_room_id: state.chatRoomId,
        message,
        message_type: 'text',
        is_anonymous: 0,
        created_by: user.id,
      };

      sendMessage(payload);

      let concatedMsg = `${user.name} : ${message}`;

      if (concatedMsg.length > 120) {
        concatedMsg = `${concatedMsg.substring(0, 120)}...`;
      }
      inputRef.current.setText('');
    }
  };

  const onPickImage = () => {
    Keyboard.dismiss();
    setTimeout(() => {
      selectSingleImage()
        .then((res) =>
          uploadImage(res.path)
            .then(({ data }) => {
              sendMessage({
                user_id: user.id,
                target_id: otherUser.id,
                group_type: 'single',
                chat_room_id: state.chatRoomId,
                message: '',
                message_type: 'image',
                is_anonymous: 0,
                file_url: data.file_url,
                created_by: user.id,
              });
              sendPush(`${user.name} : has sent you an image`);
            })
            .catch((err) => console.log('err : ', err)),
        )
        .catch((err) => console.log('err : ', err));
    }, 400);
  };

  const renderInputToolbar = (props) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          marginBottom: keyboardHeight,
          width: Metrics.screenWidth,
          backgroundColor: 'white',
          alignItems: 'center',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: Colors.txt.white,
          height: Metrics.widthRatio(82),
          paddingHorizontal: Metrics.doubleBaseMargin,
        }}>
        <View style={styles.inputSecContainer}>
          <Input ref={inputRef} />
        </View>
        <ImageButton
          style={styles.sendBtn}
          source={Images.sendBtn}
          onPress={onSend}
        />
      </View >
    );
  };

  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        textStyle={{
          left: {
            ...AppStyles.gbRe(14, 'white'),
          },
          right: {
            ...AppStyles.gbRe(14, 'white'),
          },
        }}
        wrapperStyle={{
          left: {
            backgroundColor: Colors.primary.violet,
          },
          right: {
            backgroundColor: Colors.txt.lGrey,

          },
        }}
      />
    );
  };

  const onPressImage = (url) => () => {
    Utils.getImageViewerRef().setImagesArray([{ url }]);
    Utils.getImageViewerRef().show();
  };

  const renderMessageImage = ({ currentMessage }) => {
    return (
      <ButtonView onPress={onPressImage(currentMessage.image)}>
        <ImageHandler
          source={{ uri: currentMessage.image }}
          style={{ width: 160, height: 160, margin: 4, borderRadius: 12 }}
        />
      </ButtonView>
    );
  };

  return !state.isFetching ? (
    <SafeAreaView style={{ flex: 1 }}>
      {/* <View style={{ height: Metrics.widthRatio(44) }} /> */}
      <GiftedChat
        minInputToolbarHeight={0}
        messagesContainerStyle={{
          marginHorizontal: Metrics.baseMargin,
          marginLeft: Metrics.heightRatio(0),
          paddingBottom: Metrics.baseMargin,
          marginBottom: keyboardHeight,
        }}
        renderBubble={renderBubble}
        textInputStyle={{
          paddingTop: 8,
          // color: 'pink'
          // ...Fonts.Size(20)
          // ...Fonts.Regular(Fonts.Size.xSmall, Colors.primary.tabBarText),
        }}
        renderInputToolbar={() => undefined}
        renderMessageImage={renderMessageImage}
        messages={state.messages}
        user={{
          _id: user.id,
        }}
        isKeyboardInternallyHandled={false}
        loadEarlier={state.isLoadEarlier}
        onLoadEarlier={onLoadEarlier}
        isLoadingEarlier={state.isLoadingEarlier}
      />
      {renderInputToolbar()}
      {Platform.OS == 'ios' && <KeyboardSpacer />}
    </SafeAreaView>
  ) : (
    <View style={{ flex: 1, ...AppStyles.centerAligned }}>
      <Loader />
    </View>
  );
};

export default ChatScreen;

const Input = forwardRef((props, ref) => {
  const [val, setVal] = useState('');

  useImperativeHandle(ref, () => ({
    setText: (txt) => setVal(txt),
    getValue: () => val,
  }));

  return (
    <TextInput
      placeholder="Type a message"
      style={{
        flex: 1,
        paddingBottom: Utils.isPlatformAndroid()
          ? Metrics.widthRatio(10)
          : Metrics.widthRatio(4),
        maxHeight: Metrics.widthRatio(100),
      }}
      multiline
      value={val}
      onChangeText={(txt) => setVal(txt)}
    />
  );
});

const styles = {
  icCall: {
    width: Metrics.icons.normal,
    height: Metrics.icons.normal,
    resizeMode: 'contain',
  },

  containerCall: { paddingRight: Metrics.baseMargin },
  container: {
    flex: 1,
    backgroundColor: Colors.bg.lGrey,
  },
  bubble: {
    textStyle: {
      left: {
        ...AppStyles.gbRe(14, Colors.txt.white),
      },
      right: {
        ...AppStyles.gbRe(14, Colors.txt.black),
      },
    },
    wrapperStyle: {
      left: {
        backgroundColor: Colors.primary.violet,
        borderBottomLeftRadius: 0,
        padding: Metrics.smallMargin / 2,
        borderTopLefttRadius: Metrics.baseMargin,
        marginTop: Metrics.smallMargin / 2,
      },
      right: {
        backgroundColor: Colors.txt.white,
        borderBottomRightRadius: 0,
        borderTopRightRadius: Metrics.baseMargin,
        padding: Metrics.smallMargin / 2,
        marginTop: Metrics.smallMargin / 2,
      },
      bottomContainerStyle: {
        marginBottom: 50,
      },
    },
  },
  img: { width: 160, height: 160, margin: 4, borderRadius: 12 },
  inputContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.txt.white,
    height: Metrics.widthRatio(82),
    paddingHorizontal: Metrics.doubleBaseMargin,

  },
  inputSecContainer: {
    backgroundColor: 'rgba(178,185,200,0.4)',
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
    minHeight: Metrics.heightRatio(38),
    marginBottom: utility.isPlatformAndroid() ? 0 : Metrics.baseMargin,
    paddingHorizontal: Metrics.smallMargin,
  },
  messagesContainer: {
    marginHorizontal: Metrics.baseMargin,
    paddingBottom: utility.isPlatformAndroid()
      ? Metrics.widthRatio(100)
      : Metrics.widthRatio(65),
  },
  inputField: {
    flex: 1,
    paddingBottom: utility.isPlatformAndroid()
      ? Metrics.widthRatio(10)
      : Metrics.widthRatio(4),

  },
  titleStyle: {
    ...AppStyles.gbRe(18, Colors.txt.vdGrey),
    fontWeight: '400',
    textTransform: 'capitalize',

  },
  sendBtn: {
    marginBottom: utility.isPlatformAndroid() ? 0 : Metrics.baseMargin,
  },
};
