import React, { useState, useContext, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { getQuestionById, updateQuestion } from '../../services/api';
import Header from '../General/Header';
import RichTextEditor from '../General/RichTextEditor';
import { TranslationContext } from '../../context/TranslationContext';
import { UserContext } from '../../context/UserContext';
import styles from '../General/styles';
import Icon from 'react-native-vector-icons/FontAwesome';

const EditQuestion = ({ route, navigation }) => {
  const { questionId } = route.params;
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState([]);
  const [questionType, setQuestionType] = useState('multiple-choice'); // 'multiple-choice' or 'free-text'
  const { translations } = useContext(TranslationContext);
  const { user } = useContext(UserContext);
  const richTextEditor = useRef();

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await getQuestionById(questionId);
        const { text, options, type } = response.data;
        setQuestionText(text);
        setOptions(options || []);
        setQuestionType(type || 'multiple-choice');
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch question details');
      }
    };
    fetchQuestion();
  }, [questionId]);

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

  const handleSaveChanges = async () => {
    if (!questionText || (questionType === 'multiple-choice' && options.some(option => option.text === ''))) {
      Alert.alert(translations.error || 'Error', 'Please fill all fields');
      return;
    }

    try {
      const response = await updateQuestion(questionId, {
        text: questionText,
        options: questionType === 'multiple-choice' ? options : [],
        type: questionType,
        adminId: user?.userId,
      });
      if (response.status === 200) {
        Alert.alert('Success', 'Question updated successfully');
        navigation.goBack();
      } else {
        Alert.alert('Error', 'Failed to update question');
      }
    } catch (error) {
      console.error('Update question error:', error);
      Alert.alert('Error', 'Failed to update question');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Header />
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={16} color="#fff" />
        <Text style={styles.backButtonText}>{translations.backToDashboard || 'Back to Dashboard'}</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Edit {translations.question}</Text>
      <Text style={styles.label}>Question Type:</Text>
      <View style={styles.flexRow}>
        <TouchableOpacity
          style={questionType === 'multiple-choice' ? styles.selectedOption : styles.unselectedOption}
          onPress={() => setQuestionType('multiple-choice')}
        >
          <Text style={styles.optionText}>Multiple Choice</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={questionType === 'free-text' ? styles.selectedOption : styles.unselectedOption}
          onPress={() => setQuestionType('free-text')}
        >
          <Text style={styles.optionText}>Free Text</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.input}
        value={questionText}
        onChangeText={setQuestionText}
        placeholder={`Enter ${translations.question?.toLowerCase() || 'question'} text`}
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
                  <Text style={styles.buttonText}>{option.isCorrect ? 'Correct' : 'Incorrect'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.removeButton} onPress={() => handleRemoveOption(index)}>
                  <Icon name="minus" size={16} color="#fff" />
                  <Text style={styles.buttonText}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
          <TouchableOpacity style={styles.addButton} onPress={handleAddOption}>
            <Icon name="plus" size={16} color="#fff" />
            <Text style={styles.buttonText}>Add Option</Text>
          </TouchableOpacity>
        </>
      )}
      <View style={styles.superButtonContainer}>
        <TouchableOpacity style={styles.primaryButton} onPress={handleSaveChanges}>
          <Text style={styles.buttonText}>Save Changes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>{translations.cancel}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default EditQuestion;
