import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { fetchQuizzesByPlanId } from '../../services/api';
import Header from '../General/Header';
import { TranslationContext } from '../../context/TranslationContext';
import { UserContext } from '../../context/UserContext';
import styles from '../General/stylesOld';
import Icon from 'react-native-vector-icons/FontAwesome';

const PlanDetails = ({ route, navigation }) => {
  const { planId } = route.params;
  const [quizzes, setQuizzes] = useState([]);
  const { translations } = useContext(TranslationContext);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchQuizzesByPlanId(planId);
        setQuizzes(response.data);
      } catch (error) {
        Alert.alert(translations.error, translations.failedToFetchQuizzes);
      }
    };

    fetchData();
  }, [planId, translations.error, translations.failedToFetchQuizzes]);

  const handleManageChapters = () => {
    navigation.navigate('ManageChapters', { plan: { _id: planId } });
  };

  const renderQuizItem = ({ item }) => (
    <TouchableOpacity
      style={styles.quizItem}
      onPress={() => navigation.navigate('ViewQuiz', { quizId: item._id })}
    >
      <Text style={styles.quizText}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header />
      {user.isAdmin && (
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('AdminDashboard')}>
          <Icon name="arrow-left" size={16} color="#fff" />
          <Text style={styles.backButtonText}>{translations.backToDashboard || 'Back to Dashboard'}</Text>
        </TouchableOpacity>
      )}
      <Text style={styles.title}>{translations.planDetails}</Text>
      <TouchableOpacity style={styles.addButton} onPress={handleManageChapters}>
        <Icon name="plus" size={16} color="#fff" style={styles.addButtonIcon} />
        <Text style={styles.addButtonText}>{translations.manageChapters || 'Manage Chapters'}</Text>
      </TouchableOpacity>
      {quizzes.length === 0 ? (
        <Text style={styles.noQuizzesText}>{translations.noQuizzesAvailable}</Text>
      ) : (
        <FlatList
          data={quizzes}
          keyExtractor={(item) => item._id}
          renderItem={renderQuizItem}
          contentContainerStyle={styles.contentContainer}
        />
      )}
    </View>
  );
};

export default PlanDetails;
