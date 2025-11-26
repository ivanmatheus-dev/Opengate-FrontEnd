import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, Platform, PermissionsAndroid, TouchableOpacity, Animated } from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import CurvedBackground from '../components/CurvedBackground';
import { colors } from '../theme/colors';
import Icon from 'react-native-vector-icons/Feather';
import { Buffer } from 'buffer';

// BLE Constants - REPLACE THESE WITH REAL UUIDS
const SERVICE_UUID = '00000000-0000-0000-0000-000000000000'; // TODO: Replace with ESP32 Service UUID
const CHARACTERISTIC_UUID = '00000000-0000-0000-0000-000000000000'; // TODO: Replace with ESP32 Characteristic UUID
const DEVICE_NAME = 'ESP32_GATE';

const manager = new BleManager();

const HomeScreen = () => {
    const [isScanning, setIsScanning] = useState(false);
    const [connectedDevice, setConnectedDevice] = useState(null);
    const [status, setStatus] = useState('Ready to Open');

    // Pulse animation for the button
    const [pulseAnim] = useState(new Animated.Value(1));

    useEffect(() => {
        startPulse();
        return () => {
            manager.destroy();
        };
    }, []);

    const startPulse = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    };

    const requestPermissions = async () => {
        if (Platform.OS === 'android') {
            if (Platform.Version >= 31) {
                const result = await PermissionsAndroid.requestMultiple([
                    PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
                    PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                ]);
                return (
                    result['android.permission.BLUETOOTH_SCAN'] === PermissionsAndroid.RESULTS.GRANTED &&
                    result['android.permission.BLUETOOTH_CONNECT'] === PermissionsAndroid.RESULTS.GRANTED
                );
            } else {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
                );
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            }
        }
        return true;
    };

    const scanAndConnect = async () => {
        const hasPermissions = await requestPermissions();
        if (!hasPermissions) {
            Alert.alert('Permission Denied', 'Bluetooth permissions are required to open the gate.');
            return;
        }

        setIsScanning(true);
        setStatus('Scanning for Gate...');

        manager.startDeviceScan(null, null, (error, device) => {
            if (error) {
                console.log('Scan error:', error);
                setIsScanning(false);
                setStatus('Scan Failed');
                Alert.alert('Error', 'Bluetooth scan failed. Make sure Bluetooth is on.');
                return;
            }

            if (device && (device.name === DEVICE_NAME || device.localName === DEVICE_NAME)) {
                manager.stopDeviceScan();
                setIsScanning(false);
                setStatus('Connecting...');
                connectToDevice(device);
            }
        });

        // Timeout if not found
        setTimeout(() => {
            if (isScanning) {
                manager.stopDeviceScan();
                setIsScanning(false);
                setStatus('Gate Not Found');
                Alert.alert('Timeout', 'Could not find the gate nearby.');
            }
        }, 10000);
    };

    const connectToDevice = async (device) => {
        try {
            const connected = await device.connect();
            setConnectedDevice(connected);
            await connected.discoverAllServicesAndCharacteristics();
            setStatus('Opening Gate...');
            openGate(connected);
        } catch (error) {
            console.log('Connection error:', error);
            setStatus('Connection Failed');
            Alert.alert('Error', 'Failed to connect to the gate.');
        }
    };

    const openGate = async (device) => {
        try {
            const message = 'OPEN';
            const base64Message = Buffer.from(message).toString('base64');

            await device.writeCharacteristicWithResponseForService(
                SERVICE_UUID,
                CHARACTERISTIC_UUID,
                base64Message
            );

            setStatus('Gate Opened!');
            Alert.alert('Success', 'Porta Aberta com Sucesso!');

            // Disconnect after success
            setTimeout(async () => {
                await device.cancelConnection();
                setConnectedDevice(null);
                setStatus('Ready to Open');
            }, 2000);

        } catch (error) {
            console.log('Write error:', error);
            setStatus('Failed to Open');
            Alert.alert('Error', 'Failed to send open command.');
        }
    };

    const handlePress = () => {
        if (isScanning) return;
        scanAndConnect();
    };

    return (
        <CurvedBackground>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Icon name="bluetooth" size={30} color={colors.text} />
                    <Text style={styles.title}>Control Access</Text>
                </View>

                <View style={styles.content}>
                    <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
                        <Animated.View style={[styles.buttonContainer, { transform: [{ scale: pulseAnim }] }]}>
                            <View style={styles.innerButton}>
                                <Icon name="power" size={60} color={colors.text} />
                                <Text style={styles.buttonText}>OPEN</Text>
                            </View>
                        </Animated.View>
                    </TouchableOpacity>

                    <Text style={styles.statusText}>{status}</Text>
                </View>
            </View>
        </CurvedBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 50,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
        marginLeft: 10,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonContainer: {
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: 'rgba(62, 59, 134, 0.3)', // Semi-transparent primary
        justifyContent: 'center',
        alignItems: 'center',
    },
    innerButton: {
        width: 160,
        height: 160,
        borderRadius: 80,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    buttonText: {
        color: colors.text,
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 10,
    },
    statusText: {
        marginTop: 40,
        color: colors.secondary,
        fontSize: 18,
        fontWeight: '500',
    },
});

export default HomeScreen;
