import React from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';

import { TouchableOpacity } from 'react-native-gesture-handler';
import { AppStyles, Colors, Images, Metrics } from '@theme';
import { FlatListHandler, NavTitle } from '@reuseableComponents';
import Swipeout from 'react-native-swipeout';
import { push } from '@nav';

function Inbox(params) {
  const Card = item => {
    const { userImg, name, dec, time } = item.data;
    return (
      <TouchableOpacity style={styles.item} onPress={() => push('Chat')}>
        <Image source={{ uri: userImg }} style={styles.userImgs} />
        <View style={styles.marginH}>
          <Text style={AppStyles.gbSb(14, Colors.txt.slate)}>{name}</Text>
          <Text style={styles.desc}>{dec}</Text>
        </View>
        <View style={styles.dot} />
        <Text style={styles.timeAgo}>{time}</Text>
      </TouchableOpacity>
    );
  };

  function _renderItem({ item }) {
    return (
      <Swipeout
        autoClose
        style={styles.swipeout}
        right={[
          {
            onPress: () => { },
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

  return (
    <View style={styles.container}>
      {/* <NavTitle title={'Chat'} /> */}
      <FlatListHandler data={inboxList} renderItem={_renderItem} />
    </View>
  );
}

const styles = StyleSheet.create({
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
    // width: Metrics.widthRatio(30),
    // height: Metrics.widthRatio(30),
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
});
export default Inbox;

const inboxList = [
  {
    userImg:
      'https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80',
    name: 'Marie Winter',
    dec: 'Happiness is not something readymade. It comes from your own actions.',
    time: '1 hr ago',
  },
  {
    userImg:
      'https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80',
    name: 'Grant Marshall',
    dec: 'Happiness is not something readymade. It comes from your own actions.',
    time: 'Yesterday',
  },
  {
    userImg:
      'https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80',
    name: 'Duran Clayton',
    dec: 'Happiness is not something readymade. It comes from your own actions.',
    time: '22 Jul',
  },
  {
    userImg:
      'https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80',
    name: 'Julia Petersen',
    dec: 'Happiness is not something readymade. It comes from your own actions.',
    time: '19 Jun',
  },
  {
    userImg:
      'https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80',
    name: 'Burns Marks',
    dec: 'Happiness is not something readymade. It comes from your own actions.',
    time: '19 Jun',
  },
];
