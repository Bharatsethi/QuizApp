import React, { useEffect, useState, useContext, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, FlatList, TouchableOpacity, Alert, Modal } from 'react-native';
import { fetchQuestions, deleteQuestion, unlinkQuestionFromContext, linkQuestionToQuiz } from '../../services/api';
import Header from '../General/Header';
import Icon from 'react-native-vector-icons/FontAwesome';
import { TranslationContext } from '../../context/TranslationContext';
import { NavigationContext } from '../../context/NavigationContext';
import { UserContext } from '../../context/UserContext';
import styles from '../General/styles';

const ManageQuestions = ({ route, navigation }) => {
  const { quizId } = route.params;
  const [questions, setQuestions] = useState([]);
  const [availableQuestions, setAvailableQuestions] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const { translations } = useContext(TranslationContext);
  const { currentQuizId, setCurrentQuizId } = useContext(NavigationContext);
  const { user } = useContext(UserContext);

  useEffect(() => {
    setCurrentQuizId(quizId);
    fetchData();
  }, [quizId]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [currentQuizId])
  );

  const fetchData = async () => {
    if (currentQuizId) {
      try {
        const response = await fetchQuestions(user.userId, currentQuizId);
        if (response.status === 200) {
          setQuestions(response.data);
        } else {
          Alert.alert(translations.error, translations.failedToFetchQuestions);
        }
      } catch (error) {
        Alert.alert(translations.error, error.message || translations.failedToFetchQuestions);
      }
    }
  };

  const handleAddQuestion = () => {
    navigation.navigate('AddQuestion', { quizId: currentQuizId });
  };

  const handleEditQuestion = (question) => {
    navigation.navigate('EditQuestion', { questionId: question._id });
  };

  const handleDeleteQuestion = async (questionId) => {
    try {
      await deleteQuestion(questionId);
      setQuestions(questions.filter((q) => q._id !== questionId));
      Alert.alert(translations.success, translations.questionDeletedSuccessfully);
    } catch (error) {
      Alert.alert(translations.error, translations.failedToDeleteQuestion);
    }
  };

  const handleLinkOrUnlinkQuestion = async (questionId, isLinked) => {
    try {
      const response = isLinked 
        ? await unlinkQuestionFromContext(currentQuizId, questionId, 'quiz') 
        : await linkQuestionToQuiz(currentQuizId, questionId);
      if (response.status === 200) {
        fetchData();
        Alert.alert(translations.success, isLinked ? translations.questionUnlinkedSuccessfully : translations.questionLinkedSuccessfully);
      }
    } catch (error) {
      Alert.alert(translations.error, isLinked ? translations.failedToUnlinkQuestion : translations.failedToLinkQuestion);
    }
  };

  const handleLinkQuestion = async () => {
    try {
      const response = await fetchQuestions(user.userId);
      const nonLinkedQuestions = response.data.filter((question) => !questions.some((q) => q._id === question._id));
      setAvailableQuestions(nonLinkedQuestions);
      setModalVisible(true);
    } catch (error) {
      Alert.alert(translations.error, translations.failedToFetchQuestions);
    }
  };

  const renderAvailableQuestions = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{translations.selectQuestion}</Text>
          <FlatList
            data={availableQuestions}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  handleLinkOrUnlinkQuestion(item._id, false);
                  setModalVisible(false);
                }}
                style={styles.modalItem}
              >
                <Text>{item.text}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <Header />
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={16} color="#fff" />
        <Text style={styles.backButtonText}>Back to {translations.quiz}</Text>
      </TouchableOpacity>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={[styles.addButton, styles.shadow]} onPress={handleAddQuestion}>
          <Icon name="plus" size={16} color="#fff" />
          <Text style={styles.buttonText}>Add {translations.question}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.addButton, styles.shadow]} onPress={handleLinkQuestion}>
          <Icon name="link" size={16} color="#fff" />
          <Text style={styles.buttonText}>Link {translations.question}</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={questions}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={[styles.quizItem, styles.shadow]}>
            <Text style={styles.questionText}>{item.text}</Text>
            <View style={styles.iconContainer}>
              <TouchableOpacity onPress={() => handleEditQuestion(item)}>
                <Icon name="pencil" size={20} color="#000" style={styles.icon} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteQuestion(item._id)}>
                <Icon name="trash" size={20} color="#000" style={styles.icon} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleLinkOrUnlinkQuestion(item._id, true)}>
                <Icon name="unlink" size={20} color="#000" style={styles.icon} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      {renderAvailableQuestions()}
    </View>
  );
};

export default ManageQuestions;
