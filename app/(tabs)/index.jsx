import React, { useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  I18nManager,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import RNEChartsPro from 'react-native-echarts-pro';
import logoImg from '../../assets/images/logo.png';
import useBLE from '../../hooks/useBLE';


const { width, height } = Dimensions.get('window');
const scaleFont = (size) => (width / 480) * size; // 375 is iPhone 6 base width

const pieOption = {
  series: [
    {
      name: 'Source',
      type: 'pie',
      radius: '55%',
      center: ['50%', '35%'],
      startAngle: 180,
      data: [
        { value: 105.2, name: 'Android' },
        { value: 310, name: 'iOS' },
        { value: 234, name: 'Web' },
      ],
      label: {
        show: true,
        fontSize: 12,
        color: '#ffffffff',
      },
    },
  ],
};


const RealTimeView = ({ bleData = [] }) => {
  return (
    <View style={styles.contentView}>
      <Text style={styles.sectionTitle}>📈 RealTime Monitoring</Text>
      <View style={{ height: 300, paddingTop: 25 }}>
        <RNEChartsPro height={250} option={pieOption} />
      </View>
    </View>
  );
};

const ManualSettingsView = () => (
  <View style={styles.contentView}>
    <Text style={styles.sectionTitle}>⚙️ Manual Settings</Text>
    <Text style={styles.sectionContent}>Device settings will be configured here...</Text>
  </View>
);

const ServerSyncView = () => (
  <View style={styles.contentView}>
    <Text style={styles.sectionTitle}>☁️ Server Sync</Text>
    <Text style={styles.sectionContent}>Data synchronization options will be here...</Text>
  </View>
);

I18nManager.forceRTL(false);
I18nManager.allowRTL(false);

const App = () => {
  const {
    allDevices,
    requestPermissions,
    scanForPeripherals,
    connectToDevice,
    connectedDevice,
    disconnectFromDevice,
    color,
    bleData
  } = useBLE();

  const [activeTab, setActiveTab] = useState('Scan');
  const [isConnecting, setIsConnecting] = useState(false);

  const scanForDevices = async () => {
    const isPermissionsEnabled = await requestPermissions();
    if (isPermissionsEnabled) {
      scanForPeripherals();
    }
  };

  const handleConnectToDevice = async (device) => {
    setIsConnecting(true);
    const success = await connectToDevice(device);
    setIsConnecting(false);
    if (success) {
      setActiveTab('RealTime Monitoring');
    }
  };

  const handleDisconnect = () => {
    disconnectFromDevice();
    setActiveTab('Scan');
  };

  const menuItems = ['Scan', 'RealTime Monitoring', 'Manual Settings', 'Server Sync'];
  const isDeviceConnected = Boolean(connectedDevice);

  const ScanView = () => (
    <>
      {isDeviceConnected && (
        <View style={styles.sectionOne}>
          <Text style={styles.sectionTitle}>✅ Connected</Text>
          <Text style={styles.sectionContent}>
            Device: {String(connectedDevice.name || 'Unnamed Device')}
          </Text>
          <TouchableOpacity
            style={styles.disconnectButton}
            onPress={handleDisconnect}
          >
            <Text style={styles.buttonText}>Disconnect</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.contentView}>
        <TouchableOpacity onPress={scanForDevices} style={styles.scanButton}>
          <Text style={styles.buttonText}>🔍 Tap to Scan for Devices</Text>
        </TouchableOpacity>
        <Text style={styles.sectionTitle}>📡 Discovered Devices</Text>
        {isConnecting && <ActivityIndicator size="large" color={colors.accent2Light} style={{marginVertical: 10}}/>}
        {allDevices.length === 0 && !isConnecting ? (
          <Text style={styles.sectionContent}>No devices found yet...</Text>
        ) : (
          allDevices.map((device) => (
            <TouchableOpacity
              key={device.id}
              style={styles.deviceCard}
              onPress={() => handleConnectToDevice(device)}
              disabled={isConnecting}
            >
              <Text style={styles.deviceName}>
                {String(device.name || device.localName || 'Unnamed Device')}
              </Text>
              <Text style={styles.deviceId}>{String(device.id)}</Text>
              <Text style={styles.deviceRssi}>Signal: {String(device.rssi)}</Text>
            </TouchableOpacity>
          ))
        )}
      </View>
    </>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={logoImg} style={styles.logo}/>
        <Text style={styles.title}>Radial Connector</Text>
      </View>

      <View style={styles.menu}>
        {menuItems.map((item) => {
          const isDisabled = !isDeviceConnected && item !== 'Scan';
          const isActive = activeTab === item;

          return (
            <TouchableOpacity
              key={item}
              style={[
                styles.menuItem,
                isDisabled && styles.menuItemDisabled,
                isActive && !isDisabled && styles.menuItemActive
              ]}
              disabled={isDisabled}
              onPress={() => setActiveTab(item)}
            >
              <Text style={[
                styles.menuText,
                isDisabled ? styles.menuTextDisabled : (isActive ? styles.menuTextActive : styles.menuTextInactive)
              ]}>
                {item}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View>
        {activeTab === 'Scan' && <ScanView />}
        {activeTab === 'RealTime Monitoring' && <RealTimeView bleData={bleData} />}
        {activeTab === 'Manual Settings' && <ManualSettingsView />}
        {activeTab === 'Server Sync' && <ServerSyncView />}
      </View>
    </ScrollView>
  );
};

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
    padding: scaleFont(20),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: scaleFont(15),
    borderRadius: 22,
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 10,
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
    marginVertical: scaleFont(15),
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
    verticalAlign: 'middle',
    textAlignVertical: 'center',
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
});

export default App;