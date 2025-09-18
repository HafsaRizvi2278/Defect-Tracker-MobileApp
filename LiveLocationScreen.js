// LiveLocationScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';

const LiveLocationScreen = ({ navigation, route }) => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isTracking, setIsTracking] = useState(false);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
    })();
  }, []);

  const startLocationTracking = async () => {
    try {
      setIsTracking(true);
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      
      // In a real app, you would send this location to your server
      console.log('Location:', location);
      
      Alert.alert('Location Tracking Started', 'Your location is now being tracked.');
    } catch (error) {
      setErrorMsg('Error getting location');
      console.error('Location error:', error);
    }
  };

  const stopLocationTracking = () => {
    setIsTracking(false);
    Alert.alert('Location Tracking Stopped', 'Your location is no longer being tracked.');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="location" size={80} color="#3498db" style={styles.icon} />
        <Text style={styles.title}>Live Location Tracking</Text>
        <Text style={styles.subtitle}>
          {isTracking 
            ? 'Your location is being tracked in real-time' 
            : 'Start tracking to share your location'
          }
        </Text>
      </View>

      {location && (
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Current Location</Text>
          <View style={styles.infoRow}>
            <Ionicons name="navigate" size={20} color="#3498db" />
            <Text style={styles.infoText}>
              Latitude: {location.coords.latitude.toFixed(6)}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="navigate" size={20} color="#3498db" />
            <Text style={styles.infoText}>
              Longitude: {location.coords.longitude.toFixed(6)}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="speedometer" size={20} color="#3498db" />
            <Text style={styles.infoText}>
              Accuracy: {location.coords.accuracy.toFixed(2)} meters
            </Text>
          </View>
        </View>
      )}

      {errorMsg && (
        <View style={styles.errorContainer}>
          <Ionicons name="warning" size={24} color="#e74c3c" />
          <Text style={styles.errorText}>{errorMsg}</Text>
        </View>
      )}

      <View style={styles.buttonContainer}>
        {!isTracking ? (
          <TouchableOpacity 
            style={[styles.button, styles.startButton]}
            onPress={startLocationTracking}
          >
            <Ionicons name="play" size={20} color="#fff" />
            <Text style={styles.buttonText}>Start Tracking</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={[styles.button, styles.stopButton]}
            onPress={stopLocationTracking}
          >
            <Ionicons name="stop" size={20} color="#fff" />
            <Text style={styles.buttonText}>Stop Tracking</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity 
          style={[styles.button, styles.backButton]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={20} color="#3498db" />
          <Text style={[styles.buttonText, { color: '#3498db' }]}>Back to Details</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Location data is used for work assignment tracking purposes only
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 20,
  },
  infoContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 15,
    textAlign: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#2c3e50',
    marginLeft: 10,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffebee',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    width: '100%',
  },
  errorText: {
    color: '#c62828',
    marginLeft: 10,
    fontSize: 14,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 10,
    marginBottom: 15,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  startButton: {
    backgroundColor: '#27ae60',
  },
  stopButton: {
    backgroundColor: '#e74c3c',
  },
  backButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#3498db',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#fff',
  },
  footer: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  footerText: {
    color: '#95a5a6',
    fontSize: 12,
    textAlign: 'center',
  },
});

export default LiveLocationScreen;