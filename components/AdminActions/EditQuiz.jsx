import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { updateQuiz } from '../../services/api';
import Header from '../General/Header';
import styles from '../General/styles';
import { TranslationContext } from '../../context/TranslationContext';
import { UserContext } from '../../context/UserContext';
import Icon from 'react-native-vector-icons/FontAwesome';

const EditQuiz = ({ route, navigation }) => {
  const { quiz } = route.params;
  const [title, setTitle] = useState(quiz.title);
  const { translations } = useContext(TranslationContext);
  const { user } = useContext(UserContext);

  const handleUpdateQuiz = async () => {
    try {
      const response = await updateQuiz(quiz._id, { title, adminId: user.userId });
      if (response.status === 200) {
        Alert.alert(translations.success || 'Success', `${translations.quiz || 'Quiz'} ${translations.updatedSuccessfully || 'updated successfully'}`);
        navigation.goBack();
      }
    } catch (error) {
      console.error('Update quiz failed:', error.response?.data || error.message);
      Alert.alert(translations.error || 'Error', `${translations.failedToUpdate || 'Failed to update'} ${translations.quiz || 'quiz'}`);
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={16} color="#fff" />
        <Text style={styles.backButtonText}>{translations.backToManage || 'Back to Manage'} {translations.quizzes || 'Quizzes'}</Text>
      </TouchableOpacity>
      <Text style={styles.title}>{translations.editQuiz || 'Edit Quiz'}</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder={`${translations.enterQuizTitle || 'Enter quiz title'}`}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.primaryButton} onPress={handleUpdateQuiz}>
          <Text style={styles.buttonText}>{translations.updateQuiz || 'Update Quiz'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>{translations.cancel || 'Cancel'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EditQuiz;
