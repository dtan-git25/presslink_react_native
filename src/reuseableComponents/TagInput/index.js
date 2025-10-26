import React, { Component } from "react";
import { TextInput, View, Image, TouchableOpacity, Text, Keyboard } from "react-native";
import PropTypes from "prop-types";
import _ from "lodash";
import { ButtonView, AppButton, BorderBtn, AppGradientButton } from "../../reuseableComponents";
import { Images, Metrics, DefaultTheme, Colors, AppStyles, Fonts } from "../../theme";
import { pop } from "../../services/NavigationService";
import { H4 } from "../../components";
import Modal from 'react-native-modals';
import { ModalContent } from "react-native-modals";

// const { colors } = DefaultTheme;
class TagInputContainer extends Component {
    static propTypes = {
        cbEnteredTags: PropTypes.func,
        editable: PropTypes.bool,
        oldTags: PropTypes.array,
        style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
        placeholder: PropTypes.string
    };

    static defaultProps = {
        style: {},
        oldTags: [],
        editable: true

    };

    constructor(props) {
        super(props);
        let tags = _.cloneDeep(this.props.oldTags);
        // if (
        //     props.navigation.state.params &&
        //     props.navigation.state.params.tags
        // ) {
        //     tags = _.cloneDeep(props.navigation.state.params.tags);
        // }
        this.state = { tags, txtVal: "", selectedIndex: -1, isVisible: false };
    }

    onTag = (index) => (ev) => {
        this.setState({
            selectedIndex: index,
            isVisible: true
        });
    };
    removeTag = () => {
        const { selectedIndex, tags } = this.state;
        let tempTags = tags;
        tempTags.splice(selectedIndex, 1);
        this.setState({
            tags: tempTags,
            isVisible: false
        });
        this.props.selectedTags([...this.state.tags])
    }
    hideShowModel = (val = false) => {
        this.setState({
            isVisible: false
        });
    }

    renderTags() {
        return this.state.tags.length
            ? this.state.tags.map((tag, index) => (
                <ButtonView
                    key={`${tag}_${index}`}
                    style={[styles.tagContainer, { backgroundColor: this.props.editable ? Colors.txt.azure : Colors.primary.violet, borderColor: this.props.editable ? Colors.txt.azure : Colors.primary.violet }]}
                    onPress={this.props.editable ? this.onTag(index) : console.log("disabled")}
                // disabled={this.props.editable}
                >
                    <Text style={[styles.txtTag]}>{`${tag} `}</Text>
                    {this.props.editable && <Image source={Images.icCancel} style={{ marginLeft: 10 }} />}
                    {/* <Text style={styles.txtTag}>{`${tag} x`}</Text> */}
                </ButtonView>
            ))
            : null;
    }

    onChangeText = (txt) => {

        // this.setState({
        //     txtVal: txt
        // });
        // this.textInput.clear();

        this.setState({ txtVal: txt }, () => {
            if (txt.trim().length) {
                if (txt.charAt(txt.length - 1) === " ") {
                    this.setState({
                        tags: [...this.state.tags, `${txt.trim()}`],
                        txtVal: ""
                    });
                    //this.textInput.clear();

                    this.props.selectedTags([...this.state.tags, `${txt.trim()}`])
                }
            }
        })


        // if (txt.trim().length) {
        //     if (txt.charAt(txt.length - 1) === " ") {
        //         this.setState({
        //             tags: [...this.state.tags, `${txt.trim()}`],
        //         });
        //         this.textInput.clear();
        //     }
        // }

    };

    renderInput() {
        return (
            <TextInput
                // autoFocus
                ref={(ref) => (this.textInput = ref)}
                onChangeText={this.onChangeText}
                placeholder="Add Keywords (Max Limit 5)"
                style={[styles.tagInput, this.props.style]}
                placeholderTextColor={Colors.txt.lGrey}
                editable={this.props.editable}

                // underlineColorAndroid="transparent"
                value={this.state.txtVal}
                maxLength={42}
                blurOnSubmit={false}
                onSubmitEditing={(event) => this.onSubmitHandler(event)}

            // onSubmitEditing={Keyboard.dismiss}
            />
        );
    }
    handleKeyDown = (e) => {

    }

    onSubmitHandler = (e) => {
        const { txtVal } = this.state;
        let txt = txtVal;
        this.textInput.clear();

        this.setState({ txtVal: txt }, () => {
            if (txt.trim().length) {
                // if (txt.charAt(txt.length - 1) === " ") {
                this.setState({
                    tags: [...this.state.tags, `${txt.trim()}`],
                    txtVal: ""
                });
                //this.textInput.clear();
                // console.log('this.props.selectedTags([...this.state.tags, `${txt.trim()}`])', [...this.state.tags, `${txt.trim()}`])
                this.props.selectedTags([...this.state.tags, `${txt.trim()}`])
            }
            // }
        })

    }

