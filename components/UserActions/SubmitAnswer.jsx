import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { submitAnswer } from '../../services/api';
import { TranslationContext } from '../../context/TranslationContext';
import { UserContext } from '../../context/UserContext'; // Assuming you have a UserContext
import styles from '../General/styles';

const SubmitAnswer = ({ route, navigation }) => {
  const { quizId, questionId } = route.params;
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const { translations } = useContext(TranslationContext);
  const { user } = useContext(UserContext); // Assuming you have a UserContext to get the current user

  const handleSubmit = async () => {
    if (!answer.trim()) {
      Alert.alert(translations.error, translations.enterYourAnswer);
      return;
    }

    setLoading(true);

    try {
      await submitAnswer({ userId: user.userId, quizId, questionId, answer });
      Alert.alert(translations.success, translations.answerSubmitted);
      navigation.goBack();
    } catch (error) {
      console.error('Failed to submit answer:', error);
      Alert.alert(translations.error, translations.failedToSubmitAnswer);
    } finally {
      setLoading(false);
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
        accessibilityLabel="Answer Input"
      />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <TouchableOpacity style={styles.primaryButton} onPress={handleSubmit}>
            <Text style={styles.buttonText}>{translations.submit}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
            <Text style={styles.buttonText}>{translations.cancel}</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default SubmitAnswer;
