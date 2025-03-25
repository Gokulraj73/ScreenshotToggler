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
      sendStatusToAPI(result);
    } catch (error) {
      Alert.alert("Error", "Failed to toggle screenshot feature");
    }
  };

  const sendStatusToAPI = async (status) => {
    try {
      const ipresponse = await fetch('https://api64.ipify.org?format=json');
      const ipdata = await ipresponse.json();
      const deviceInfo = {
        os: Platform.OS,
        deviceName: 'My Device',
        macAddress: '00:00:00:00:00',
        imei: '123456789012345',
        location: 'Unknown',
        publicIP: ipdata.ip,
        screenshotStatus: status,
      };

      const response = await fetch('https://run.mocky.io/v3/fafd9263-2f32-4604-b5ca-1079ae1de1da', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(deviceInfo)
      });

      const responseData = await response.json();
      console.log("API Response:", responseData);
    } catch (error) {
      console.log("API error", error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View style={styles.screenContainer}>
        <Image source={require('./assets/logo.png')}
          style={styles.img}
          resizeMode="contain" />
        <TouchableOpacity style={styles.button} onPress={toggleScreenshot}>
          <Text style={styles.buttonText}>{isScreenshotEnabled ? "Activated" : "Activate"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, flexDirection: 'column'
  },
  screenContainer: {
    flex: 1, alignItems: 'center', justifyContent: 'center'
  },
  img: {
    width: 100, height: 100, marginBottom: 20
  },
  button: {
    alignItems: 'center', backgroundColor: 'blue'
  },
  buttonText: {
    color: 'white', margin: 10
  }
});

export default App;
