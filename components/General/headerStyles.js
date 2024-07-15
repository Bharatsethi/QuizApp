import { StyleSheet } from 'react-native';

const headerStyles = StyleSheet.create({
  header: {
    backgroundColor: '#1E90FF',
    padding: 10,
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  welcomeText: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 10,
    color: '#333',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d9534f',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default headerStyles;
