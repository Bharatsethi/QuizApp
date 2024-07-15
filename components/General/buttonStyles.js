import { StyleSheet } from 'react-native';

const buttonStyles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  primaryButton: {
    backgroundColor: '#1E90FF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 4,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  secondaryButton: {
    backgroundColor: '#FFA07A',
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 16,
  },
  cancelButton: {
    backgroundColor: '#d9534f',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 4,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  disabledButton: {
    backgroundColor: '#cccccc',
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 16,
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  addButton: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E90FF',
    paddingVertical: 12,
    borderRadius: 4,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tileButton: {
    backgroundColor: '#1E90FF',
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '30%',
  },
  tileButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
});

export default buttonStyles;
