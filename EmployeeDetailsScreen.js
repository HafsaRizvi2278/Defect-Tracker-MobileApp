// import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
// import { collection, getDocs, query, where } from "firebase/firestore";
// import { useEffect, useState } from "react";
// import { 
//   ActivityIndicator, 
//   StyleSheet, 
//   Text, 
//   TouchableOpacity, 
//   View, 
//   ScrollView,
//   SafeAreaView
// } from "react-native";
// import { db } from "./src/firebase";

// export default function EmployeeDetailsScreen({ route, navigation }) {
//   const { employeeId, assignedCode, employeeName } = route.params;
//   const [assignment, setAssignment] = useState(null);
//   const [project, setProject] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchAssignmentDetails = async () => {
//       try {
//         // Fetch assignment details
//         const assignmentsRef = collection(db, "assignments");
//         const assignmentQuery = query(
//           assignmentsRef, 
//           where("employeeId", "==", employeeId), 
//           where("code", "==", assignedCode)
//         );
//         const assignmentSnapshot = await getDocs(assignmentQuery);
        
//         if (!assignmentSnapshot.empty) {
//           const assignmentData = assignmentSnapshot.docs[0].data();
//           setAssignment(assignmentData);
          
//           // Fetch project details if projectId exists
//           if (assignmentData.projectId) {
//             const projectsRef = collection(db, "projects");
//             const projectQuery = query(
//               projectsRef, 
//               where("id", "==", assignmentData.projectId)
//             );
//             const projectSnapshot = await getDocs(projectQuery);
            
//             if (!projectSnapshot.empty) {
//               setProject(projectSnapshot.docs[0].data());
//             }
//           }
//         }
//       } catch (err) { 
//         console.error("Error fetching data:", err); 
//       } finally { 
//         setLoading(false); 
//       }
//     };
    
//     fetchAssignmentDetails();
//   }, []);

//   const handleLogout = () => navigation.replace("Login");
//   const handleLiveLocation = () => navigation.navigate("LiveLocationScreen");

//   if (loading) {
//     return (
//       <View style={styles.centered}>
//         <ActivityIndicator size="large" color="#3498db" />
//         <Text style={styles.loadingText}>Loading assignment details...</Text>
//       </View>
//     );
//   }
  
//   if (!assignment) {
//     return (
//       <View style={styles.centered}>
//         <Ionicons name="alert-circle-outline" size={50} color="#e74c3c" />
//         <Text style={styles.errorText}>No assignment found</Text>
//         <Text style={styles.errorSubtext}>Please contact your administrator</Text>
//         <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
//           <Text style={styles.logoutButtonText}>Return to Login</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <ScrollView contentContainerStyle={styles.scrollContainer}>
//         {/* Header Section */}
//         <View style={styles.header}>
//           <View>
//             <Text style={styles.welcomeText}>Welcome, {employeeName || "Employee"}!</Text>
//             <Text style={styles.subtitle}>Your Assignment Details</Text>
//           </View>
//           <TouchableOpacity 
//             style={styles.locationButton}
//             onPress={handleLiveLocation}
//           >
//             <Ionicons name="location" size={24} color="#fff" />
//             <Text style={styles.locationButtonText}>Live Location</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Employee Info Card */}
//         <View style={styles.card}>
//           <View style={styles.cardHeader}>
//             <MaterialIcons name="person-outline" size={20} color="#3498db" />
//             <Text style={styles.cardTitle}>Employee Information</Text>
//           </View>
//           <View style={styles.infoRow}>
//             <Text style={styles.infoLabel}>Employee ID:</Text>
//             <Text style={styles.infoValue}>{employeeId}</Text>
//           </View>
//           {employeeName && (
//             <View style={styles.infoRow}>
//               <Text style={styles.infoLabel}>Name:</Text>
//               <Text style={styles.infoValue}>{employeeName}</Text>
//             </View>
//           )}
//         </View>

