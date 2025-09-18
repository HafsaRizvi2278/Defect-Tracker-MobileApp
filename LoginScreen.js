// Updated LoginScreen.js with better error handling
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // Adjust path as needed

const LoginScreen = ({ navigation }) => {
  const [employeeId, setEmployeeId] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!employeeId.trim() || !otp.trim()) {
      Alert.alert('Error', 'Please enter both Employee ID and OTP');
      return;
    }

    setLoading(true);
    
    try {
      // Query employees collection for matching ID and OTP
      const employeesRef = collection(db, "employees");
      const employeeQuery = query(
        employeesRef, 
        where("id", "==", employeeId),
        where("assignedCode", "==", otp)
      );
      
      const employeeSnapshot = await getDocs(employeeQuery);
      console.log("Employee query completed. Found:", employeeSnapshot.size, "matches");

      if (employeeSnapshot.empty) {
        Alert.alert('Login Failed', 'No employee found with provided credentials');
        return;
      }

      const employeeData = employeeSnapshot.docs[0].data();
      console.log("Employee data:", employeeData);

      // Check if employee has assignments
      const assignmentsRef = collection(db, "assignments");
      const assignmentQuery = query(
        assignmentsRef, 
        where("employeeId", "==", employeeId)
      );
      
      const assignmentSnapshot = await getDocs(assignmentQuery);
      console.log("Assignment query completed. Found:", assignmentSnapshot.size, "assignments");

      if (assignmentSnapshot.empty) {
        // Employee exists but has no assignments
        Alert.alert(
          'Login Issue', 
          'Your account exists but has no assigned projects. Please contact administrator.',
          [
            {
              text: 'OK',
              onPress: () => {
                // Still allow login but with a warning
                navigation.replace('Details', {
                  employeeId: employeeId,
                  assignedCode: otp,
                  employeeName: employeeData.name || 'Employee'
                });
              }
            }
          ]
        );
      } else {
        // Employee has assignments - proceed normally
        const assignmentData = assignmentSnapshot.docs[0].data();
        
        navigation.replace('Details', {
          employeeId: employeeId,
          assignedCode: otp,
          employeeName: employeeData.name || 'Employee',
          assignment: assignmentData
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'An error occurred during login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Image
            source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }}
            style={styles.logo}
          />
          <Text style={styles.title}>Defect Tracker</Text>
          <Text style={styles.subtitle}>Employee Login</Text>
        </View>

        {/* Login Form */}
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color="#7f8c8d" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Employee ID"
              placeholderTextColor="#95a5a6"
              value={employeeId}
              onChangeText={setEmployeeId}
              autoCapitalize="characters"
              editable={!loading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#7f8c8d" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="OTP Code"
              placeholderTextColor="#95a5a6"
              value={otp}
              onChangeText={setOtp}
              secureTextEntry={!showPassword}
              keyboardType="numeric"
              maxLength={6}
              editable={!loading}
            />
            <TouchableOpacity 
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              <Ionicons 
                name={showPassword ? "eye-off-outline" : "eye-outline"} 
                size={20} 
                color="#7f8c8d" 
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginButtonText}>Login</Text>
            )}
          </TouchableOpacity>

          <View style={styles.helpTextContainer}>
            <Text style={styles.helpText}>
              Don't have an OTP? Contact your administrator.
            </Text>
          </View>
        </View>

        {/* Admin Info (for debugging) */}
        <View style={styles.debugContainer}>
          <Text style={styles.debugText}>Test Credentials:</Text>
          <Text style={styles.debugText}>EMP007 / 529053 (No assignments)</Text>
          <Text style={styles.debugText}>EMP008 - Does not exist</Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Defect Tracker System v1.0</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 20,
    borderRadius: 40,
    backgroundColor: '#e1e8ed',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e1e8ed',
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 15,
    height: 50,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#2c3e50',
  },
  eyeIcon: {
    padding: 5,
  },
  loginButton: {
    backgroundColor: '#3498db',
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonDisabled: {
    backgroundColor: '#bdc3c7',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  helpTextContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  helpText: {
    color: '#7f8c8d',
    fontSize: 14,
    textAlign: 'center',
  },
  debugContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#fff3e0',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#ff9800',
  },
  debugText: {
    color: '#e65100',
    fontSize: 12,
    marginBottom: 5,
  },
  footer: {
    marginTop: 30,
    alignItems: 'center',
  },
  footerText: {
    color: '#95a5a6',
    fontSize: 12,
  },
});

export default LoginScreen;