import React, { useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import logoImg from '../../assets/images/logo.png';
import useBLE from '../../hooks/useBLE';

const App = () => {
  const {
    allDevices,
    requestPermissions,
    scanForPeripherals,
    connectToDevice,
    checkBluetoothState,
  } = useBLE();

  const [isModalVisible, setIsModalVisible] = useState(false);
  
  const scanForDevices = async () => {
    const isPermissionsEnabled = await requestPermissions();
    if (isPermissionsEnabled) {
      console.log('Bluetooth have permissions')
      const isReady = await checkBluetoothState();
      if (isReady) {
        scanForPeripherals();
      }
    }
  };

  const openModal = async () => {
    await scanForDevices();
    setIsModalVisible(true);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => console.log('Radial')}>
          <Image source={logoImg} style={styles.logo}/>
        </TouchableOpacity>
        <Text style={styles.title}>Radial Connector</Text>
      </View>

      {/* Menu */}
      <View style={styles.menu}>
        {['Scan', 'RealTime ECG', 'RealTime PPG' , 'Manual Settings','Server Sync'].map((item) => (
          <TouchableOpacity key={item} style={styles.menuItem}>
            <Text style={styles.menuText}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Section 1 */}
      <TouchableOpacity onPress={() => openModal()}>
        <View style={styles.sectionOne}>
          <Text style={styles.sectionTitle}>🔍 BLE Scanner</Text>
          <Text style={styles.sectionContent}>Tap to start scanning devices nearby.</Text>
        </View>
      </TouchableOpacity>

      {/* Section 2 */}
      <View style={styles.sectionTwo}>
        <Text style={styles.sectionTitle}>📡 Discovered Devices</Text>

        {allDevices.length === 0 ? (
          <Text style={styles.sectionContent}>No devices found yet...</Text>
        ) : (
          allDevices.map((device) => (
            <TouchableOpacity
              key={device.id}
              style={styles.deviceCard}
              onPress={() => connectToDevice(device)}
            >
              <Text style={styles.deviceName}>
                {device.name || device.localName || 'Unnamed Device'}
              </Text>
              <Text style={styles.deviceId}>{device.id}</Text>
              <Text style={styles.deviceRssi}>Signal: {device.rssi}</Text>
            </TouchableOpacity>
          ))
        )}
      </View>

    </ScrollView>
  );
};

export default App;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#070030ff',
    padding: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#003366',
    padding: 15,
    borderRadius: 12,
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
    color: '#ffffff',
  },
  menu: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#0077cc',
    borderRadius: 10,
    marginVertical: 15,
    paddingVertical: 10,
  },
  menuItem: {
    paddingHorizontal: 10,
  },
  menuText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
  sectionOne: {
    backgroundColor: '#e6f2ff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
  },
  sectionTwo: {
    backgroundColor: '#fff0f0',
    padding: 20,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  sectionContent: {
    fontSize: 16,
    color: '#333',
  },
  deviceCard: {
    backgroundColor: '#f8f8ff',
    padding: 12,
    borderRadius: 10,
    marginTop: 8,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#004080',
  },
  deviceId: {
    fontSize: 12,
    color: '#888',
  },
  deviceRssi: {
  fontSize: 12,
  color: '#999',
  },
menuItemDisabled: {
  backgroundColor: '#a9a9a9', // muted gray
  borderRadius: 6,
  paddingHorizontal: 10,
},

menuTextDisabled: {
  color: '#dddddd', // light gray text
},

});
