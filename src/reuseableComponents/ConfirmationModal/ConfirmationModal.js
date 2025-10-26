import { ButtonView } from '@reuseableComponents'
import { AppStyles, Colors, Metrics } from '@theme'
import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Modal, { ModalContent } from 'react-native-modals'

const ConfirmationModal = ({ visible, onTouchOutside, title, description, okText = 'Okay', cancelText = "Cancel", onPressOk, onPressCancel }) => {
    return (
        <>
            <Modal
                visible={visible}
                onTouchOutside={onTouchOutside}
            >
                <ModalContent style={styles.modalContent}>

                    <View style={styles.submitedMsg}>
                        <Text style={styles.submitedMsgTxt}>{title}</Text>
                        <Text style={styles.CheckoutTitle}>
                            {description}
                        </Text>
                    </View>
                    <View style={styles.CheckoutBottom}>
                        <ButtonView
                            onPress={onPressCancel}
                            style={styles.CheckoutBtnC}>
                            <Text style={AppStyles.gbRe(16, Colors.SocialButton.red)}>{cancelText}</Text>
                        </ButtonView>
                        <ButtonView
                            onPress={onPressOk}
                            style={styles.CheckoutBtnC}>
                            <Text style={AppStyles.gbRe(16, Colors.primary.violet)}>
                                {okText}
                            </Text>
                        </ButtonView>
                    </View>
                </ModalContent>
            </Modal>
        </>
    )
}

export default ConfirmationModal

const styles = StyleSheet.create({
    submitedMsg: {
        marginBottom: Metrics.heightRatio(52),
        alignItems: 'center',
    },
    modalContent: { width: Metrics.screenWidth - Metrics.widthRatio(52) },

    Msg: {
        // marginBottom: Metrics.heightRatio(52),
        // alignItems: 'center',
    },
    submitedMsgTxt: {
        ...AppStyles.gbSb(18),
        marginBottom: Metrics.smallMargin,
        color: 'black'
    },
    CheckoutTitle: {
        ...AppStyles.gbRe(16),
        paddingHorizontal: Metrics.baseMargin,
        textAlign: 'center',
        lineHeight: 20,
        color: 'black'

    },
    CheckoutBtnTxt: {
        flex: 0,
        color: Colors.primary.violet,
    },
    CheckoutBtnC: {
        padding: Metrics.baseMargin,
        alignItems: 'center',
        justifyContent: 'center',
        width: '50%',
        borderWidth: 1,
        borderLeftWidth: 0.5,
        borderRightWidth: 0.5,
        borderColor: Colors.bg.lGrey,
    },
    CheckoutBottom: {
        flexDirection: 'row',
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
    },
})