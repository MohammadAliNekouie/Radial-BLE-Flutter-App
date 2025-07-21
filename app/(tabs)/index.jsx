import React, { useState } from 'react';
import {
  ActivityIndicator,
  I18nManager,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import RNEChartsPro from 'react-native-echarts-pro';
import logoImg from '../../assets/images/logo.png';
import useBLE from '../../hooks/useBLE';
import { colors, styles } from '../../styles/stylesheet';




const option = {
  yAxis: {
    type: 'value',
    show: true,
  },
  series: [
    {
      data: [150, 230, 224, 218, 135, 147, 210,150, 230, 224, 218, 135, 147, 210],
      type: 'line',
      areaStyle: {
        color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                    offset: 0, color: '#891126' // color at 0%
                }, {
                    offset: 1, color: '#E01648' // color at 100%
                }],
                global: false // default is false
              },
      },
      lineStyle: {
        color: "#d6d6d7",
      },      
    },
  ],
};


const RealTimeView = ({ bleData = {}, ecgData = [], ppgData = [] }) => {
  const { hr = '74', spo2 = '96' } = bleData;

  return (
    <View style={styles.RealtimeContainer}>
      {/* Section 1: Vitals */}
      <View style={styles.vitalsContainer}>
        <Text style={styles.vitalText}>❤️ HR: {hr} bpm</Text>
        <Text style={styles.vitalText}>🫁 SPO2: {spo2}%</Text>
      </View>

      {/* Section 2: ECG */}
      <View style={styles.ecgContainer}>
        <RNEChartsPro
          option={{
            xAxis: { show: true,data: Array.from({ length: 29 }, (_, i) => i), },
            yAxis: { show: true },
            series: [{
              data: [
                      0, 0.5, 1, 0.4, 0.2, -0.3, -0.6, 0, 0.2, 0.4, 0.1, -0.2, 0, 0.6, 1, 0.5,
                      0.3, 0, -0.4, 0, 0.2, 0.6, 1, 0.7, 0.3, 0, -0.2, 0, 0.2
                    ],
              type: 'line',
              smooth: true,
              lineStyle: { color: '#0077b6' }
            }],
            grid: {
              left: '0%',
              right: '0%',
              top: '0%',
              bottom: '0%',
              height: '70%',
              containLabel: true, // prevents extra space
            }            
          }}
        />        
      </View>
      <Text style={styles.chartTitle}>ECG Signal</Text>

      {/* Section 3: PPG */}
      <View style={styles.ppgContainer}>
        <RNEChartsPro
          option={{
            xAxis: { show: true,data: Array.from({ length: 29 }, (_, i) => i), },
            yAxis: { show: true },
            series: [{
              data: [
                      0, 0.5, 1, 0.4, 0.2, -0.3, -0.6, 0, 0.2, 0.4, 0.1, -0.2, 0, 0.6, 1, 0.5,
                      0.3, 0, -0.4, 0, 0.2, 0.6, 1, 0.7, 0.3, 0, -0.2, 0, 0.2
                    ],
              type: 'line',
              smooth: true,
              lineStyle: { color: '#d62828' }
            }],
            grid: {
              left: '0%',
              right: '0%',
              top: '0%',
              bottom: '0%',
              height: '45%',
              containLabel: true, // prevents extra space
            }                
          }}
        />        
      </View>
      <Text style={styles.chartTitle}>PPG Signal</Text>
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

export default App;