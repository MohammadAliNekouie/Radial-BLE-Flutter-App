import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import logoImg from '../../assets/images/logo.png';
import useBLE from '../../hooks/useBLE';

const RealTimeView = ({ bleData = [] }) => {
  return (
    <View style={styles.contentView}>
      <Text style={styles.sectionTitle}>📈 RealTime Monitoring</Text>
      <Text style={styles.sectionContent}>
        {bleData.length > 0 
          ? `Receiving data (${bleData.length} points)` 
          : "Waiting for data..."}
      </Text>
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
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 22,
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 10,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.font,
  },
  menu: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.accent2Light,
    borderRadius: 10,
    marginVertical: 15,
    paddingVertical: 5,
  },
  menuItem: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 8,
    marginHorizontal: 3,
    flex: 1,
  },
  menuItemActive: {
    backgroundColor: colors.accent1Light,
  },
  menuItemDisabled: {
    backgroundColor: 'transparent',
  },
  menuText: {
    fontWeight: '600',
    fontSize: 12,
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
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: colors.font,
  },
  sectionContent: {
    fontSize: 16,
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
    fontSize: 16,
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
    fontSize: 16,
    fontWeight: '600',
    color: colors.font,
  },
  deviceId: {
    fontSize: 12,
    color: colors.fontMuted,
  },
  deviceRssi: {
    fontSize: 12,
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