// General/buttonStyles.js
import { StyleSheet } from 'react-native';
import { COLORS, FONTS } from './colors';

const buttonStyles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 4,
    alignItems: 'center',
    marginHorizontal: 5,
    marginBottom: 10,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 4,
    alignItems: 'center',
    marginHorizontal: 5,
    marginBottom: 10,
    flex: 1,
  },
  secondaryButton: {
    backgroundColor: COLORS.secondary,
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 16,
  },
  cancelButton: {
    backgroundColor: COLORS.danger,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 4,
    alignItems: 'center',
    marginHorizontal: 3,
    marginBottom: 10,
    flex: 1,
  },
  disabledButton: {
    backgroundColor: COLORS.disabled,
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 16,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: FONTS.sizeMedium,
    fontWeight: 'bold',
  },
  footerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  addButton: {
    backgroundColor: COLORS.success,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  addButtonText: {
    color: COLORS.white,
    fontSize: FONTS.sizeMedium,
    fontWeight: 'bold',
  },
  footerContainer: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: '#555555',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 4,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '90%',
  },
  backButtonText: {
    color: COLORS.white,
    fontSize: FONTS.sizeMedium,
    fontWeight: 'bold',
  },
  tileButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '30%',
  },
  tileButtonText: {
    color: COLORS.white,
    fontSize: FONTS.sizeMedium,
    fontWeight: 'bold',
    marginTop: 10,
  },
});

export default buttonStyles;