//         {/* Assignment Info Card */}
//         <View style={styles.card}>
//           <View style={styles.cardHeader}>
//             <MaterialIcons name="assignment" size={20} color="#3498db" />
//             <Text style={styles.cardTitle}>Assignment Details</Text>
//           </View>
//           <View style={styles.infoRow}>
//             <Text style={styles.infoLabel}>Assignment Code:</Text>
//             <Text style={styles.infoValue}>{assignment.code || assignedCode}</Text>
//           </View>
//           <View style={styles.infoRow}>
//             <Text style={styles.infoLabel}>Role:</Text>
//             <Text style={styles.infoValue}>{assignment.role || "Not specified"}</Text>
//           </View>
//           {assignment.duration && (
//             <View style={styles.infoRow}>
//               <Text style={styles.infoLabel}>Duration:</Text>
//               <Text style={styles.infoValue}>{assignment.duration} hours</Text>
//             </View>
//           )}
//         </View>

//         {/* Project Info Card */}
//         {project && (
//           <View style={styles.card}>
//             <View style={styles.cardHeader}>
//               <FontAwesome5 name="project-diagram" size={18} color="#3498db" />
//               <Text style={styles.cardTitle}>Project Information</Text>
//             </View>
//             <View style={styles.infoRow}>
//               <Text style={styles.infoLabel}>Project ID:</Text>
//               <Text style={styles.infoValue}>{project.id}</Text>
//             </View>
//             <View style={styles.infoRow}>
//               <Text style={styles.infoLabel}>Project Title:</Text>
//               <Text style={styles.infoValue}>{project.title || "Not specified"}</Text>
//             </View>
//             {project.duration && (
//               <View style={styles.infoRow}>
//                 <Text style={styles.infoLabel}>Project Duration:</Text>
//                 <Text style={styles.infoValue}>{project.duration}</Text>
//               </View>
//             )}
//           </View>
//         )}

//         {/* Status Card */}
//         <View style={[styles.card, styles.statusCard]}>
//           <View style={styles.statusContent}>
//             <Ionicons name="checkmark-circle" size={30} color="#27ae60" />
//             <View style={styles.statusTextContainer}>
//               <Text style={styles.statusTitle}>Assignment Active</Text>
//               <Text style={styles.statusSubtitle}>You are currently assigned to this project</Text>
//             </View>
//           </View>
//         </View>

//         {/* Logout Button */}
//         <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
//           <Ionicons name="log-out-outline" size={20} color="#fff" />
//           <Text style={styles.logoutButtonText}>Sign Out</Text>
//         </TouchableOpacity>

//         {/* Footer */}
//         <View style={styles.footer}>
//           <Text style={styles.footerText}>
//             Defect Tracker System • Employee Portal
//           </Text>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: '#f8f9fa',
//   },
//   scrollContainer: {
//     flexGrow: 1,
//     padding: 20,
//     paddingBottom: 40,
//   },
//   centered: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//     backgroundColor: '#f8f9fa',
//   },
//   loadingText: {
//     marginTop: 15,
//     color: '#7f8c8d',
//     fontSize: 16,
//   },
//   errorText: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#e74c3c',
//     marginTop: 15,
//     marginBottom: 5,
//   },
//   errorSubtext: {
//     fontSize: 16,
//     color: '#7f8c8d',
//     marginBottom: 25,
//     textAlign: 'center',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//     marginBottom: 25,
//   },
//   welcomeText: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#2c3e50',
//     marginBottom: 5,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: '#7f8c8d',
//   },
//   locationButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#3498db',
//     paddingVertical: 10,
//     paddingHorizontal: 15,
//     borderRadius: 8,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   locationButtonText: {
//     color: '#fff',
//     fontWeight: '600',
//     marginLeft: 5,
//   },
//   card: {
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 20,
//     marginBottom: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//     elevation: 3,
//   },
//   cardHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 15,
//     paddingBottom: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ecf0f1',
//   },
//   cardTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#2c3e50',
//     marginLeft: 10,
//   },
//   infoRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f8f9fa',
//   },
//   infoLabel: {
//     fontSize: 16,
//     color: '#7f8c8d',
//     fontWeight: '500',
//   },
//   infoValue: {
//     fontSize: 16,
//     color: '#2c3e50',
//     fontWeight: '600',
//     textAlign: 'right',
//     flex: 1,
//     marginLeft: 10,
//   },
//   statusCard: {
//     backgroundColor: '#e8f5e9',
//     borderLeftWidth: 4,
//     borderLeftColor: '#27ae60',
//   },
//   statusContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   statusTextContainer: {
//     marginLeft: 15,
//     flex: 1,
//   },
//   statusTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#27ae60',
//     marginBottom: 3,
//   },
//   statusSubtitle: {
//     fontSize: 14,
//     color: '#7f8c8d',
//   },
//   logoutButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#e74c3c',
//     padding: 16,
//     borderRadius: 10,
//     marginTop: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   logoutButtonText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginLeft: 10,
//   },
//   footer: {
//     marginTop: 30,
//     alignItems: 'center',
//   },
//   footerText: {
//     color: '#95a5a6',
//     fontSize: 12,
//   },
// });






