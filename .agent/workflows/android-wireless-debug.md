---
description: Connect Android device via Wi-Fi (ADB Wireless)
---

1. **Connect via USB first**: Make sure your Android device is connected to the PC via USB and USB Debugging is enabled.

2. **Enable TCP/IP mode**:
   Run the following command to restart ADB in TCP/IP mode:
   ```powershell
   adb tcpip 5555
   ```

3. **Find Device IP**:
   On your Android device, go to **Settings > About phone > Status** (or similar) to find your IP address.
   OR run this command if connected via USB:
   ```powershell
   adb shell ip route
   ```

4. **Connect wirelessly**:
   Disconnect the USB cable.
   Run the following command (replace `<device-ip>` with your phone's IP):
   ```powershell
   adb connect <device-ip>:5555
   ```

5. **Verify connection**:
   ```powershell
   adb devices
   ```
   You should see your device listed with its IP address.

6. **Run the app**:
   Now you can run your app as usual without the cable:
   ```powershell
   npx expo run:android
   ```
