import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { RNCamera } from 'react-native-camera';

const App = () => {
  const [scanning, setScanning] = useState(false);
  const [message, setMessage] = useState('Tap to scan barcode');

  const onBarCodeRead = async ({ data }) => {
    if (scanning) return;
    
    setScanning(true);
    setMessage(`Scanned: ${data}\nUpdating sheet...`);

    try {
      const response = await axios.post('YOUR_GOOGLE_SCRIPT_URL', {
        trackingNumber: data
      });
      
      setMessage(response.data.success 
        ? `Order ${data} marked as returned!` 
        : 'Failed to update sheet');
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setScanning(false);
    }
  };

  return (
    <View style={styles.container}>
      <RNCamera
        style={styles.camera}
        type={RNCamera.Constants.Type.back}
        onBarCodeRead={onBarCodeRead}
        captureAudio={false}
      >
        <View style={styles.overlay}>
          <Text style={styles.message}>{message}</Text>
        </View>
      </RNCamera>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default App;