// import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
// import { collection, getDocs, query, where } from "firebase/firestore";
// import { useEffect, useState } from "react";
// import { 
//   ActivityIndicator, 
//   StyleSheet, 
//   Text, 
//   TouchableOpacity, 
//   View, 
//   ScrollView,
//   SafeAreaView,
//   Alert
// } from "react-native";
// import { db } from "./src/firebase";

// export default function EmployeeDetailsScreen({ route, navigation }) {
//   const { employeeId, assignedCode, employeeName } = route.params;
//   const [assignment, setAssignment] = useState(null);
//   const [project, setProject] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [hasAssignment, setHasAssignment] = useState(true);

//   useEffect(() => {
//     const fetchAssignmentDetails = async () => {
//       try {
//         const assignmentsRef = collection(db, "assignments");
//         const assignmentQuery = query(
//           assignmentsRef, 
//           where("employeeId", "==", employeeId), 
//           where("code", "==", assignedCode)
//         );
//         const assignmentSnapshot = await getDocs(assignmentQuery);
        
//         if (!assignmentSnapshot.empty) {
//           const assignmentData = assignmentSnapshot.docs[0].data();
//           setAssignment(assignmentData);
          
//           if (assignmentData.projectId) {
//             const projectsRef = collection(db, "projects");
//             const projectQuery = query(
//               projectsRef, 
//               where("id", "==", assignmentData.projectId)
//             );
//             const projectSnapshot = await getDocs(projectQuery);
            
//             if (!projectSnapshot.empty) {
//               setProject(projectSnapshot.docs[0].data());
//             }
//           }
//         } else {
//           setHasAssignment(false);
//           Alert.alert(
//             "No Assignment Found",
//             "Your account exists but has no assigned projects. Please contact your administrator.",
//             [{ text: "OK" }]
//           );
//         }
//       } catch (err) { 
//         Alert.alert("Error", "Failed to load assignment details. Please try again.");
//       } finally { 
//         setLoading(false); 
//       }
//     };
    
//     fetchAssignmentDetails();
//   }, []);

//   const handleLogout = () => {
//     Alert.alert(
//       "Logout",
//       "Are you sure you want to logout?",
//       [
//         { text: "Cancel", style: "cancel" },
//         { text: "Logout", onPress: () => navigation.replace("Login") }
//       ]
//     );
//   };

//   const handleLiveLocation = () => {
//     if (!hasAssignment) {
//       Alert.alert(
//         "No Assignment",
//         "You need to have an assigned project to use live location tracking."
//       );
//       return;
//     }
//     navigation.navigate("LiveLocationScreen");
//   };

//   const handleContactAdmin = () => {
//     Alert.alert(
//       "Contact Administrator",
//       "Please reach out to your system administrator to get assigned to a project.",
//       [{ text: "OK", style: "default" }]
//     );
//   };

//   if (loading) {
//     return (
//       <View style={styles.centered}>
//         <ActivityIndicator size="large" color="#3498db" />
//         <Text style={styles.loadingText}>Loading assignment details...</Text>
//       </View>
//     );
//   }
  
