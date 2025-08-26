import { useState } from 'react';
import {
  ActivityIndicator,
  I18nManager,
  Image, Pressable,
  ScrollView,
  Text, TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import RNEChartsPro from 'react-native-echarts-pro';
import { CheckBox } from 'react-native-just-checkbox';
import logoImg from '../../assets/images/logo.png';
import { useMaterialPickers } from '../../hooks/datetimepicker';
import useBLE from '../../hooks/useBLE';
import { colors, styles } from '../../styles/stylesheet';


const PickaDate = ({ initialDate, onDateChange }) => {
  const { showTimePicker, showDatePicker } = useMaterialPickers();
  const [date, setDate] = useState(initialDate || new Date());
  const [time, setTime] = useState(new Date());

  const handleDatePress = () => showDatePicker(date, (newDate) => {
    setDate(newDate);
    onDateChange(newDate); // Update parent form
  });
  const handleTimePress = () => showTimePicker(time, setTime);

  return (
    <View style={styles.container}>
      <Pressable onPress={handleDatePress} style={styles.pickerButton}>
        <Text style={styles.label}>📅 Select Date:</Text>
        <Text style={styles.value}>{date.toLocaleDateString()}</Text>
      </Pressable>

      <Pressable onPress={handleTimePress} style={styles.pickerButton}>
        <Text style={styles.label}>⏰ Select Time:</Text>
        <Text style={styles.value}>{time.toLocaleTimeString()}</Text>
      </Pressable>
    </View>
  );
}

const SettingsForm = () => {
  const [form, setForm] = useState({
    fileName: '',
    recordLengthSec: '',
    recordIntervalMin: '',
    notifDelaySec: '',
    startH: '',
    startM: '',
    sleepH: '',
    sleepM: '',
    expiryDate: new Date(),
    agc: false,
    vib: false,
    evo: false
  });

  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleChange = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

    const handleDateChange = (newDate) => {
    handleChange('expiryDate', newDate);
    setShowDatePicker(false); // Hide after selection
  };

  return (
    <View style={styles.formcontainer}>
      {/* Row 1 */}
      <LabeledInput label="📁 File Name:" value={form.fileName} onChangeText={(t) => handleChange('fileName', t)} />

      {/* Row 2-4 */}
      <LabeledInput label="Length of Records (Sec):" value={form.recordLengthSec} onChangeText={(t) => handleChange('recordLengthSec', t)} />
      <LabeledInput label="Time Between Records (Min):" value={form.recordIntervalMin} onChangeText={(t) => handleChange('recordIntervalMin', t)} />
      <LabeledInput label="Time Between Notif and Record (Sec):" value={form.notifDelaySec} onChangeText={(t) => handleChange('notifDelaySec', t)} />

      {/* Row 5 */}
      <View style={styles.row}>
        <LabeledInput label="Start H:" value={form.startH} onChangeText={(t) => handleChange('startH', t)} half />
        <LabeledInput label="Start M:" value={form.startM} onChangeText={(t) => handleChange('startM', t)} half />
      </View>

      {/* Row 6 */}
      <View style={styles.row}>
        <LabeledInput label="Sleep H:" value={form.sleepH} onChangeText={(t) => handleChange('sleepH', t)} half />
        <LabeledInput label="Sleep M:" value={form.sleepM} onChangeText={(t) => handleChange('sleepM', t)} half />
      </View>

      {/* Row 7 */}
      <View style={styles.row}>
        <Pressable onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
          <Text style={styles.dateText}>📆 Expiry: {form.expiryDate.toLocaleDateString()}</Text>
        </Pressable>
      </View>

      {/* Conditionally render PickaDate */}
      {showDatePicker && (
        <PickaDate 
          initialDate={form.expiryDate} 
          onDateChange={handleDateChange} // Pass prop to update form
        />
      )}     

      <View style={styles.checkboxRow}>
        <Checkbox style={styles.ckb} isChecked={true} checkColor="#ff2121ff" fillColor="#fefeffff" fillMode={true} label="AGC"  onPress={(v) => handleChange('agc', v)} />
        <Checkbox style={styles.ckb} isChecked={true} checkColor="#ff2121ff" fillColor="#fefeffff" fillMode={true} label="Vib"  onPress={(v) => handleChange('vib', v)} />
        <Checkbox style={styles.ckb} isChecked={true} checkColor="#ff2121ff" fillColor="#fefeffff" fillMode={true} label="Evo"  onPress={(v) => handleChange('evo', v)} />
      </View>

      {/* Row 8 */}
      <View style={styles.buttonRow}>
        <Pressable style={styles.btn} onPress={() => console.log('Update')}>
          <Text style={styles.btnText}>UPDATE SETTING</Text>
        </Pressable>
        <Pressable style={styles.btn} onPress={() => console.log('Read')}>
          <Text style={styles.btnText}>READ SETTING</Text>
        </Pressable>
      </View>
    </View>
  );
};

const LabeledInput = ({ label, value, onChangeText, half = false }) => (
  <View style={[styles.labeledInput, half && { flex: 1, marginHorizontal: 5 }]}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      keyboardType="default"
    />
  </View>
);

const Checkbox = ({ label, value, onValueChange }) => (
  <View style={styles.checkboxContainer}>
    <CheckBox value={value} onValueChange={onValueChange} />
    <Text style={styles.checkboxLabel}>{label}</Text>
  </View>
);


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
    <SettingsForm />
  </View>
);

const ServerSyncView = () => {
  // A helper function to handle button presses
  const handlePress = (buttonName) => {
    console.log(`Action: ${buttonName}`);
    // TODO: Add specific logic for each button here
  };

  return (
    <View style={styles.contentView}>
      <Text style={styles.sectionTitle}>☁️ Server Sync</Text>

      {/* Button 1: Sync With Server */}
      <Pressable
        style={styles.syncButton}
        onPress={() => handlePress('Sync With Server')}>
        <Text style={styles.syncButtonText}>Sync With Server</Text>
      </Pressable>

      {/* Button 2: Update AFE Config */}
      <Pressable
        style={styles.syncButton}
        onPress={() => handlePress('Update AFE Config')}>
        <Text style={styles.syncButtonText}>Update AFE Config</Text>
      </Pressable>

      {/* Button 3: Update Firmware */}
      <Pressable
        style={styles.syncButton}
        onPress={() => handlePress('Update Firmware')}>
        <Text style={styles.syncButtonText}>Update Firmware</Text>
      </Pressable>

      {/* Button 4: Reset to Factory Settings */}
      <Pressable
        style={[styles.syncButton, styles.factoryResetButton]}
        onPress={() => handlePress('Reset to Factory Settings')}>
        <Text style={styles.syncButtonText}>Reset to Factory Settings</Text>
      </Pressable>
    </View>
  );
};

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
        {isConnecting && <ActivityIndicator size="large" color={colors.RedPink} style={{marginVertical: 10}}/>}
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