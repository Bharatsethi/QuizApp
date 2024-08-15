import React, { useState, useContext, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { createQuestion, fetchQuestions } from '../../services/api';
import Header from '../General/Header';
import RichTextEditor from '../General/RichTextEditor';
import { TranslationContext } from '../../context/TranslationContext';
import { UserContext } from '../../context/UserContext';
import { NavigationContext } from '../../context/NavigationContext';
import styles from '../General/styles';
import Icon from 'react-native-vector-icons/FontAwesome';

const AddQuestion = ({ navigation }) => {
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState([{ text: '', isCorrect: false }]);
  const [questionType, setQuestionType] = useState('multiple-choice');
  const [loading, setLoading] = useState(false); // Add loading state
  const { translations } = useContext(TranslationContext);
  const { user } = useContext(UserContext);
  const { currentQuizId } = useContext(NavigationContext);
  const richTextEditor = useRef();

  const handleAddOption = () => {
    setOptions([...options, { text: '', isCorrect: false }]);
  };

  const handleRemoveOption = (index) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleOptionChange = (index, text) => {
    const newOptions = options.slice();
    newOptions[index].text = text;
    setOptions(newOptions);
  };

  const handleOptionCorrectChange = (index, isCorrect) => {
    const newOptions = options.slice();
    newOptions[index].isCorrect = isCorrect;
    setOptions(newOptions);
  };

  const handleAddQuestion = async () => {
    if (!questionText || (questionType === 'multiple-choice' && options.some(option => !option.text))) {
      Alert.alert(translations.error || 'Error', 'Please fill all fields');
      return;
    }

    if (questionType === 'multiple-choice' && !options.some(option => option.isCorrect)) {
      Alert.alert(translations.error || 'Error', 'Please select at least one correct option');
      return;
    }

    setLoading(true); // Start loading
    try {
      const formattedOptions = options.map(option => ({
        text: option.text,
        isCorrect: option.isCorrect
      }));

      const response = await createQuestion({
        quizIds: [currentQuizId],
        text: questionText,
        options: questionType === 'multiple-choice' ? formattedOptions : undefined,
        type: questionType,
        adminId: user?.userId,
      });

      if (response && response.status === 201) {
        Alert.alert(translations.success || 'Success', translations.questionAddedSuccessfully || 'Question added successfully');
        navigation.goBack();
      } else {
        throw new Error('Failed to add question');
      }
    } catch (error) {
      console.error('Add question error:', error);
      Alert.alert(translations.error || 'Error', translations.failedToAddQuestion || 'Failed to add question');
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Header />
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={16} color="#fff" />
        <Text style={styles.backButtonText}>{translations.backToManageQuestions || 'Back to Manage Questions'}</Text>
      </TouchableOpacity>
      <Text style={styles.title}>{translations.addQuestion || 'Add Question'}</Text>
      <Text style={styles.label}>{translations.questionType || 'Question Type'}:</Text>
      <View style={styles.flexRow}>
        <TouchableOpacity
          style={questionType === 'multiple-choice' ? styles.selectedOption : styles.unselectedOption}
          onPress={() => setQuestionType('multiple-choice')}
        >
          <Text style={styles.optionText}>{translations.multipleChoice || 'Multiple Choice'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={questionType === 'free-text' ? styles.selectedOption : styles.unselectedOption}
          onPress={() => setQuestionType('free-text')}
        >
          <Text style={styles.optionText}>{translations.freeText || 'Free Text'}</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.input}
        value={questionText}
        onChangeText={setQuestionText}
        placeholder={`${translations.enterQuestionText || 'Enter question text'}`}
      />
      {questionType === 'multiple-choice' && (
        <>
          {options.map((option, index) => (
            <View key={index} style={styles.optionContainer}>
              <RichTextEditor
                ref={richTextEditor}
                content={option.text}
                onContentChange={(text) => handleOptionChange(index, text)}
              />
              <View style={styles.optionButtonsContainer}>
                <TouchableOpacity
                  style={option.isCorrect ? styles.correctButton : styles.incorrectButton}
                  onPress={() => handleOptionCorrectChange(index, !option.isCorrect)}
                >
                  <Text style={styles.buttonText}>{option.isCorrect ? translations.correct || 'Correct' : translations.incorrect || 'Incorrect'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.removeButton} onPress={() => handleRemoveOption(index)}>
                  <Icon name="minus" size={16} color="#fff" />
                  <Text style={styles.buttonText}>{translations.remove || 'Remove'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
          <TouchableOpacity style={styles.addButton} onPress={handleAddOption}>
            <Icon name="plus" size={16} color="#fff" />
            <Text style={styles.buttonText}>{translations.addOption || 'Add Option'}</Text>
          </TouchableOpacity>
        </>
      )}
      <View style={styles.superButtonContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#fff" />
        ) : (
          <>
            <TouchableOpacity style={styles.primaryButton} onPress={handleAddQuestion}>
              <Text style={styles.buttonText}>{translations.addQuestion || 'Add Question'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
              <Text style={styles.buttonText}>{translations.cancel || 'Cancel'}</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  );
};

export default AddQuestion;
