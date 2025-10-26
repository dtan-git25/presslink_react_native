import React  from 'react';
import { StyleSheet, Text } from 'react-native';
import { Page } from '@components';
import { AppStyles, Colors, } from '@theme';


const PrivacyPolicy = ({ params }) => {
  return (
    <Page style={styles.container}>
      <Text style={{ ...AppStyles.gbRe(13, Colors.txt.vdGrey) }}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia,
        molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum
        numquam blanditiis harum quisquam eius sed odit fugiat iusto fuga praesentium
        optio, eaque rerum! </Text>
    </Page>
  );
};

export default PrivacyPolicy;

const styles = StyleSheet.create({
});