//   if (!hasAssignment) {
//     return (
//       <SafeAreaView style={styles.safeArea}>
//         <ScrollView contentContainerStyle={styles.scrollContainer}>
//           {/* Header Section with Live Location Button */}
//           <View style={styles.header}>
//             <View>
//               <Text style={styles.welcomeText}>Welcome, {employeeName || "Employee"}!</Text>
//               <Text style={styles.subtitle}>Account Overview</Text>
//             </View>
//             <TouchableOpacity 
//               style={[styles.locationButton, styles.smallButton]}
//               onPress={handleLiveLocation}
//             >
//               <Ionicons name="location" size={20} color="#fff" />
//             </TouchableOpacity>
//           </View>

//           {/* Employee Info Card */}
//           <View style={styles.card}>
//             <View style={styles.cardHeader}>
//               <MaterialIcons name="person-outline" size={20} color="#3498db" />
//               <Text style={styles.cardTitle}>Employee Information</Text>
//             </View>
//             <View style={styles.infoRow}>
//               <Text style={styles.infoLabel}>Employee ID:</Text>
//               <Text style={styles.infoValue}>{employeeId}</Text>
//             </View>
//             {employeeName && (
//               <View style={styles.infoRow}>
//                 <Text style={styles.infoLabel}>Name:</Text>
//                 <Text style={styles.infoValue}>{employeeName}</Text>
//               </View>
//             )}
//           </View>

//           {/* No Assignment Card */}
//           <View style={[styles.card, styles.warningCard]}>
//             <View style={styles.statusContent}>
//               <Ionicons name="alert-circle" size={30} color="#e67e22" />
//               <View style={styles.statusTextContainer}>
//                 <Text style={[styles.statusTitle, { color: "#e67e22" }]}>No Active Assignment</Text>
//                 <Text style={styles.statusSubtitle}>
//                   Your account is active but you haven't been assigned to any projects yet.
//                 </Text>
//               </View>
//             </View>
//           </View>

//           {/* Action Buttons */}
//           <TouchableOpacity 
//             style={[styles.actionButton, styles.primaryButton]}
//             onPress={handleContactAdmin}
//           >
//             <Ionicons name="person" size={20} color="#fff" />
//             <Text style={styles.actionButtonText}>Contact Administrator</Text>
//           </TouchableOpacity>

//           <TouchableOpacity 
//             style={[styles.actionButton, styles.secondaryButton]}
//             onPress={handleLogout}
//           >
//             <Ionicons name="log-out-outline" size={20} color="#3498db" />
//             <Text style={[styles.actionButtonText, { color: "#3498db" }]}>Sign Out</Text>
//           </TouchableOpacity>

//           {/* Footer */}
//           <View style={styles.footer}>
//             <Text style={styles.footerText}>
//               Defect Tracker System • Employee Portal
//             </Text>
//           </View>
//         </ScrollView>
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <ScrollView contentContainerStyle={styles.scrollContainer}>
//         {/* Header Section with Live Location Button */}
//         <View style={styles.header}>
//           <View>
//             <Text style={styles.welcomeText}>Welcome, {employeeName || "Employee"}!</Text>
//             <Text style={styles.subtitle}>Your Assignment Details</Text>
//           </View>
//           <TouchableOpacity 
//             style={[styles.locationButton, styles.smallButton]}
//             onPress={handleLiveLocation}
//           >
//             <Ionicons name="location" size={20} color="#fff" />
//           </TouchableOpacity>
//         </View>

//         {/* Employee Info Card */}
//         <View style={styles.card}>
//           <View style={styles.cardHeader}>
//             <MaterialIcons name="person-outline" size={20} color="#3498db" />
//             <Text style={styles.cardTitle}>Employee Information</Text>
//           </View>
//           <View style={styles.infoRow}>
//             <Text style={styles.infoLabel}>Employee ID:</Text>
//             <Text style={styles.infoValue}>{employeeId}</Text>
//           </View>
//           {employeeName && (
//             <View style={styles.infoRow}>
//               <Text style={styles.infoLabel}>Name:</Text>
//               <Text style={styles.infoValue}>{employeeName}</Text>
//             </View>
//           )}
//         </View>

