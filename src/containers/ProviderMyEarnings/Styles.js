import { StyleSheet } from 'react-native';
import { Colors, Metrics, AppStyles } from '@theme';
export default StyleSheet.create({
  container: { flex: 1 },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Metrics.NAVBAR_HEIGHT * 2,
    marginHorizontal: Metrics.baseMargin,
  },
  dollar: {
    marginTop: Metrics.heightRatio(8)
  },
  noreviewText: {
    ...AppStyles.gbRe(14, Colors.txt.lGrey), marginTop: 2, marginLeft: 2
  },
  cashOutBtn: {
    width: '30%',
    backgroundColor: Colors.bg.white,
  },
  cashOutBtnTxt: {
    flex: 0,
    color: Colors.primary.violet,
  },
  filter: {
    flexDirection: 'row',
    alignItems: 'center',
    height: Metrics.heightRatio(80),
    marginTop: Metrics.heightRatio(-40),
    marginHorizontal: Metrics.baseMargin,
    ...AppStyles.lightShadow,

  },
  filterMonthly: {
    flexDirection: 'row',
    borderRadius: Metrics.heightRatio(5),
    flex: 0.7,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    padding: Metrics.heightRatio(12),
  },
  monthlyEarning: {
    borderRadius: Metrics.heightRatio(5),
    flex: 1,
    marginRight: Metrics.baseMargin,
    backgroundColor: '#fff',
    padding: Metrics.heightRatio(12),
  },
  monthlyETxt: {
    ...AppStyles.gbRe(13, Colors.txt.lGrey),
    marginBottom: Metrics.heightRatio(2),
  },
  rowAlign: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropUp: {
    resizeMode: 'cover',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  avater: {
    ...AppStyles.roundImage(42),
    marginRight: Metrics.smallMargin,
  },
  countContainer: {
    // ...AppStyles.centerAligned,
    marginHorizontal: Metrics.baseMargin,
  },
  countText: {
    ...AppStyles.gbSb(26, Colors.txt.white),
  },
  paragraphStyle: {
    ...AppStyles.gbRe(13, Colors.txt.white),
    marginBottom: Metrics.heightRatio(2),
  },
  sectionHeader: {
    ...AppStyles.gbRe(16),
    marginHorizontal: Metrics.doubleBaseMargin,
    marginTop: Metrics.baseMargin,
  },
  counts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: Metrics.doubleBaseMargin,
    paddingBottom: Metrics.xDoubleBaseMargin,
  },
  btnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: Metrics.baseMargin,
  },
  btn: { width: '45%', borderRadius: 10, minHeight: 48 },
  modalContent: { width: Metrics.screenWidth - Metrics.baseMargin },
  selectYear: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: Metrics.smallMargin,
  },
  monthsContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  selected: {
    backgroundColor: Colors.primary.violet,
    paddingHorizontal: Metrics.baseMargin,
    marginVertical: Metrics.smallMargin,
    paddingVertical: Metrics.smallMargin,
    borderRadius: 12,
  },
  unSelected: { padding: Metrics.baseMargin },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bg.lGrey,
    // padding: Metrics.smallMargin,
    borderRadius: 8,
    minHeight: Metrics.heightRatio(36),
    paddingHorizontal: Metrics.heightRatio(10),
    // height: Metrics.heightRatio(25),
    // paddingBottom: Metrics.heightRatio(10),
    marginVertical: Metrics.smallMargin,
  },
  input: {
    flex: 1,
  },
  cashoutTitle: {
    ...AppStyles.gbRe(16),
    paddingHorizontal: Metrics.baseMargin,
    textAlign: 'center',
    marginBottom: Metrics.smallMargin,
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
  cashOutBottom: {
    flexDirection: 'row',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  submitedMsg: {
    marginBottom: Metrics.heightRatio(52),
    alignItems: 'center',
  },
  submitedMsgTxt: {
    ...AppStyles.gbSb(18),
    marginBottom: Metrics.smallMargin,
  },
  cashOutModalContent: { marginBottom: Metrics.heightRatio(46) },
});
