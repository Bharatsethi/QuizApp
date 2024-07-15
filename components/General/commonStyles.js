import { StyleSheet } from 'react-native';

const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
  },
  contentContainer: {
    paddingHorizontal: 20,
  },
  sectionContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
  },
  regularText: {
    fontSize: 16,
    color: '#333',
  },
  errorText: {
    color: '#ff0000',
    textAlign: 'center',
    marginVertical: 10,
  },
  footerText: {
    color: '#007bff',
    fontSize: 16,
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  welcomeText: {
    fontSize: 20,
    textAlign: 'center',
    marginVertical: 10,
    color: '#333',
  },
});

export default commonStyles;
