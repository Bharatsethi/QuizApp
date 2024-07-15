import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { submitAnswer } from '../../services/api';
import { TranslationContext } from '../../context/TranslationContext';
import styles from '../General/styles';

const SubmitAnswer = ({ route, navigation }) => {
  const { quizId, questionId } = route.params;
  const [answer, setAnswer] = useState('');
  const { translations } = useContext(TranslationContext);

  const handleSubmit = async () => {
    const userId = 'currentUserId'; // replace with actual current user ID
    try {
      await submitAnswer({ userId, quizId, questionId, answer });
      Alert.alert('Success', 'Answer submitted');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to submit answer');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{translations.yourAnswer}</Text>
      <TextInput
        style={styles.input}
        value={answer}
        onChangeText={setAnswer}
        placeholder={translations.enterYourAnswer}
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>{translations.submit}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SubmitAnswer;
