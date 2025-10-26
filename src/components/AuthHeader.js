import React from 'react';
import {TouchableOpacity, Image, Text, View} from 'react-native';
import {AppStyles, Colors, Images, Metrics} from '@theme';
import {pop} from '@nav';

export function AuthHeader({
  title,
  description,
  viewStyle,
  back = false,
  style = {title: null, description: null},
}) {
  return (
    <View
      style={[
        {
          marginTop: Metrics.heightRatio(10),
        },
        viewStyle,
      ]}>
      <View>
        {back && (
          <TouchableOpacity onPress={() => pop()}>
            <Image source={Images.NavigationIcons.Back} />
          </TouchableOpacity>
        )}
      </View>
      <View>
        <Text
          style={[
            AppStyles.gbSb(30, Colors.txt.black),
            {marginBottom: Metrics.smallMargin, marginTop: 20},
            style.title,
          ]}>
          {title}
        </Text>
        <Text
          style={[
            AppStyles.gbMedium(20, Colors.txt.mGrey),
            {lineHeight: 20},
            style.description,
          ]}>
          {description}
        </Text>
      </View>
    </View>
  );
}