    onAppButton = () => {
        if (
            this.props.navigation.state.params &&
            this.props.navigation.state.params.cbEnteredTags &&
            this.state.tags.length
        ) {
            this.props.navigation.state.params.cbEnteredTags(this.state.tags);
            pop();
        }
    };

    renderAppButton() {
        return (
            <View style={styles.appBtnContainer}>
                <AppButton title="Done" onPress={this.onAppButton} />
            </View>
        );
    }

    render() {
        const { isVisible, tags } = this.state;

        return (
            <View style={styles.container}>
                {/* <Text style={[styles.txtTagTitle]}>Tags:</Text> */}
                <View style={styles.rowWrapper}>
                    {this.props.editable && this.renderInput()}
                    {this.renderTags()}

                </View>
                {/* <View style={styles.separator} />
                {this.renderAppButton()} */}

                <Modal
                    visible={isVisible}
                    onTouchOutside={() => this.hideShowModel()}>
                    <ModalContent style={styles.modalContent}>
                        <View style={styles.submitedMsg}>
                            <Text style={styles.submitedMsgTxt}>Delete Keyword</Text>
                            <Text style={styles.CheckoutTitle}>
                                Are you sure you want to delete this Keyword?
                            </Text>
                        </View>
                        <View style={styles.cashOutBottom}>
                            <ButtonView
                                onPress={() => this.hideShowModel()}
                                style={styles.cashOutBtnC}>
                                <Text style={AppStyles.gbRe(16, Colors.SocialButton.red)}>
                                    No
                                </Text>
                            </ButtonView>
                            <ButtonView
                                onPress={() => this.removeTag()}
                                style={styles.cashOutBtnC}>
                                <Text style={AppStyles.gbRe(16, Colors.primary.violet)}>
                                    Yes
                                </Text>
                            </ButtonView>
                        </View>
                    </ModalContent>
                </Modal >

            </View >
        );
    }
}

export default TagInputContainer;

const styles = {
    container: {
        flex: 1,
    },
    txtTagTitle: {
        // ...Fonts.BoldFont(),
        paddingVertical: Metrics.smallMargin,
    },
    rowWrapper: {
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        marginTop: Metrics.heightRatio(5)
        // marginHorizontal: Metrics.baseMargin,
    },
    inputContainer: { justifyContent: "center", },
    tagInput: {
        width: Metrics.screenWidth,
        height: 50,
        color: Colors.txt.VBlue,
        backgroundColor: 'white',
        marginBottom: 10,
        padding: Metrics.heightRatio(12),
        paddingHorizontal: Metrics.heightRatio(10),
        borderRadius: 8,
    },
    tagContainer: {
        // marginBottom: Metrics.heightRatio(-5),
        marginTop: Metrics.heightRatio(10),
        borderWidth: 1,
        height: 30,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        // paddingVertical: Metrics.heightRatio(2),
        paddingHorizontal: Metrics.heightRatio(10),
        marginRight: Metrics.smallMargin,
        marginLeft: Metrics.heightRatio(5),
        borderColor: Colors.txt.azure,
        backgroundColor: Colors.txt.azure,
        flexDirection: "row",
        // paddingBottom: 6,
        // alignItems: 'center',
        // justifyContent: 'center'
    },
    txtTag: {
        color: 'white',
    },
    separator: { flex: 1 },
    appBtnContainer: {
        flexDirection: "row",
        backgroundColor: 'pink',
        padding: Metrics.baseMargin,
    },
    cashOutBtnC: {
        padding: Metrics.baseMargin,
        alignItems: 'center',
        justifyContent: 'center',
        width: '50%',
        borderWidth: 1,
        borderLeftWidth: 0.5,
        borderRightWidth: 0.5,
        borderColor: Colors.txt.lBlue,
    },
    btn: {
        width: Metrics.screenWidth / 2 - 48,
        height: 50,
        marginLeft: 8
    },
    submitedMsg: {
        marginBottom: Metrics.heightRatio(52),
        alignItems: 'center',
    },
    Msg: {
        // marginBottom: Metrics.heightRatio(52),
        // alignItems: 'center',
    },
    submitedMsgTxt: {
        ...AppStyles.gbSb(18),
        marginBottom: Metrics.smallMargin,
        color: 'black'
    },
    cashOutBottom: {
        flexDirection: 'row',
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
    },
    CheckoutModalContent: { marginBottom: Metrics.heightRatio(46) },
    modalContent: { width: Metrics.screenWidth - Metrics.widthRatio(52) },
    CheckoutBtn: {
        width: '30%',
        backgroundColor: Colors.bg.white,
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
        width: '100%',
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
};
