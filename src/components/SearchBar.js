import { BadgeCount, ButtonView } from '@reuseableComponents';
import { AppStyles, Colors, Images, Metrics } from '@theme';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { View, Image, TextInput, StyleSheet, Platform } from 'react-native';


const SearchBar = forwardRef(({ cbOnSearch, onBack, badgeCount, onFilterPress }, ref) => {
    const [txt, setTxt] = useState('');

    useImperativeHandle(ref, () => ({
        getValue: () => txt,
    }));

    const onChangeText = txt => {
        cbOnSearch(txt);
        setTxt(txt);
    };

    return (
        <View style={styles.containerHeader}>
            <View style={styles.containerSearchbar}>
                <ButtonView onPress={onBack} style={styles.containerBackImg}>
                    <Image source={Images.icLeftArrow} />
                </ButtonView>
                <TextInput
                    style={styles.txtInput}
                    placeholder={`Search here`}
                    onChangeText={onChangeText}
                    value={txt}
                    placeholderTextColor={Colors.txt.lGrey}
                />
                <ButtonView onPress={onFilterPress} style={styles.containerFilterImg}>
                    <BadgeCount badgeCount={badgeCount} source={Images.icFilter} />
                </ButtonView>
            </View>

        </View>
    );
});

export default SearchBar;

const styles = StyleSheet.create({
    containerHeader: {
        backgroundColor: Colors.bg.white,
        justifyContent: 'center',
    },
    containerSearchbar: {
        flexDirection: 'row',
        backgroundColor: Colors.bg.bg,
        padding: Metrics.smallMargin,
        paddingTop: Platform.OS == 'android' ? Metrics.heightRatio(10) : 10,
        paddingBottom: Platform.OS == 'android' ? Metrics.heightRatio(0) : 10,
        borderRadius: Metrics.smallMargin,

    },
    containerBackImg: {
        paddingTop: Metrics.widthRatio(7),
        paddingRight: Metrics.baseMargin,
    },
    containerFilterImg: {
        paddingTop: Metrics.widthRatio(4),
        paddingRight: Metrics.baseMargin,
    },
    txtInput: {
        width: '100%',
        paddingRight: Metrics.baseMargin,
        paddingTop: Metrics.widthRatio(2),
        flex: 1,
        ...AppStyles.gbRe(14, Colors.txt.vdGrey),
    },
})