import { StyleSheet } from 'react-native';
import { COLORS, FONTS } from './colors';

const sharedStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 20,
  },
  centeredText: {
    textAlign: 'center',
  },
  boldText: {
    fontWeight: 'bold',
  },
  shadow: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  input: {
    height: 40,
    borderColor: COLORS.gray,
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 4,
    backgroundColor: COLORS.white,
    marginBottom: 20,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flexColumn: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  marginVertical: {
    marginVertical: 10,
  },
  marginHorizontal: {
    marginHorizontal: 10,
  },
  paddingVertical: {
    paddingVertical: 10,
  },
  paddingHorizontal: {
    paddingHorizontal: 10,
  },
  alignCenter: {
    alignItems: 'center',
  },
  justifyCenter: {
    justifyContent: 'center',
  },
});

export default sharedStyles;
