import React from 'react';
import { View, Image, Text, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import Swipeout from 'react-native-swipeout';

import {  FlatListHandler, Loader } from '../../reuseableComponents';
import { push } from '../../services/NavigationService';


import { emitLoadRecentChats, emitDeleteChatThread } from './inboxSocketHandler';

import { AppStyles, Images, Metrics, Colors } from '../../theme';

const Chat = ({ navigation }) => {
  const user = useSelector(({ userReducer }) => userReducer.data);
  const [state, setState] = React.useState({ data: [], isFetching: true });

  const Card = item => {

    const { image, name,  time, lastMsg } = item.data;
    return (
      <TouchableOpacity style={styles.item} onPress={() => push('Chat', { otherUser: { ...item.data, id: item.data.usrId } })}>
        <Image source={{ uri: image }} style={styles.userImgs} />
        <View style={styles.marginH}>
          <Text style={AppStyles.gbSb(14, Colors.txt.slate)}>{name}</Text>
          <Text style={styles.desc}>{lastMsg}</Text>
        </View>
        <View style={styles.dot} />
        <Text style={styles.timeAgo}>{time}</Text>
      </TouchableOpacity>
    );
  };

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', (e) => {
      fetchInbox();
    });
    return unsubscribe;
  }, [navigation]);

  const fetchInbox = () => {
    emitLoadRecentChats(user, (res) => {
      console.log('res', res)
      setState({
        data: res.map(
          ({
            target_user_data,
            id,
            last_chat_message,
            unread_message_counts,
          }) => ({
            id,
            usrId: target_user_data.id,
            name: target_user_data.name,
            image: target_user_data.image_url,
            lastMsg: last_chat_message.message,
            cellType: 'MatchesStatus',
            isUnread: +unread_message_counts ? true : false,
          }),
        ),
        isFetching: false,
      });
    });
  };

  const deleteChatItem = (item) => {
    emitDeleteChatThread(
      {
        user_id: user.id,
        chat_room_id: item?.id,
        target_id: item?.usrId,
      },
      fetchInbox,
    );
  };

  const onChat = (otherUser) => () => push('Chat', { otherUser: { ...otherUser, id: otherUser.usrId } });

  function _renderItem({ item }) {
    console.log('item', item)
    return (
      <Swipeout
        autoClose
        style={styles.swipeout}
        right={[
          {
            onPress: () => {
              deleteChatItem(item);
            },
            component: (
              <View style={styles.containerSwipeBtnLeft}>
                <View style={styles.wrapperIcDelete}>
                  <Image source={Images.icTrashChat} style={styles.icDelete} />
                </View>
              </View>
            ),
          },
        ]}>
        <Card data={item} />
      </Swipeout>
    );
  }
  return !state.isFetching ? (
   
    <View style={styles.container}>
      <FlatListHandler
        data={state.data}
        keyExtractor={(item, index) => item.cellType + '-' + index}
        renderItem={_renderItem} />
    </View>
  ) : (
    <View style={styles.containerLoader}>
      <Loader />
    </View>
  );
};

export default Chat;

const styles = {
  container: {
    flex: 1,
    backgroundColor: Colors.bg.bg,
  },
  item: {
    backgroundColor: Colors.txt.white,
    width: Metrics.screenWidth,
    height: 100,

    padding: Metrics.baseMargin,
    flexDirection: 'row',
  },
  swipeout: {
    backgroundColor: Colors.txt.white,
    marginVertical: Metrics.smallMargin,
  },
  containerSwipeBtnLeft: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.SocialButton.red,
  },
  wrapperIcDelete: {
    backgroundColor: Colors.SocialButton.red,
    margin: 15,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  icDelete: {
  },
  userImgs: { width: 40, height: 40, borderRadius: 40 / 2 },
  marginH: { marginHorizontal: Metrics.baseMargin },
  desc: {
    ...AppStyles.gbRe(14, Colors.txt.lGrey),
    width: Metrics.screenWidth - 100,
    lineHeight: 22,
    marginTop: 4,
    color: Colors.txt.mGrey,
  },
  dot: {
    position: 'absolute',
    right: 10,
    top: 10,
    backgroundColor: Colors.primary.violet,
    width: Metrics.heightRatio(8),
    height: Metrics.heightRatio(8),
    borderRadius: Metrics.heightRatio(8) / 2,
  },
  timeAgo: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    ...AppStyles.gbRe(14, Colors.txt.lGrey),
  },
};
