import React, {
  useState,
  useCallback,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react';
import {View, StyleSheet, TextInput} from 'react-native';
import {GiftedChat, Bubble} from 'react-native-gifted-chat';
import utility from '@utils';
import KeyboardManager from 'react-native-keyboard-manager';
import {Colors, Metrics, AppStyles, Images} from '@theme';
import {ImageButton} from '@reuseableComponents';

function Chat() {
  const [messages, setMessages] = useState([]);

  const inputRef = useRef();

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'You can’t use up creativity. The more you use, the more you have. ',
        user: {
          _id: 2,
          name: 'React Native',
        },
      },
      {
        _id: 2,
        text: 'Remember that not getting what you want is sometimes a wonderful stroke of luck. ',
        user: {
          _id: 1,
          name: 'React JS',
        },
      },
      {
        _id: 3,
        text: 'The person who says it cannot be done should not interrupt the person who is doing it.',
        user: {
          _id: 2,
          name: 'React Native',
        },
      },
    ]);

    if (utility.isPlatformIOS()) {
      KeyboardManager.setEnable(false);
    }
  }, []);

  const Input = forwardRef(ref => {
    const [val, setVal] = useState('');

    useImperativeHandle(ref, () => ({
      setText: txt => setVal(txt),
      getValue: () => val,
    }));

    return (
      <TextInput
        placeholder="Type your text here …"
        style={styles.inputField}
        placeholderTextColor={Colors.txt.lGrey}
        multiline
        value={val}
        onChangeText={txt => setVal(txt)}
      />
    );
  });

  const renderInputToolbar = () => {
    return (
      <View style={styles.inputContainer}>
        <View style={styles.inputSecContainer}>
          <Input ref={inputRef} />
        </View>
        <ImageButton
          style={styles.sendBtn}
          source={Images.sendBtn}
          onPress={() => {}}
        />
      </View>
    );
  };

  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages),
    );
  }, []);

  const renderBubble = props => <Bubble {...props} {...styles.bubble} />;

  return (
    <View style={styles.container}>
      <GiftedChat
        minInputToolbarHeight={0}
        messagesContainerStyle={styles.messagesContainer}
        renderAvatar={null}
        renderBubble={renderBubble}
        messages={messages}
        user={{_id: 1}}
        renderInputToolbar={() => null}
        isKeyboardInternallyHandled={true}
      />
      {renderInputToolbar()}
    </View>
  );
}

const styles = StyleSheet.create({
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
  img: {width: 160, height: 160, margin: 4, borderRadius: 12},
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
  sendBtn: {
    marginBottom: utility.isPlatformAndroid() ? 0 : Metrics.baseMargin,
  },
});
export default Chat;
