import React, { useEffect, useState, useContext, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, FlatList, TouchableOpacity, Alert, Modal, Button } from 'react-native';
import { fetchQuestions, deleteQuestion, unlinkQuestionFromContext, linkQuestionToQuiz } from '../../services/api';
import Header from '../General/Header';
import Icon from 'react-native-vector-icons/FontAwesome';
import { TranslationContext } from '../../context/TranslationContext';
import { NavigationContext } from '../../context/NavigationContext';
import { UserContext } from '../../context/UserContext';
import styles from '../General/styles';

const ManageQuestions = ({ route, navigation }) => {
  const { quizId } = route.params || {}; // Ensure route is correctly included
  const [questions, setQuestions] = useState([]);
  const [availableQuestions, setAvailableQuestions] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const { translations } = useContext(TranslationContext);
  const { currentQuizId, setCurrentQuizId } = useContext(NavigationContext);
  const { user } = useContext(UserContext);

  useEffect(() => {
    setCurrentQuizId(quizId); // Ensure currentQuizId is updated when navigated to this screen
  }, [quizId, setCurrentQuizId]);

  const fetchData = useCallback(async () => {
    if (currentQuizId) {
      try {
        const response = await fetchQuestions(user.userId, currentQuizId);
        if (response.status === 200) {
          setQuestions(response.data);
        } else {
          throw new Error('Failed to fetch questions');
        }
      } catch (error) {
        Alert.alert(translations.error || 'Error', translations.failedToFetchQuestions || 'Failed to fetch questions');
      }
    }
  }, [currentQuizId, translations, user.userId]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  const goBackToManageQuizzes = () => {
    setCurrentQuizId(null); // Reset currentQuizId when leaving the screen
    navigation.navigate('ManageQuizzes', { contextId, contextType }); // Pass back the contextId and contextType
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
      setQuestions(questions.filter((question) => question._id !== questionId));
      Alert.alert(translations.success || 'Success', translations.questionDeletedSuccessfully || 'Question deleted successfully');
    } catch (error) {
      Alert.alert(translations.error || 'Error', translations.failedToDeleteQuestion || 'Failed to delete question');
    }
  };

  const handleUnlinkQuestion = async (questionId) => {
    try {
      await unlinkQuestionFromContext(currentQuizId, questionId, 'quiz');
      setQuestions(questions.filter((question) => question._id !== questionId));
      Alert.alert(translations.success || 'Success', translations.questionUnlinkedSuccessfully || 'Question unlinked successfully');
    } catch (error) {
      Alert.alert(translations.error || 'Error', translations.failedToUnlinkQuestion || 'Failed to unlink question');
    }
  };

  const handleLinkQuestion = async () => {
    try {
      const response = await fetchQuestions(); // Fetch all questions to allow selection
      const availableQuestions = response.data.filter((question) => !questions.some((q) => q._id === question._id));
      setAvailableQuestions(availableQuestions);
      setModalVisible(true);
    } catch (error) {
      Alert.alert(translations.error || 'Error', translations.failedToFetchQuestions || 'Failed to fetch questions');
    }
  };

  const linkSelectedQuestion = async (questionId) => {
    try {
      await linkQuestionToQuiz(currentQuizId, questionId);
      setQuestions([...questions, availableQuestions.find((q) => q._id === questionId)]);
      Alert.alert(translations.success || 'Success', translations.questionLinkedSuccessfully || 'Question linked successfully');
      setModalVisible(false);
    } catch (error) {
      Alert.alert(translations.error || 'Error', translations.failedToLinkQuestion || 'Failed to link question');
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
          <Text style={styles.modalTitle}>{translations.selectQuestion || 'Select Question'}</Text>
          <FlatList
            data={availableQuestions}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => linkSelectedQuestion(item._id)} style={styles.modalItem}>
                <Text>{item.text}</Text>
              </TouchableOpacity>
            )}
          />
          <Button title={translations.cancel || 'Cancel'} onPress={() => setModalVisible(false)} />
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <Header />
      <TouchableOpacity
        style={styles.backButton}
        onPress={goBackToManageQuizzes}
      >
        <Icon name="arrow-left" size={16} color="#fff" style={styles.buttonIcon} />
        <Text style={styles.backButtonText}>{translations.back} to Manage Quizzes</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.addButton} onPress={handleAddQuestion}>
        <Icon name="plus" size={16} color="#fff" style={styles.buttonIcon} />
        <Text style={styles.buttonText}>{translations.add} {translations.question}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.addButton} onPress={handleLinkQuestion}>
        <Icon name="link" size={16} color="#fff" style={styles.buttonIcon} />
        <Text style={styles.buttonText}>{translations.link} {translations.question}</Text>
      </TouchableOpacity>
      <FlatList
        data={questions}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.questionItem}>
            <Text style={styles.questionText}>{item.text}</Text>
            <View style={styles.iconContainer}>
              <TouchableOpacity onPress={() => handleEditQuestion(item)}>
                <Icon name="pencil" size="20" color="#000" style={styles.icon} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteQuestion(item._id)}>
                <Icon name="trash" size="20" color="#000" style={styles.icon} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleUnlinkQuestion(item._id)}>
                <Icon name="unlink" size="20" color="#000" style={styles.icon} />
              </TouchableOpacity>
            </View>
          </View>
        )}
        contentContainerStyle={styles.contentContainer}
      />
      {renderAvailableQuestions()}
    </View>
  );
};

export default ManageQuestions;
