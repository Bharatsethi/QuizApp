import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { createQuiz } from '../../services/api';
import Header from '../General/Header';
import styles from '../General/stylesOld';
import { TranslationContext } from '../../context/TranslationContext';
import { UserContext } from '../../context/UserContext';
import Icon from 'react-native-vector-icons/FontAwesome';

const AddQuiz = ({ route, navigation }) => {
  const { contextId, contextType } = route.params;
  const [title, setTitle] = useState('');
  const [googleFormUrl, setGoogleFormUrl] = useState('');
  const { translations } = useContext(TranslationContext);
  const { user } = useContext(UserContext);

  const handleAddQuiz = async () => {
    try {
      const adminId = user.userId;
      const response = await createQuiz({ contextId, contextType, title, googleFormUrl, questions: [], adminId });
      if (response._id) {
        Alert.alert(translations.success || 'Success', `${translations.quiz || 'Quiz'} ${translations.createdSuccessfully || 'created successfully'}`);
        if (!googleFormUrl) {
          navigation.navigate('AddQuestion', { quizId: response._id });
        } else {
          navigation.goBack();
        }
      }
    } catch (error) {
      console.error('Add quiz failed:', error.response?.data || error.message);
      Alert.alert(translations.error || 'Error', `${translations.failedToAdd || 'Failed to add'} ${translations.quiz || 'quiz'}`);
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={16} color="#fff" />
        <Text style={styles.backButtonText}>{translations.backToManage || 'Back to Manage'} {translations.quizzes || 'Quizzes'}</Text>
      </TouchableOpacity>
      <Text style={styles.title}>{translations.addQuiz || 'Add Quiz'}</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder={`${translations.enterQuizTitle || 'Enter quiz title'}`}
      />
      <TextInput
        style={styles.input}
        value={googleFormUrl}
        onChangeText={setGoogleFormUrl}
        placeholder={`${translations.enterGoogleFormUrl || 'Enter Google Form URL (optional)'}`}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.primaryButton} onPress={handleAddQuiz}>
          <Text style={styles.buttonText}>{translations.addQuiz || 'Add Quiz'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>{translations.cancel || 'Cancel'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AddQuiz;
