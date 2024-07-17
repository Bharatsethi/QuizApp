// General/inputStyles.js
import { StyleSheet } from 'react-native';
import { COLORS, FONTS } from './colors';

const inputStyles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: COLORS.gray,
    borderWidth: 1,
    marginHorizontal: 20,
    paddingHorizontal: 10,
    borderRadius: 4,
    backgroundColor: COLORS.white,
    marginBottom: 20,
  },
  searchInput: {
    height: 40,
    borderColor: COLORS.gray,
    borderWidth: 1,
    marginHorizontal: 20,
    paddingHorizontal: 10,
    borderRadius: 4,
    backgroundColor: COLORS.white,
    marginBottom: 20,
  },
  richTextEditor: {
    borderColor: COLORS.gray,
    borderWidth: 1,
    borderRadius: 4,
    minHeight: 200,
    marginBottom: 16,
    backgroundColor: COLORS.white,
  },
  quizInput: {
    height: 40,
    borderColor: COLORS.gray,
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    backgroundColor: COLORS.white,
    marginBottom: 20,
  },
});

export default inputStyles;
