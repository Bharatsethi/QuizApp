import React, { useState, useContext, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { getQuestionById, updateQuestion } from '../../services/api';
import Header from '../General/Header';
import RichTextEditor from '../General/RichTextEditor';
import { TranslationContext } from '../../context/TranslationContext';
import styles from '../General/styles';
import Icon from 'react-native-vector-icons/FontAwesome';

const EditQuestion = ({ route, navigation }) => {
  const { questionId } = route.params;
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState([]);
  const [questionType, setQuestionType] = useState('single'); // single, multiple, or freeText
  const { translations } = useContext(TranslationContext);
  const richTextEditor = useRef();

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await getQuestionById(questionId);
        const { questionText, options, questionType } = response.data;
        setQuestionText(questionText);
        setOptions(options || []);
        setQuestionType(questionType || 'single');
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
    if (!questionText || (questionType !== 'freeText' && options.some(option => option.text === ''))) {
      Alert.alert(translations.error, 'Please fill all fields');
      return;
    }

    try {
      const response = await updateQuestion(questionId, {
        questionText,
        options: questionType !== 'freeText' ? options : [],
        questionType,
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
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('AdminDashboard')}>
        <Icon name="arrow-left" size={16} color="#fff" />
        <Text style={styles.backButtonText}>{translations.backToDashboard || 'Back to Dashboard'}</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Edit {translations.question}</Text>
      <Text style={styles.label}>Question Type:</Text>
      <View style={styles.flexRow}>
        <TouchableOpacity
          style={questionType === 'single' ? styles.selectedOption : styles.unselectedOption}
          onPress={() => setQuestionType('single')}
        >
          <Text style={styles.optionText}>Single Answer</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={questionType === 'multiple' ? styles.selectedOption : styles.unselectedOption}
          onPress={() => setQuestionType('multiple')}
        >
          <Text style={styles.optionText}>Multiple Answers</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={questionType === 'freeText' ? styles.selectedOption : styles.unselectedOption}
          onPress={() => setQuestionType('freeText')}
        >
          <Text style={styles.optionText}>Free Text</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.input}
        value={questionText}
        onChangeText={setQuestionText}
        placeholder={`Enter ${translations.question.toLowerCase()} text`}
      />
      {questionType !== 'freeText' && (
        <>
          {options.map((option, index) => (
            <View key={index} style={styles.optionContainer}>
              <RichTextEditor
                ref={richTextEditor}
                content={option.text}
                onContentChange={(text) => handleOptionChange(index, text)}
              />
              <View style={styles.flexRow}>
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
      <View style={styles.buttonContainer}>
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
