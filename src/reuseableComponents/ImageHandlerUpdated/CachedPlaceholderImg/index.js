import React from 'react';
import {Image, View} from 'react-native';

const CachedPlaceholderImg = ({isProfileImage, source = '', style}) => {
  const profileImg = isProfileImage
    ? require('./placeholder_image/person.png')
    : require('./placeholder_image/imageHolder.png');

  return (
    <View style={styles.container}>
      <Image
        source={source.length ? {uri: source} : profileImg}
        defaultSource={profileImg}
        style={[styles.img, style]}
        blurRadius={1}
      />
    </View>
  );
};

export default CachedPlaceholderImg;

const styles = {
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  img: {
    width: 120,
    height: 120,
    resizeMode: 'cover',
  },
};
