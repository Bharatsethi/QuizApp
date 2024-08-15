import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { fetchQuizzesByPlanId } from '../../services/api';
import Header from '../General/Header';
import { TranslationContext } from '../../context/TranslationContext';
import { UserContext } from '../../context/UserContext';
import styles from '../General/styles';
import Icon from 'react-native-vector-icons/FontAwesome';

const PlanDetails = ({ route, navigation }) => {
  const { planId } = route.params;
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const { translations } = useContext(TranslationContext);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchQuizzesByPlanId(planId);
        setQuizzes(response.data);
      } catch (error) {
        console.error('Error fetching quizzes:', error.response?.data || error.message);
        Alert.alert(translations.error, translations.failedToFetchQuizzes || 'Failed to fetch quizzes. Please try again later.');
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchData();
  }, [planId, translations]);

  const handleBackPress = () => {
    if (user.isAdmin) {
      navigation.navigate('ManagePlans');
    } else {
      navigation.navigate('UserPlanList');
    }
  };

  const handleManageChapters = () => {
    if (user.isAdmin) {
      navigation.navigate('ManageChapters', { plan: { _id: planId } });
    }
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
      <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
        <Icon name="arrow-left" size={16} color="#fff" />
        <Text style={styles.backButtonText}>
          {user.isAdmin ? translations.backToManagePlans || 'Back to Manage Plans' : translations.backToPlanList || 'Back to Plan List'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.title}>{translations.planDetails || 'Plan Details'}</Text>

      {user.isAdmin && (
        <TouchableOpacity style={styles.addButton} onPress={handleManageChapters}>
          <Icon name="plus" size={16} color="#fff" style={styles.addButtonIcon} />
          <Text style={styles.addButtonText}>{translations.manageChapters || 'Manage Chapters'}</Text>
        </TouchableOpacity>
      )}

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />
      ) : quizzes.length === 0 ? (
        <Text style={styles.noQuizzesText}>{translations.noQuizzesAvailable || 'No quizzes available for this plan.'}</Text>
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
