import { StyleSheet } from 'react-native';
import { COLORS, FONTS } from './colors';

const commonStyles = StyleSheet.create({
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
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: FONTS.sizeLarge,
    fontWeight: 'bold',
  },
  cardSubtitle: {
    fontSize: FONTS.sizeSmall,
    color: COLORS.textSecondary,
  },
  cardActions: {
    flexDirection: 'row',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '50%', // Adjust the width to fit two items per row
    marginBottom: 1,
  },
  option: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  flexRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  selectedOption: {
    backgroundColor: '#4caf50',
    padding: 10,
    borderRadius: 4,
    flex: 1,
    alignItems: 'center',
    marginRight: 5,
  },
  quizItem: {
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 8,
    marginVertical: 5,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quizText: {
    color: COLORS.textPrimary,
    fontSize: FONTS.sizeMedium,
  },
  noQuizzesText: {
    textAlign: 'center',
    fontSize: FONTS.sizeMedium,
    color: COLORS.textPrimary,
  },
  unselectedOption: {
    backgroundColor: '#f1f1f1',
    padding: 10,
    borderRadius: 4,
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  optionText: {
    fontSize: 16,
  },
  optionContainer: {
    marginBottom: 20,
  },
  questionItem: {
    marginBottom: 20,
  },
  questionText: {
    fontSize: FONTS.sizeMedium,
    color: COLORS.textPrimary,
    marginBottom: 10,
  },
  icon: {
    marginLeft: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 4,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: COLORS.danger,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 4,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: FONTS.sizeMedium,
    fontWeight: 'bold',
  },
  label: {
    fontSize: FONTS.sizeMedium,
    fontWeight: 'bold',
    marginBottom: 5,
    marginLeft: 20,
  },
});

export default commonStyles;
