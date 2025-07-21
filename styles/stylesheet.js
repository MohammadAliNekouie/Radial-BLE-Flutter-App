import { Dimensions, I18nManager, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');
const scaleFont = (size) => (width / 480) * size; // 375 is iPhone 6 base width

const colors = {
  BlueLight: '#2c3179ff',
  BlueBase: '#15183dff',
  RedBase: '#D6214F',
  RedLight: '#E3476F',
  RedPink: '#f2e6ffff',
  fontLight: '#EEE',
  fontdark: '#111',
  fontMuted: '#AAA',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.BlueBase,
    padding: scaleFont(10),  
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: scaleFont(10),
    borderRadius: 22,
  },
  logo: {
    width: 64,
    height: 64,
    marginRight: 10,
    marginTop:15,
    resizeMode: 'contain',
  },
  title: {
    fontSize: scaleFont(20),
    fontWeight: 'bold',
    color: colors.fontLight,
  },
  menu: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.RedPink,
    borderRadius: 10,
    marginVertical: scaleFont(5),
    paddingVertical: scaleFont(5),
  },
  menuItem: {
    paddingHorizontal: scaleFont(12),
    paddingVertical: scaleFont(2),
    borderRadius: 8,
    marginHorizontal: scaleFont(5),
    flex: 1,
    justifyContent : "center",
    alignItems: 'center'    
  },
  menuItemActive: {
    backgroundColor: colors.RedLight,
  },
  menuItemDisabled: {
    backgroundColor: 'transparent',
  },
  menuText: {
    fontWeight: '600',
    fontSize: scaleFont(12),
    textAlign: 'center',
  },
  menuTextInactive: {
    color: colors.fontdark,
  },
  menuTextActive: {
    color: colors.fontLight,
  },
  menuTextDisabled: {
    color: '#a7a7a7ff',
  },
  contentView: {
    backgroundColor: colors.BlueLight,
    padding: 20,
    borderRadius: 12,
    minHeight: 300,
  },
  sectionOne: {
    backgroundColor: colors.BlueLight,
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: colors.RedLight
  },
  sectionTitle: {
    fontSize: scaleFont(18),
    fontWeight: 'bold',
    marginBottom: 15,
    color: colors.fontLight,
  },
  sectionContent: {
    fontSize: scaleFont(14),
    color: colors.fontLight,
    lineHeight: 24,
  },
  scanButton: {
    backgroundColor: colors.RedLight,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: colors.fontLight,
    fontSize: scaleFont(14),
    fontWeight: 'bold',
  },
  deviceCard: {
    backgroundColor: colors.BlueBase,
    padding: 12,
    borderRadius: 10,
    marginTop: 8,
    borderColor: colors.BlueLight,
    borderWidth: 1,
  },
  deviceName: {
    fontSize: scaleFont(14),
    fontWeight: '600',
    color: colors.fontLight,
  },
  deviceId: {
    fontSize: scaleFont(10),
    color: colors.fontMuted,
  },
  deviceRssi: {
    fontSize: scaleFont(10),
    color: colors.fontMuted,
  },
  disconnectButton: {
    backgroundColor: colors.RedBase,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  RealtimeContainer: {
    flex: 1,
    backgroundColor: colors.BlueBase,
    padding: 0,   
  },  
  vitalsContainer: {
    height: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',    
    alignItems: 'center',
    paddingHorizontal: 20,
    marginVertical: scaleFont(10),    
  },
  vitalText: {
    fontSize: scaleFont(16),
    fontWeight: '700',
    color: '#FFF',
    paddingVertical: 0,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
  ecgContainer: {
    marginVertical: scaleFont(5),
    height: height / scaleFont(3),
    padding: 0,
    backgroundColor: colors.BlueBase,
    //borderColor: colors.BlueLight,
    //borderWidth: 2,   
  },
  ppgContainer: {
    marginVertical: scaleFont(5),
    height: height / scaleFont(5),
    padding: 0,
    backgroundColor: colors.BlueBase,
    //borderColor: colors.BlueLight,
    //borderWidth: 2,   
  },
  chartTitle:{
    fontSize: scaleFont(12),
    fontWeight: '700',
    color: '#888',
    textAlign: 'center',
    marginVertical: scaleFont(20),
    zIndex:10,
    //borderColor: colors.BlueLight,
    //borderWidth: 2,     
  },
  formcontainer: {    
    backgroundColor: colors.BlueBase,
    padding: scaleFont(30),
    borderRadius: 16,
    marginVertical: scaleFont(15),
    marginBottom: 64,
  },
  // --- Layout Helpers ---
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  // --- Input Fields ---
  labeledInput: {    
    marginBottom: 20, // Vertical spacing between fields
  },
  label: {
    fontSize: scaleFont(14),
    fontWeight: '500',
    color: colors.fontLight,
    marginBottom: 8,
    textTransform: 'capitalize',
  },
  input: {
    backgroundColor: colors.BlueLight,    
    color: colors.BlueLight,
    fontSize: scaleFont(14),
    paddingHorizontal: scaleFont(14),    
    paddingVertical: scaleFont(12),
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.RedPink,
  },
  // To improve UX, you can add an onFocus style that changes the borderColor to colors.primary
  // --- Date Picker Button ---
  dateButton: {
    flex: 1,
    backgroundColor: colors.BlueLight,
    paddingVertical: scaleFont(14),
    paddingHorizontal: scaleFont(16),
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.RedPink,
    alignItems: 'flex-start', // Align text to the left
  },
  dateText: {
    fontSize: scaleFont(14),
    color: colors.fontLight,
  },
  // --- Checkboxes ---
  checkboxRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.RedPink,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxLabel: {
    marginLeft: 10,
    fontSize: scaleFont(14),
    color: colors.fontLight,
  },
  // --- Action Buttons ---
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24, // More space before final actions
  },
  btn: {
    flex: 1, // Make buttons share space equally
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 10,
    backgroundColor: colors.RedBase,
    marginHorizontal: 8,
  },
  btnText: {
    color: colors.fontLight,
    fontSize: scaleFont(14),
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  ckb: {
    padding: 50,
    color: '#ff402aff',
    backgroundColor: '#ff402aff',
  },
});


export { colors, height, styles, width };

