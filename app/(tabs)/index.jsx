import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import logoImg from '../../assets/images/logo.png';

const App = () => {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={logoImg} style={styles.logo} />
        <Text style={styles.title}>My BLE App</Text>
      </View>

      {/* Menu */}
      <View style={styles.menu}>
        {['Home', 'Scan', 'Devices', 'Settings'].map((item) => (
          <TouchableOpacity key={item} style={styles.menuItem}>
            <Text style={styles.menuText}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Section 1 */}
      <View style={styles.sectionOne}>
        <Text style={styles.sectionTitle}>🔍 BLE Scanner</Text>
        <Text style={styles.sectionContent}>Scan nearby devices and connect with ease.</Text>
      </View>

      {/* Section 2 */}
      <View style={styles.sectionTwo}>
        <Text style={styles.sectionTitle}>📡 Connected Devices</Text>
        <Text style={styles.sectionContent}>List and manage your active connections.</Text>
      </View>
    </ScrollView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#003366',
    padding: 15,
    borderRadius: 12,
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 10,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  menu: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#0077cc',
    borderRadius: 10,
    marginVertical: 15,
    paddingVertical: 10,
  },
  menuItem: {
    paddingHorizontal: 10,
  },
  menuText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
  sectionOne: {
    backgroundColor: '#e6f2ff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
  },
  sectionTwo: {
    backgroundColor: '#fff0f0',
    padding: 20,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  sectionContent: {
    fontSize: 16,
    color: '#333',
  },
});
