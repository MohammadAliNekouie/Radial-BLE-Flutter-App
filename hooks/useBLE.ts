/* eslint-disable no-bitwise */
import { useState } from "react";
import { PermissionsAndroid, Platform } from "react-native";

import * as ExpoDevice from "expo-device";

import base64 from "react-native-base64";
import {
  BleError,
  BleManager,
  Characteristic,
  Device,
} from "react-native-ble-plx";

const DATA_SERVICE_UUID =               "0000180D-0000-1000-8000-00805f9b34fb"; // Standard Heart Rate Service UUID + Bluetooth Base UUID
const COLOR_CHARACTERISTIC_UUID =       "00002a37-0000-1000-8000-00805f9b34fb"; // Standard Heart Rate Measurement Characteristic UUID + Bluetooth Base UUID

const GENERIC_ACCESS_SERVICE_UUID =     "00001800-0000-1000-8000-00805f9b34fb";
const DEVICE_NAME_CHARACTERISTIC_UUID = "00002a00-0000-1000-8000-00805f9b34fb";

const bleManager = new BleManager();

function useBLE() {
  const [allDevices, setAllDevices] = useState<Device[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [color, setColor] = useState("white");

  const requestAndroid31Permissions = async () => {
    const bluetoothScanPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      {
        title: "Location Permission",
        message: "Bluetooth Low Energy requires Location",
        buttonPositive: "OK",
      }
    );
    const bluetoothConnectPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      {
        title: "Location Permission",
        message: "Bluetooth Low Energy requires Location",
        buttonPositive: "OK",
      }
    );
    const fineLocationPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: "Location Permission",
        message: "Bluetooth Low Energy requires Location",
        buttonPositive: "OK",
      }
    );

    return (
      bluetoothScanPermission === "granted" &&
      bluetoothConnectPermission === "granted" &&
      fineLocationPermission === "granted"
    );
  };

  const checkBluetoothState = async () => {
    const state = await bleManager.state();
    if (state !== 'PoweredOn') {
      console.log('Bluetooth turned Off');
      return false;
    }
    console.log('Bluetooth is On');
    return true;
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
        const isAndroid31PermissionsGranted =
          await requestAndroid31Permissions();

        return isAndroid31PermissionsGranted;
      }
    } else {
      return true;
    }
  };

  /*
 const connectToDevice = async (device: Device) => {
    try {
      console.log(`Attempting to connect to: ${device.name || 'Unnamed Device'} (ID: ${device.id})`);
      const deviceConnection = await bleManager.connectToDevice(device.id);
      setConnectedDevice(deviceConnection);
      // Discover all services
      await deviceConnection.discoverAllServicesAndCharacteristics();
      bleManager.stopDeviceScan(); 

      console.log("--- DEBUG: Discovering Services on Device ---");
      // listing all services
      const services = await deviceConnection.services();

      if (services.length === 0) {
        console.log("Warning: No services were found on this device.");
      } else {        console.log("Available Services Found:");

        for (const service of services) {
          console.log(`- Checking Service UUID: ${service.uuid}`);
          if (service.uuid.toUpperCase() === GENERIC_ACCESS_SERVICE_UUID.toUpperCase()) {
            try {
              console.log("Found Generic Access Service. Reading Device Name...");
              const characteristic = await device.readCharacteristicForService(
                GENERIC_ACCESS_SERVICE_UUID,
                DEVICE_NAME_CHARACTERISTIC_UUID
              );

              if (characteristic?.value) {
                const deviceName = base64.decode(characteristic.value);
                console.log(`✅ Decoded Device Name: ${deviceName}`);
              }

            } catch (error) {
              console.log("❌ Error reading the device name characteristic:", error);
            }
            break;
          }
        }
      }      console.log("--- DEBUG: End of Service Discovery ---");

      startStreamingData(deviceConnection);
    } catch (e) {
      console.log("FAILED TO CONNECT OR DISCOVER SERVICES", e);
    }
  };
  */

    const connectToDevice = async (device: Device) => {
    try {
      console.log(`Attempting to connect to: ${device.name || 'Unnamed Device'} (ID: ${device.id})`);
      const deviceConnection = await bleManager.connectToDevice(device.id);
      setConnectedDevice(deviceConnection);

      // Discover all services & Characteristics
      await deviceConnection.discoverAllServicesAndCharacteristics();
      bleManager.stopDeviceScan();    

      console.log("--- DEBUG: Discovering All Services and Characteristics ---");
      // listing all services
      const services = await deviceConnection.services();

      if (services.length === 0) {
        console.log("Warning: No services were found on this device.");
      } else {
        console.log("Available Services and Characteristics Found:");
        
        //for loop for working with await
        for (const service of services) {
          console.log(`- Service UUID: ${service.uuid}`);
                    try {
            //get the characteristics of each services
            const characteristics = await service.characteristics();
            
            if (characteristics.length === 0) {
              console.log("    - No characteristics found for this service.");
            } else {
              // print characteristics
              for (const char of characteristics) {
                const props = [];
                if (char.isReadable) props.push("READ");
                if (char.isWritableWithResponse) props.push("WRITE");
                if (char.isWritableWithoutResponse) props.push("WRITE NO RESPONSE");
                if (char.isNotifiable) props.push("NOTIFY");
                if (char.isIndicatable) props.push("INDICATE");

                // Read Device name characteristics
                if (char.uuid.toUpperCase() === DEVICE_NAME_CHARACTERISTIC_UUID.toUpperCase()) {
                  try {
                    console.log("Found Generic Access Service. Reading Device Name...");
                    const characteristic = await device.readCharacteristicForService(
                      service.uuid,
                      DEVICE_NAME_CHARACTERISTIC_UUID
                    );

                    if (characteristic?.value) {
                      const deviceName = base64.decode(characteristic.value);
                      console.log(`✅   - Char UUID: ${char.uuid} | Properties: [${props.join(', ')}]  ${deviceName}`);
                    }
                  } catch (error) {
                    console.log(`❌   - Char UUID: ${char.uuid} | Properties: [${props.join(', ')}]  Error reading the device name: `,error);
                  }
                  break;
                }
                else
                {
                  console.log(
                    `    - Char UUID: ${char.uuid} | Properties: [${props.join(', ')}]`
                  );
                }
              }
            }
          } catch (error) {
            console.log(`    - ERROR: Could not get characteristics for service ${service.uuid}`, error);
          }
        }
      }      console.log("--- DEBUG: End of Discovery ---");

      //now we can work with the data
      startStreamingData(deviceConnection);
    } catch (e) {      console.log("FAILED TO CONNECT OR DISCOVER SERVICES", e);
    }
  };

  const isDuplicteDevice = (devices: Device[], nextDevice: Device) =>
    devices.findIndex((device) => nextDevice.id === device.id) > -1;

  const scanForPeripherals = () => {
    console.log("Stop last active scan");
    bleManager.stopDeviceScan();
    console.log("Scanning...");
    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log(error);
      }
      
      if (
        device &&
        (device.localName || device.name)
      ) {
        setAllDevices((prevState: Device[]) => {
          if (!isDuplicteDevice(prevState, device)) {
            console.log("Found device:", device.name || device.localName || "Unnamed", device.id);
            return [...prevState, device];
          }
          return prevState;
        });
      }
    });
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

    const colorCode = base64.decode(characteristic.value);

    let color = "white";
    if (colorCode === "B") {
      color = "blue";
    } else if (colorCode === "R") {
      color = "red";
    } else if (colorCode === "G") {
      color = "green";
    }

    setColor(color);
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
    connectToDevice,
    allDevices,
    connectedDevice,
    color,
    checkBluetoothState,
    requestPermissions,
    scanForPeripherals,
    startStreamingData,
  };
}

export default useBLE;
