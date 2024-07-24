import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { updateQuiz, fetchQuizById } from '../../services/api';
import Header from '../General/Header';
import styles from '../General/styles';
import { TranslationContext } from '../../context/TranslationContext';
import { UserContext } from '../../context/UserContext';
import Icon from 'react-native-vector-icons/FontAwesome';

const EditQuiz = ({ navigation, route }) => {
  const { quiz } = route.params;
  const { user } = useContext(UserContext);
  const [title, setTitle] = useState(quiz.title);
  const [questions, setQuestions] = useState(quiz.questions);
  const { translations } = useContext(TranslationContext);

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const handleUpdateQuiz = async () => {
    try {
      const adminId = user?.userId;
      if (!adminId) {
        Alert.alert(translations.error || 'Error', 'Admin ID is missing');
        return;
      }
      const response = await updateQuiz(quiz._id, { title, questions, adminId });
      if (response.status === 200) {
        Alert.alert(translations.success || 'Success', `${translations.quiz || 'Quiz'} ${translations.updatedSuccessfully || 'updated successfully'}`);
        navigation.goBack();
      } else {
        console.error('Update quiz failed:', response.data);
        Alert.alert(translations.error || 'Error', `${translations.failedToUpdate || 'Failed to update'} ${translations.quiz.toLowerCase() || 'quiz'}`);
      }
    } catch (error) {
      console.error('Update quiz error:', error.response ? error.response.data : error.message);
      Alert.alert(translations.error || 'Error', `${translations.failedToUpdate || 'Failed to update'} ${translations.quiz.toLowerCase() || 'quiz'}`);
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={16} color="#fff" />
        <Text style={styles.backButtonText}>{translations.backToManage || 'Back to Manage'} {translations.quizzes || 'Quizzes'}</Text>
      </TouchableOpacity>
      <Text style={styles.title}>{translations.edit || 'Edit'} {translations.quiz || 'Quiz'}</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder={`${translations.enter || 'Enter'} ${translations.quiz || 'quiz'} ${translations.title || 'title'}`}
      />
      {questions.map((question, index) => (
        <View key={index} style={styles.questionContainer}>
          <TextInput
            style={styles.input}
            value={question.text}
            onChangeText={(value) => handleQuestionChange(index, 'text', value)}
            placeholder={`${translations.enter || 'Enter'} ${translations.question || 'question'}`}
          />
          <TextInput
            style={styles.input}
            value={question.correctAnswer}
            onChangeText={(value) => handleQuestionChange(index, 'correctAnswer', value)}
            placeholder={`${translations.enter || 'Enter'} ${translations.correctAnswer || 'correct answer'}`}
          />
        </View>
      ))}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.primaryButton} onPress={handleUpdateQuiz}>
          <Text style={styles.buttonText}>{translations.update} {translations.quiz}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>{translations.cancel}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EditQuiz;