//         {/* Assignment Info Card */}
//         <View style={styles.card}>
//           <View style={styles.cardHeader}>
//             <MaterialIcons name="assignment" size={20} color="#3498db" />
//             <Text style={styles.cardTitle}>Assignment Details</Text>
//           </View>
//           <View style={styles.infoRow}>
//             <Text style={styles.infoLabel}>Assignment Code:</Text>
//             <Text style={styles.infoValue}>{assignment.code || assignedCode}</Text>
//           </View>
//           <View style={styles.infoRow}>
//             <Text style={styles.infoLabel}>Role:</Text>
//             <Text style={styles.infoValue}>{assignment.role || "Not specified"}</Text>
//           </View>
//           {assignment.duration && (
//             <View style={styles.infoRow}>
//               <Text style={styles.infoLabel}>Duration:</Text>
//               <Text style={styles.infoValue}>{assignment.duration} hours</Text>
//             </View>
//           )}
//         </View>

//         {/* Project Info Card */}
//         {project && (
//           <View style={styles.card}>
//             <View style={styles.cardHeader}>
//               <FontAwesome5 name="project-diagram" size={18} color="#3498db" />
//               <Text style={styles.cardTitle}>Project Information</Text>
//             </View>
//             <View style={styles.infoRow}>
//               <Text style={styles.infoLabel}>Project ID:</Text>
//               <Text style={styles.infoValue}>{project.id}</Text>
//             </View>
//             <View style={styles.infoRow}>
//               <Text style={styles.infoLabel}>Project Title:</Text>
//               <Text style={styles.infoValue}>{project.title || "Not specified"}</Text>
//             </View>
//             {project.duration && (
//               <View style={styles.infoRow}>
//                 <Text style={styles.infoLabel}>Project Duration:</Text>
//                 <Text style={styles.infoValue}>{project.duration}</Text>
//               </View>
//             )}
//           </View>
//         )}

//         {/* Status Card */}
//         <View style={[styles.card, styles.statusCard]}>
//           <View style={styles.statusContent}>
//             <Ionicons name="checkmark-circle" size={30} color="#27ae60" />
//             <View style={styles.statusTextContainer}>
//               <Text style={styles.statusTitle}>Assignment Active</Text>
//               <Text style={styles.statusSubtitle}>You are currently assigned to this project</Text>
//             </View>
//           </View>
//         </View>

//         {/* Logout Button */}
//         <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
//           <Ionicons name="log-out-outline" size={20} color="#fff" />
//           <Text style={styles.logoutButtonText}>Sign Out</Text>
//         </TouchableOpacity>

//         {/* Footer */}
//         <View style={styles.footer}>
//           <Text style={styles.footerText}>
//             Defect Tracker System • Employee Portal
//           </Text>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: '#f8f9fa',
//   },
//   scrollContainer: {
//     flexGrow: 1,
//     padding: 20,
//     paddingBottom: 40,
//   },
//   centered: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//     backgroundColor: '#f8f9fa',
//   },
//   loadingText: {
//     marginTop: 15,
//     color: '#7f8c8d',
//     fontSize: 16,
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//     marginBottom: 25,
//   },
//   welcomeText: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#2c3e50',
//     marginBottom: 5,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: '#7f8c8d',
//   },
//   locationButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#3498db',
//     paddingVertical: 10,
//     paddingHorizontal: 15,
//     borderRadius: 8,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   smallButton: {
//     padding: 10,
//     alignSelf: 'flex-start',
//     marginTop: 5,
//   },
//   card: {
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 20,
//     marginBottom: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//     elevation: 3,
//   },
//   warningCard: {
//     backgroundColor: '#fffaf0',
//     borderLeftWidth: 4,
//     borderLeftColor: '#e67e22',
//   },
//   cardHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 15,
//     paddingBottom: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ecf0f1',
//   },
//   cardTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#2c3e50',
//     marginLeft: 10,
//   },
//   infoRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f8f9fa',
//   },
//   infoLabel: {
//     fontSize: 16,
//     color: '#7f8c8d',
//     fontWeight: '500',
//   },
//   infoValue: {
//     fontSize: 16,
//     color: '#2c3e50',
//     fontWeight: '600',
//     textAlign: 'right',
//     flex: 1,
//     marginLeft: 10,
//   },
//   statusCard: {
//     backgroundColor: '#e8f5e9',
//     borderLeftWidth: 4,
//     borderLeftColor: '#27ae60',
//   },
//   statusContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   statusTextContainer: {
//     marginLeft: 15,
//     flex: 1,
//   },
//   statusTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#27ae60',
//     marginBottom: 3,
//   },
//   statusSubtitle: {
//     fontSize: 14,
//     color: '#7f8c8d',
//   },
//   actionButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 16,
//     borderRadius: 10,
//     marginTop: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   primaryButton: {
//     backgroundColor: '#3498db',
//   },
//   secondaryButton: {
//     backgroundColor: '#fff',
//     borderWidth: 1,
//     borderColor: '#3498db',
//   },
//   actionButtonText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginLeft: 10,
//     color: '#fff',
//   },
//   logoutButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#e74c3c',
//     padding: 16,
//     borderRadius: 10,
//     marginTop: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   logoutButtonText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginLeft: 10,
//   },
//   footer: {
//     marginTop: 30,
//     alignItems: 'center',
//   },
//   footerText: {
//     color: '#95a5a6',
//     fontSize: 12,
//   },
// });





