// General/labelStyles.js
import { StyleSheet } from 'react-native';
import { COLORS, FONTS } from './colors';

const labelStyles = StyleSheet.create({
  label: {
    fontSize: FONTS.sizeMedium,
    fontWeight: 'bold',
    marginBottom: 5,
    marginLeft: 20,
  },
  planText: {
    fontSize: FONTS.sizeMedium,
    color: COLORS.textPrimary,
  },
  planAdminText: {
    fontSize: FONTS.sizeSmall,
    color: COLORS.textSecondary,
  },
  planDescriptionText: {
    fontSize: FONTS.sizeSmall,
    color: COLORS.textTertiary,
  },
  chapterText: {
    fontSize: FONTS.sizeMedium,
    color: COLORS.textPrimary,
  },
  lessonText: {
    fontSize: FONTS.sizeMedium,
    color: COLORS.textPrimary,
  },
  topicText: {
    fontSize: FONTS.sizeMedium,
    color: COLORS.textPrimary,
  },
  quizText: {
    fontSize: FONTS.sizeMedium,
    color: COLORS.textPrimary,
  },
  quizQuestion: {
    fontSize: FONTS.sizeMedium,
    color: COLORS.textPrimary,
    marginBottom: 10,
  },
  contentText: {
    fontSize: FONTS.sizeMedium,
    color: COLORS.textPrimary,
  },
  noPlansText: {
    textAlign: 'center',
    fontSize: FONTS.sizeMedium,
    color: COLORS.textPrimary,
  },
  title: {
    fontSize: FONTS.sizeLarge,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: COLORS.textPrimary,
  },
  subheading: {
    fontSize: FONTS.sizeMedium,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 10,
  },
});

export default labelStyles;
