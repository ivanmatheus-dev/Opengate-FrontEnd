// Mock implementation for Web
class BleManagerMock {
    constructor() {
        console.log('BleManager initialized in Web Mode (Mock)');
    }

    startDeviceScan(uuids, options, listener) {
        console.log('Web Mock: startDeviceScan called');
        // Simulate a scan failure or empty scan on web since we can't really scan
        // Or we could simulate finding a device for testing UI flow
        if (listener) {
            // Simulate not finding anything or immediate error
            // listener(new Error('Bluetooth not supported on web'), null);
        }
    }

    stopDeviceScan() {
        console.log('Web Mock: stopDeviceScan called');
    }

    destroy() {
        console.log('Web Mock: destroy called');
    }

    // Add other methods used in HomeScreen as no-ops or mocks
}

const manager = new BleManagerMock();
export default manager;
