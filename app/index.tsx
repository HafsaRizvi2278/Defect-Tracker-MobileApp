import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { 
  Alert, 
  StyleSheet, 
  Text, 
  TextInput, 
  View, 
  ActivityIndicator, 
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView
} from "react-native";
import { db, auth } from "../src/firebase"; // Import both db and auth
import { signInAnonymously } from "firebase/auth"; // Import anonymous auth function
import { Ionicons } from '@expo/vector-icons';

// Define types for our data
interface Assignment {
  projectId: string;
  employeeId: string;
  role: string;
  code: string;
}

interface Employee {
  id: string;
  name: string;
  phone: string;
  address: string;
  assignedCode: string;
}

interface Project {
  id: string;
  title: string;
  duration: string;
}

export default function EmployeeLoginApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [employeeId, setEmployeeId] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [authInitialized, setAuthInitialized] = useState(false); // Track auth state

  // Initialize anonymous authentication on component mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log("Initializing anonymous authentication...");
        await signInAnonymously(auth);
        setAuthInitialized(true);
        console.log("Anonymous authentication successful");
      } catch (error) {
        console.error("Anonymous auth error:", error);
        Alert.alert("Error", "Failed to initialize application. Please check your connection.");
      }
    };

    initializeAuth();
  }, []);

  const handleLogin = async () => {
    // Check if authentication is initialized
    if (!authInitialized) {
      Alert.alert("Please wait", "Application is still initializing. Please try again in a moment.");
      return;
    }

    if (!employeeId || !otpCode) {
      Alert.alert("Error", "Please enter Employee ID and OTP Code");
      return;
    }

    // Validate OTP format (6 digits)
    if (!/^\d{6}$/.test(otpCode)) {
      Alert.alert("Invalid OTP", "Please enter a valid 6-digit OTP code");
      return;
    }

    setLoading(true);
    try {
      console.log("Starting login process for employee:", employeeId);
      
      // Check if employee exists with this ID and OTP code
      const employeesRef = collection(db, "employees");
      const employeeQuery = query(
        employeesRef,
        where("id", "==", employeeId.toUpperCase().trim()),
        where("assignedCode", "==", otpCode.trim())
      );

      const employeeSnapshot = await getDocs(employeeQuery);
      console.log("Employee query completed. Found:", employeeSnapshot.size, "matches");

      if (!employeeSnapshot.empty) {
        const employeeData = employeeSnapshot.docs[0].data() as Employee;
        console.log("Employee data:", employeeData);
        setEmployee(employeeData);

        // Get assignment details
        const assignmentsRef = collection(db, "assignments");
        const assignmentQuery = query(
          assignmentsRef,
          where("employeeId", "==", employeeId.toUpperCase().trim())
        );
        
        const assignmentSnapshot = await getDocs(assignmentQuery);
        console.log("Assignment query completed. Found:", assignmentSnapshot.size, "assignments");

        if (!assignmentSnapshot.empty) {
          const assignmentData = assignmentSnapshot.docs[0].data() as Assignment;
          console.log("Assignment data:", assignmentData);
          setAssignment(assignmentData);

          // Get project details if available
          if (assignmentData.projectId) {
            const projectsRef = collection(db, "projects");
            const projectQuery = query(
              projectsRef,
              where("id", "==", assignmentData.projectId)
            );
            
            const projectSnapshot = await getDocs(projectQuery);
            console.log("Project query completed. Found:", projectSnapshot.size, "projects");

            if (!projectSnapshot.empty) {
              const projectData = projectSnapshot.docs[0].data() as Project;
              setProject(projectData);
            }
          }

          setIsLoggedIn(true);
          console.log("Login successful!");
        } else {
          console.log("No assignment found for employee");
          Alert.alert("Info", "No assignment found. Please contact administrator.");
        }
      } else {
        console.log("No employee found with provided credentials");
        Alert.alert("❌ Login Failed", "Invalid Employee ID or OTP Code. Please check your credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Error", "Something went wrong while logging in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setEmployeeId("");
    setOtpCode("");
    setAssignment(null);
    setEmployee(null);
    setProject(null);
  };

  // Show loading screen while auth is initializing
  if (!authInitialized) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Initializing application...</Text>
      </View>
    );
  }

  const renderLoginScreen = () => (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.gradientHeader}>
            <View style={styles.logoContainer}>
              <Text style={styles.logo}>🔒</Text>
              <Text style={styles.appTitle}>Defect Tracker</Text>
              <Text style={styles.appSubtitle}>Employee Login Portal</Text>
            </View>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.welcomeText}>Employee Login</Text>
            <Text style={styles.instructionText}>
              Enter your Employee ID and OTP code to access your assignments
            </Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Employee ID</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your Employee ID (e.g., EMP001)"
                value={employeeId}
                onChangeText={(text) => setEmployeeId(text.toUpperCase())}
                autoCapitalize="characters"
                placeholderTextColor="#aaa"
                autoCorrect={false}
                autoComplete="username"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>OTP Code</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  placeholder="Enter your 6-digit OTP code"
                  value={otpCode}
                  onChangeText={setOtpCode}
                  secureTextEntry={!showPassword}
                  placeholderTextColor="#aaa"
                  autoCorrect={false}
                  autoComplete="off"
                  keyboardType="numeric"
                  maxLength={6}
                />
                <TouchableOpacity 
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons 
                    name={showPassword ? "eye-off" : "eye"} 
                    size={24} 
                    color="#7f8c8d" 
                  />
                </TouchableOpacity>
              </View>
              <Text style={styles.otpNote}>
                6-digit code provided by your administrator
              </Text>
            </View>

            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3498db" />
                <Text style={styles.loadingText}>Verifying credentials...</Text>
              </View>
            ) : (
              <TouchableOpacity 
                style={[styles.loginButton, loading && styles.loginButtonDisabled]}
                onPress={handleLogin}
                disabled={loading}
                activeOpacity={0.7}
              >
                <Text style={styles.loginButtonText}>Login to Portal</Text>
              </TouchableOpacity>
            )}

            <View style={styles.helpContainer}>
              <Text style={styles.helpText}>
                Don't have an OTP? Contact your administrator
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );

  const renderDetailsScreen = () => (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.detailsContainer}>
        <View style={styles.successHeader}>
          <View style={styles.successContent}>
            <Text style={styles.successIcon}>✅</Text>
            <Text style={styles.successTitle}>Welcome, {employee?.name}!</Text>
            <Text style={styles.successSubtitle}>You're successfully logged in</Text>
          </View>
        </View>

        <View style={styles.detailsCard}>
          {/* Employee Information */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Employee Information</Text>
          </View>
          
          <View style={styles.detailItem}>
            <View style={[styles.iconContainer, { backgroundColor: '#e3f2fd' }]}>
              <Text style={styles.detailIcon}>👤</Text>
            </View>
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel}>Employee ID</Text>
              <Text style={styles.detailValue}>{employee?.id || "N/A"}</Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <View style={[styles.iconContainer, { backgroundColor: '#fff3e0' }]}>
              <Text style={styles.detailIcon}>📛</Text>
            </View>
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel}>Name</Text>
              <Text style={styles.detailValue}>{employee?.name || "N/A"}</Text>
            </View>
          </View>

          {/* Project Information */}
          {project && (
            <>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Project Information</Text>
              </View>

              <View style={styles.detailItem}>
                <View style={[styles.iconContainer, { backgroundColor: '#e8f5e9' }]}>
                  <Text style={styles.detailIcon}>📋</Text>
                </View>
                <View style={styles.detailTextContainer}>
                  <Text style={styles.detailLabel}>Project ID</Text>
                  <Text style={styles.detailValue}>{assignment?.projectId || "N/A"}</Text>
                </View>
              </View>

              <View style={styles.detailItem}>
                <View style={[styles.iconContainer, { backgroundColor: '#fce4ec' }]}>
                  <Text style={styles.detailIcon}>📝</Text>
                </View>
                <View style={styles.detailTextContainer}>
                  <Text style={styles.detailLabel}>Project Title</Text>
                  <Text style={styles.detailValue}>{project?.title || "N/A"}</Text>
                </View>
              </View>

              <View style={styles.detailItem}>
                <View style={[styles.iconContainer, { backgroundColor: '#f3e5f5' }]}>
                  <Text style={styles.detailIcon}>⏱️</Text>
                </View>
                <View style={styles.detailTextContainer}>
                  <Text style={styles.detailLabel}>Duration</Text>
                  <Text style={styles.detailValue}>{project?.duration || "N/A"}</Text>
                </View>
              </View>
            </>
          )}

          {/* Assignment Information */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Assignment Details</Text>
          </View>

          <View style={styles.detailItem}>
            <View style={[styles.iconContainer, { backgroundColor: '#e0f7fa' }]}>
              <Text style={styles.detailIcon}>👔</Text>
            </View>
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel}>Role</Text>
              <Text style={styles.detailValue}>{assignment?.role || "Not assigned"}</Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <View style={[styles.iconContainer, { backgroundColor: '#fff8e1' }]}>
              <Text style={styles.detailIcon}>🔒</Text>
            </View>
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel}>Login Method</Text>
              <Text style={styles.detailValue}>OTP Authentication</Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <View style={[styles.iconContainer, { backgroundColor: '#f1f8e9' }]}>
              <Text style={styles.detailIcon}>📅</Text>
            </View>
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel}>Login Status</Text>
              <Text style={[styles.detailValue, styles.statusActive]}>Active & Secure</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <Text style={styles.logoutButtonText}>Sign Out</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Secure OTP Authentication • Employee Portal
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );

  return isLoggedIn ? renderDetailsScreen() : renderLoginScreen();
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 15,
    color: '#7f8c8d',
    fontSize: 16,
  },
  gradientHeader: {
    padding: 30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3498db',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    fontSize: 50,
    marginBottom: 10,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  appSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  formContainer: {
    padding: 25,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
    textAlign: 'center',
  },
  instructionText: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    backgroundColor: '#fff',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    top: 15,
    zIndex: 1,
  },
  otpNote: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 5,
    fontStyle: 'italic',
  },
  loadingContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  loginButton: {
    backgroundColor: '#3498db',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
    elevation: 3,
  },
  loginButtonDisabled: {
    backgroundColor: '#95a5a6',
    opacity: 0.7,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  helpContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  helpText: {
    color: '#95a5a6',
    fontSize: 14,
  },
  // Details Screen Styles
  detailsContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  successHeader: {
    padding: 30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2ecc71',
  },
  successContent: {
    alignItems: 'center',
  },
  successIcon: {
    fontSize: 50,
    marginBottom: 10,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  successSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  detailsCard: {
    margin: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    elevation: 5,
  },
  sectionHeader: {
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  detailIcon: {
    fontSize: 20,
  },
  detailTextContainer: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  statusActive: {
    color: '#27ae60',
    fontWeight: 'bold',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e74c3c',
    padding: 16,
    borderRadius: 10,
    marginHorizontal: 20,
    marginTop: 10,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
    elevation: 3,
    gap: 8,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 20,
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    color: '#95a5a6',
    fontSize: 12,
  },
});