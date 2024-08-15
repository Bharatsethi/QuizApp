import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { createQuiz } from '../../services/api';
import Header from '../General/Header';
import styles from '../General/styles';
import { TranslationContext } from '../../context/TranslationContext';
import { UserContext } from '../../context/UserContext';
import Icon from 'react-native-vector-icons/FontAwesome';

const AddQuiz = ({ navigation, route }) => {
  const { contextId, contextType } = route.params;
  const { user } = useContext(UserContext);
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([]);
  const [googleFormUrl, setGoogleFormUrl] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state
  const { translations } = useContext(TranslationContext);

  const handleAddQuestion = () => {
    setQuestions([...questions, { text: '', options: [], correctAnswer: '' }]);
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(newQuestions);
  };

  const handleAddOption = (questionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options.push('');
    setQuestions(newQuestions);
  };

  const handleAddQuiz = async () => {
    if (!title.trim()) {
      Alert.alert(translations?.error || 'Error', 'Quiz title is required');
      return;
    }

    if (questions.some(q => !q.text || (q.options.length && q.options.some(o => !o)))) {
      Alert.alert(translations?.error || 'Error', 'Please fill in all question fields and options');
      return;
    }

    setLoading(true); // Start loading
    try {
      const adminId = user?.userId;
      if (!adminId) {
        Alert.alert(translations?.error || 'Error', 'Admin ID is missing');
        return;
      }
      const response = await createQuiz({ contextId, contextType, title, questions, googleFormUrl, adminId });
      if (response.status === 201) {
        Alert.alert(translations?.success || 'Success', `${translations?.quiz || 'Quiz'} ${translations?.addedSuccessfully || 'added successfully'}`);
        navigation.goBack();
      } else {
        console.error('Add quiz failed:', response.data);
        Alert.alert(translations?.error || 'Error', `${translations?.failedToAdd || 'Failed to add'} ${translations?.quiz?.toLowerCase() || 'quiz'}`);
      }
    } catch (error) {
      console.error('Add quiz error:', error.response ? error.response.data : error.message);
      Alert.alert(translations?.error || 'Error', `${translations?.failedToAdd || 'Failed to add'} ${translations?.quiz?.toLowerCase() || 'quiz'}`);
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Header />
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={16} color="#fff" />
        <Text style={styles.backButtonText}>{translations?.backToManage || 'Back to Manage'} {translations?.quizzes || 'Quizzes'}</Text>
      </TouchableOpacity>
      <Text style={styles.title}>{translations?.add || 'Add'} {translations?.quiz || 'Quiz'}</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder={`${translations?.enter || 'Enter'} ${translations?.quiz || 'quiz'} ${translations?.title || 'title'}`}
      />
      {questions.map((question, questionIndex) => (
        <View key={questionIndex} style={styles.questionContainer}>
          <TextInput
            style={styles.input}
            value={question.text}
            onChangeText={(value) => handleQuestionChange(questionIndex, 'text', value)}
            placeholder={`${translations?.enter || 'Enter'} ${translations?.question || 'question'}`}
          />
          {question.options.map((option, optionIndex) => (
            <TextInput
              key={optionIndex}
              style={styles.input}
              value={option}
              onChangeText={(value) => handleOptionChange(questionIndex, optionIndex, value)}
              placeholder={`${translations?.enter || 'Enter'} ${translations?.option || 'option'}`}
            />
          ))}
          <TouchableOpacity style={styles.addButton} onPress={() => handleAddOption(questionIndex)}>
            <Icon name="plus" size={16} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>{translations?.add || 'Add'} {translations?.option || 'Option'}</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            value={question.correctAnswer}
            onChangeText={(value) => handleQuestionChange(questionIndex, 'correctAnswer', value)}
            placeholder={`${translations?.enter || 'Enter'} ${translations?.correctAnswer || 'correct answer'}`}
          />
        </View>
      ))}
      <TextInput
        style={styles.input}
        value={googleFormUrl}
        onChangeText={setGoogleFormUrl}
        placeholder="Enter Google Form URL (optional)"
      />
      {loading ? (
        <ActivityIndicator size="large" color="#fff" />
      ) : (
        <View style={styles.superButtonContainer}>
          <TouchableOpacity style={styles.primaryButton} onPress={handleAddQuiz}>
            <Text style={styles.buttonText}>{translations?.add || 'Add'} {translations?.quiz || 'Quiz'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
            <Text style={styles.buttonText}>{translations?.cancel || 'Cancel'}</Text>
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.superButtonContainer}>
        <TouchableOpacity style={styles.addButton} onPress={handleAddQuestion}>
          <Icon name="plus" size={16} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>{translations?.add || 'Add'} {translations?.question || 'Question'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default AddQuiz;
