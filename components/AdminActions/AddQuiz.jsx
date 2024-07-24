import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { createQuiz } from '../../services/api';
import Header from '../General/Header';
import styles from '../General/styles';
import { TranslationContext } from '../../context/TranslationContext';
import { UserContext } from '../../context/UserContext';
import Icon from 'react-native-vector-icons/FontAwesome';

const AddQuiz = ({ navigation, route }) => {
  const { contextId } = route.params;
  const { user } = useContext(UserContext);
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([]);
  const { translations } = useContext(TranslationContext);

  const handleAddQuestion = () => {
    setQuestions([...questions, { text: '', options: [], correctAnswer: '' }]);
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const handleAddQuiz = async () => {
    try {
      const adminId = user?.userId;
      if (!adminId) {
        Alert.alert(translations.error || 'Error', 'Admin ID is missing');
        return;
      }
      const response = await createQuiz({ contextId, title, questions, adminId });
      if (response.status === 201) {
        Alert.alert(translations.success || 'Success', `${translations.quiz || 'Quiz'} ${translations.addedSuccessfully || 'added successfully'}`);
        navigation.goBack();
      } else {
        console.error('Add quiz failed:', response.data);
        Alert.alert(translations.error || 'Error', `${translations.failedToAdd || 'Failed to add'} ${translations.quiz.toLowerCase() || 'quiz'}`);
      }
    } catch (error) {
      console.error('Add quiz error:', error.response ? error.response.data : error.message);
      Alert.alert(translations.error || 'Error', `${translations.failedToAdd || 'Failed to add'} ${translations.quiz.toLowerCase() || 'quiz'}`);
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={16} color="#fff" />
        <Text style={styles.backButtonText}>{translations.backToManage || 'Back to Manage'} {translations.quizzes || 'Quizzes'}</Text>
      </TouchableOpacity>
      <Text style={styles.title}>{translations.add || 'Add'} {translations.quiz || 'Quiz'}</Text>
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
      <TouchableOpacity style={styles.addButton} onPress={handleAddQuestion}>
        <Icon name="plus" size={16} color="#fff" style={styles.buttonIcon} />
        <Text style={styles.buttonText}>{translations.add} {translations.question}</Text>
      </TouchableOpacity>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.primaryButton} onPress={handleAddQuiz}>
          <Text style={styles.buttonText}>{translations.add} {translations.quiz}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>{translations.cancel}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AddQuiz;