import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { 
  ActivityIndicator, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View, 
  ScrollView,
  SafeAreaView,
  Alert,
  Dimensions
} from "react-native";
import { db } from "./src/firebase";

const { width } = Dimensions.get('window');

export default function EmployeeDetailsScreen({ route, navigation }) {
  const { employeeId, assignedCode, employeeName } = route.params;
  const [assignment, setAssignment] = useState(null);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasAssignment, setHasAssignment] = useState(true);

  useEffect(() => {
    const fetchAssignmentDetails = async () => {
      try {
        const assignmentsRef = collection(db, "assignments");
        const assignmentQuery = query(
          assignmentsRef, 
          where("employeeId", "==", employeeId), 
          where("code", "==", assignedCode)
        );
        const assignmentSnapshot = await getDocs(assignmentQuery);
        
        if (!assignmentSnapshot.empty) {
          const assignmentData = assignmentSnapshot.docs[0].data();
          setAssignment(assignmentData);
          
          if (assignmentData.projectId) {
            const projectsRef = collection(db, "projects");
            const projectQuery = query(
              projectsRef, 
              where("id", "==", assignmentData.projectId)
            );
            const projectSnapshot = await getDocs(projectQuery);
            
            if (!projectSnapshot.empty) {
              setProject(projectSnapshot.docs[0].data());
            }
          }
        } else {
          setHasAssignment(false);
        }
      } catch (err) { 
        Alert.alert("Error", "Failed to load assignment details. Please try again.");
      } finally { 
        setLoading(false); 
      }
    };
    
    fetchAssignmentDetails();
  }, []);

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", onPress: () => navigation.replace("Login") }
      ]
    );
  };

  const handleLiveLocation = () => {
    if (!hasAssignment) {
      Alert.alert(
        "No Assignment",
        "You need to have an assigned project to use live location tracking."
      );
      return;
    }
    navigation.navigate("LiveLocationScreen");
  };

  const handleContactAdmin = () => {
    Alert.alert(
      "Contact Administrator",
      "Please reach out to your system administrator to get assigned to a project.",
      [{ text: "OK", style: "default" }]
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Loading assignment details...</Text>
      </View>
    );
  }
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header Section with Live Location Button - ALWAYS VISIBLE */}
        <View style={styles.header}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.welcomeText}>Welcome, {employeeName || "Employee"}!</Text>
            <Text style={styles.subtitle}>
              {hasAssignment ? "Your Assignment Details" : "Account Overview"}
            </Text>
          </View>
          <TouchableOpacity 
            style={[styles.locationButton, !hasAssignment && styles.locationButtonDisabled]}
            onPress={handleLiveLocation}
            disabled={!hasAssignment}
          >
            <Ionicons name="location" size={22} color="#fff" />
            <Text style={styles.locationButtonText}>Live</Text>
          </TouchableOpacity>
        </View>

        {!hasAssignment ? (
          <>
            {/* Employee Info Card */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <MaterialIcons name="person-outline" size={20} color="#3498db" />
                <Text style={styles.cardTitle}>Employee Information</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Employee ID:</Text>
                <Text style={styles.infoValue}>{employeeId}</Text>
              </View>
              {employeeName && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Name:</Text>
                  <Text style={styles.infoValue}>{employeeName}</Text>
                </View>
              )}
            </View>

            {/* No Assignment Card */}
            <View style={[styles.card, styles.warningCard]}>
              <View style={styles.statusContent}>
                <Ionicons name="alert-circle" size={30} color="#e67e22" />
                <View style={styles.statusTextContainer}>
                  <Text style={[styles.statusTitle, { color: "#e67e22" }]}>No Active Assignment</Text>
                  <Text style={styles.statusSubtitle}>
                    Your account is active but you haven't been assigned to any projects yet.
                  </Text>
                </View>
              </View>
            </View>

            {/* Action Buttons */}
            <TouchableOpacity 
              style={[styles.actionButton, styles.primaryButton]}
              onPress={handleContactAdmin}
            >
              <Ionicons name="person" size={20} color="#fff" />
              <Text style={styles.actionButtonText}>Contact Administrator</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            {/* Employee Info Card */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <MaterialIcons name="person-outline" size={20} color="#3498db" />
                <Text style={styles.cardTitle}>Employee Information</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Employee ID:</Text>
                <Text style={styles.infoValue}>{employeeId}</Text>
              </View>
              {employeeName && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Name:</Text>
                  <Text style={styles.infoValue}>{employeeName}</Text>
                </View>
              )}
            </View>

            {/* Assignment Info Card */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <MaterialIcons name="assignment" size={20} color="#3498db" />
                <Text style={styles.cardTitle}>Assignment Details</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Assignment Code:</Text>
                <Text style={styles.infoValue}>{assignment.code || assignedCode}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Role:</Text>
                <Text style={styles.infoValue}>{assignment.role || "Not specified"}</Text>
              </View>
              {assignment.duration && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Duration:</Text>
                  <Text style={styles.infoValue}>{assignment.duration} hours</Text>
                </View>
              )}
            </View>

            {/* Project Info Card */}
            {project && (
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <FontAwesome5 name="project-diagram" size={18} color="#3498db" />
                  <Text style={styles.cardTitle}>Project Information</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Project ID:</Text>
                  <Text style={styles.infoValue}>{project.id}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Project Title:</Text>
                  <Text style={styles.infoValue}>{project.title || "Not specified"}</Text>
                </View>
                {project.duration && (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Project Duration:</Text>
                    <Text style={styles.infoValue}>{project.duration}</Text>
                  </View>
                )}
              </View>
            )}

            {/* Status Card */}
            <View style={[styles.card, styles.statusCard]}>
              <View style={styles.statusContent}>
                <Ionicons name="checkmark-circle" size={30} color="#27ae60" />
                <View style={styles.statusTextContainer}>
                  <Text style={styles.statusTitle}>Assignment Active</Text>
                  <Text style={styles.statusSubtitle}>You are currently assigned to this project</Text>
                </View>
              </View>
            </View>
          </>
        )}

        {/* Logout Button - ALWAYS VISIBLE */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <Text style={styles.logoutButtonText}>Sign Out</Text>
        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Defect Tracker System • Employee Portal
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 40,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 15,
    color: '#7f8c8d',
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 25,
  },
  headerTextContainer: {
    flex: 1,
    marginRight: 15,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  locationButton: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3498db',
    width: 60,
    height: 60,
    borderRadius: 30,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  locationButtonDisabled: {
    backgroundColor: '#95a5a6',
  },
  locationButtonText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 2,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  warningCard: {
    backgroundColor: '#fffaf0',
    borderLeftWidth: 4,
    borderLeftColor: '#e67e22',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginLeft: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  infoLabel: {
    fontSize: 16,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '600',
    textAlign: 'right',
    flex: 1,
    marginLeft: 10,
  },
  statusCard: {
    backgroundColor: '#e8f5e9',
    borderLeftWidth: 4,
    borderLeftColor: '#27ae60',
  },
  statusContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusTextContainer: {
    marginLeft: 15,
    flex: 1,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#27ae60',
    marginBottom: 3,
  },
  statusSubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 10,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryButton: {
    backgroundColor: '#3498db',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#3498db',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#fff',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e74c3c',
    padding: 16,
    borderRadius: 10,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
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