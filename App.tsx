/**
 * Screenshot Toggler React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  NativeModules,
  Alert,
  Button,
  Platform,
  TouchableOpacity,
  Image
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

const { ScreenshotToggleModule } = NativeModules;

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const [isScreenshotEnabled, setIsScreenshotEnabled] = useState(false);

  useEffect(() => {
    if (isScreenshotEnabled) {
      Alert.alert("Screenshot Enabled", "Screenshots are now allowed.");
    }
  }, [isScreenshotEnabled]);

  const toggleScreenshot = async () => {
    try {
      const result = await ScreenshotToggleModule.toggleScreenshot(!isScreenshotEnabled);
      setIsScreenshotEnabled(result);
      // sendStatusToAPI(result);
    } catch (error) {
      Alert.alert("Error", "Failed to toggle screenshot feature");
    }
  };

  const sendStatusToAPI = async (status) => {
    try {
      const deviceInfo = {
        os: Platform.OS,
        deviceName: 'My Device',
        macAddress: '00:00:00:00:00',
        imei: '123456789012345',
        location: 'Unknown',
        publicIP: '192.168.1.1',
        screenshotStatus: status,
      };

      await fetch('apiurl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(deviceInfo)
      });
    } catch (error) {
      console.log("API error", error);
    }
  };

  return (
    <View style={{ flex: 1, flexDirection: 'column' }}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Image source={require('./assets/logo.png')}
          style={{ width: 100, height: 100, marginBottom: 20 }}
          resizeMode="contain" />
        <TouchableOpacity style={{ alignItems: 'center', backgroundColor: 'blue' }} onPress={toggleScreenshot}>
          <Text style={{ color: 'white', margin: 10 }}>{isScreenshotEnabled ? "Activated" : "Activate"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({

});

export default App;
