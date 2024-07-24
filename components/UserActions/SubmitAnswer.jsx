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
      Alert.alert(translations.success, translations.answerSubmitted);
      navigation.goBack();
    } catch (error) {
      Alert.alert(translations.error, translations.failedToSubmitAnswer);
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
      <TouchableOpacity style={styles.primaryButton} onPress={handleSubmit}>
        <Text style={styles.buttonText}>{translations.submit}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>{translations.cancel}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SubmitAnswer;
