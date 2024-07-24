import { StyleSheet, Dimensions } from 'react-native';
import { COLORS, FONTS } from './colors';

const headerStyles = StyleSheet.create({
  header: {
    backgroundColor: COLORS.primary,
    padding: 5,
    alignItems: 'center',
  },
  headerText: {
    color: COLORS.white,
    fontSize: FONTS.sizeLarge,
    padding: 1,
    fontWeight: 'bold',
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  welcomeText: {
    fontSize: FONTS.sizeMedium,
    textAlign: 'center',
    marginVertical: 10,
    color: COLORS.textPrimary,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 2,
    paddingHorizontal: 20,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray,
  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  mainLogo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  messageContainer: {
    marginTop: 10,
    paddingHorizontal: 10,
  },
  scrollingMessage: {
    fontSize: FONTS.sizeMedium,
    color: COLORS.textPrimary,
    width: Dimensions.get('window').width - 150,
  },
});

export default headerStyles;
