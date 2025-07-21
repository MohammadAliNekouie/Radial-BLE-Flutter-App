import { Dimensions, I18nManager, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');
const scaleFont = (size) => (width / 480) * size; // 375 is iPhone 6 base width

const colors = {
  primaryDark: '#2c3179ff',
  primaryLight: '#15183dff',
  accent1Dark: '#D6214F',
  accent1Light: '#E3476F',
  accent2Light: '#cfd2ffff',
  font: '#EEE',
  fontdark: '#111',
  fontMuted: '#AAA',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryLight,
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
    color: colors.font,
  },
  menu: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.accent2Light,
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
    backgroundColor: colors.accent1Light,
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
    color: colors.font,
  },
  menuTextDisabled: {
    color: '#a7a7a7ff',
  },
  contentView: {
    backgroundColor: colors.primaryDark,
    padding: 20,
    borderRadius: 12,
    minHeight: 300,
  },
  sectionOne: {
    backgroundColor: colors.primaryDark,
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: colors.accent1Light
  },
  sectionTitle: {
    fontSize: scaleFont(18),
    fontWeight: 'bold',
    marginBottom: 15,
    color: colors.font,
  },
  sectionContent: {
    fontSize: scaleFont(14),
    color: colors.font,
    lineHeight: 24,
  },
  scanButton: {
    backgroundColor: colors.accent1Light,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: colors.font,
    fontSize: scaleFont(14),
    fontWeight: 'bold',
  },
  deviceCard: {
    backgroundColor: colors.primaryLight,
    padding: 12,
    borderRadius: 10,
    marginTop: 8,
    borderColor: colors.primaryDark,
    borderWidth: 1,
  },
  deviceName: {
    fontSize: scaleFont(14),
    fontWeight: '600',
    color: colors.font,
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
    backgroundColor: colors.accent1Dark,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  RealtimeContainer: {
    flex: 1,
    backgroundColor: colors.primaryLight,
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
    marginVertical: 5,
    height: height * 0.4,
    padding: 0,
    backgroundColor: colors.primaryLight,
    //borderColor: colors.primaryDark,
    //borderWidth: 2,   
  },
  ppgContainer: {
    marginVertical: 5,
    height: height * 0.15, // 1/3 of top (approx. 15% height * ⅓ ≈ 5%)
    padding: 0,
    backgroundColor: colors.primaryLight,
    //borderColor: colors.primaryDark,
    //borderWidth: 2,   
  },
  chartTitle:{
    fontSize: scaleFont(12),
    fontWeight: '700',
    color: '#888',
    textAlign: 'center',
    zIndex:10,
  }
});


export { colors, height, styles, width };

