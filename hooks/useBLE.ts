/* eslint-disable no-bitwise */
import * as ExpoDevice from "expo-device";
import { useState } from "react";
import { Alert, PermissionsAndroid, Platform } from "react-native";
import base64 from "react-native-base64";
import {
  BleError,
  BleManager,
  Characteristic,
  Device,
} from "react-native-ble-plx";

const DATA_SERVICE_UUID = "0000fee0-0000-1000-8000-00805f9b34fb";
const COLOR_CHARACTERISTIC_UUID = "0000fee1-0000-1000-8000-00805f9b34fb";
const DEVICE_NAME_CHARACTERISTIC_UUID = "00002a00-0000-1000-8000-00805f9b34fb";

interface BLEDataPoint {
  value: number;
  color: string;
  timestamp: number;
}

const bleManager = new BleManager();

function useBLE() {
  const [allDevices, setAllDevices] = useState<Device[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [color, setColor] = useState("white");
  const [bleData, setBleData] = useState<BLEDataPoint[]>([]);

  const requestAndroid31Permissions = async () => {
    const bluetoothScanPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      {
        title: "Scan Permission",
        message: "App needs Bluetooth scanning permission",
        buttonPositive: "OK",
      }
    );
    const bluetoothConnectPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      {
        title: "Connect Permission",
        message: "App needs Bluetooth connecting permission",
        buttonPositive: "OK",
      }
    );
    const fineLocationPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: "Location Permission",
        message: "App needs location permission for BLE",
        buttonPositive: "OK",
      }
    );

    return (
      bluetoothScanPermission === "granted" &&
      bluetoothConnectPermission === "granted" &&
      fineLocationPermission === "granted"
    );
  };

  const requestPermissions = async () => {
    if (Platform.OS === "android") {
      if ((ExpoDevice.platformApiLevel ?? -1) < 31) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Permission",
            message: "Bluetooth Low Energy requires Location",
            buttonPositive: "OK",
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        return await requestAndroid31Permissions();
      }
    } else {
      return true;
    }
  };

  const isDuplicteDevice = (devices: Device[], nextDevice: Device) =>
    devices.findIndex((device) => nextDevice.id === device.id) > -1;

  const scanForPeripherals = () => {
    bleManager.stopDeviceScan();
    setAllDevices([]);
    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log(error);
        return;
      }
      if (device && (device.localName || device.name)) {
        setAllDevices((prevState) => {
          if (!isDuplicteDevice(prevState, device)) {
            return [...prevState, device];
          }
          return prevState;
        });
      }
    });
  };

  const connectToDevice = async (device: Device) => {
    try {
      bleManager.stopDeviceScan();
      const deviceConnection = await bleManager.connectToDevice(device.id);
      setConnectedDevice(deviceConnection);
      await deviceConnection.discoverAllServicesAndCharacteristics();
      startStreamingData(deviceConnection);
      return true;
    } catch (e) {
      console.log("FAILED TO CONNECT", e);
      Alert.alert("Connection Failed", `Could not connect to ${device.name || device.id}`);
      return false;
    }
  };

  const disconnectFromDevice = async () => {
    if (connectedDevice) {
      try {
        await bleManager.cancelDeviceConnection(connectedDevice.id);
        setConnectedDevice(null);
        setColor("white");
        setBleData([]);
      } catch (e) {
        console.log("FAILED TO DISCONNECT", e);
      }
    }
  };

  const onDataUpdate = (
    error: BleError | null,
    characteristic: Characteristic | null
  ) => {
    if (error) {
      console.log(error);
      return;
    } else if (!characteristic?.value) {
      console.log("No Data was received");
      return;
    }

    const rawData = base64.decode(characteristic.value);
    console.log("Received data:", rawData);

    let newColor = "white";
    let value = 0;
    
    // Parse different data formats
    if (rawData.includes("R:")) {
      newColor = "red";
      value = parseFloat(rawData.split(":")[1]) || 0;
    } else if (rawData.includes("G:")) {
      newColor = "green";
      value = parseFloat(rawData.split(":")[1]) || 0;
    } else if (rawData.includes("B:")) {
      newColor = "blue";
      value = parseFloat(rawData.split(":")[1]) || 0;
    } else if (rawData.includes("V:")) {
      value = parseFloat(rawData.split(":")[1]) || 0;
    } else if (!isNaN(parseFloat(rawData))) {
      value = parseFloat(rawData);
    }

    setColor(newColor);
    
    setBleData(prev => {
      const newData = [...prev, { 
        value: value,
        color: newColor,
        timestamp: Date.now()
      }];
      return newData.slice(-100); // Keep last 100 values
    });
  };

  const startStreamingData = async (device: Device) => {
    if (device) {
      device.monitorCharacteristicForService(
        DATA_SERVICE_UUID,
        COLOR_CHARACTERISTIC_UUID,
        onDataUpdate
      );
    } else {
      console.log("No Device Connected");
    }
  };

  return {
    scanForPeripherals,
    requestPermissions,
    connectToDevice,
    allDevices,
    connectedDevice,
    disconnectFromDevice,
    color,
    bleData,
  };
}

export default useBLE;