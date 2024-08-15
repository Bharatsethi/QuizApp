import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { fetchPlans, fetchQuizzesByPlanId, deletePlan } from '../../services/api';
import Header from '../General/Header';
import Icon from 'react-native-vector-icons/FontAwesome';
import { TranslationContext } from '../../context/TranslationContext';
import styles from '../General/styles';

const PlanList = ({ navigation }) => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const { translations } = useContext(TranslationContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchPlans();
        setPlans(response.data);
      } catch (error) {
        Alert.alert(translations.error || 'Error', translations.failedToFetchPlans || 'Failed to fetch plans');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleViewQuizzes = async (planId) => {
    setLoading(true);
    try {
      const response = await fetchQuizzesByPlanId(planId);
      navigation.navigate('QuizList', { quizzes: response.data });
    } catch (error) {
      Alert.alert(translations.error || 'Error', translations.failedToFetchQuizzes || 'Failed to fetch quizzes');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePlan = (planId) => {
    Alert.alert(
      translations.confirm || 'Confirm',
      translations.areYouSureDeletePlan || 'Are you sure you want to delete this plan?',
      [
        {
          text: translations.cancel || 'Cancel',
          style: 'cancel',
        },
        {
          text: translations.delete || 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletePlan(planId);
              setPlans(plans.filter((plan) => plan._id !== planId));
              Alert.alert(translations.success || 'Success', translations.planDeletedSuccessfully || 'Plan deleted successfully');
            } catch (error) {
              Alert.alert(translations.error || 'Error', translations.failedToDeletePlan || 'Failed to delete plan');
            }
          },
        },
      ]
    );
  };

  const handleAddPlan = () => {
    navigation.navigate('AddPlan', { onGoBack: refreshPlanList });
  };

  const refreshPlanList = async () => {
    setLoading(true);
    try {
      const response = await fetchPlans();
      setPlans(response.data);
    } catch (error) {
      Alert.alert(translations.error || 'Error', translations.failedToRefreshPlanList || 'Failed to refresh plan list');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Header />
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header />
      <TouchableOpacity style={styles.addButton} onPress={handleAddPlan}>
        <Icon name="plus" size={16} color="#fff" style={styles.addButtonIcon} />
        <Text style={styles.addButtonText}>{translations.addPlan || 'Add Plan'}</Text>
      </TouchableOpacity>
      <FlatList
        data={plans}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.planItem}>
            <Text style={styles.planText}>{item.title}</Text>
            <View style={styles.iconContainer}>
              <TouchableOpacity onPress={() => handleViewQuizzes(item._id)}>
                <Icon name="list" size={20} color="#000" style={styles.icon} />
                <Text style={styles.iconText}>{translations.viewQuizzes || 'View Quizzes'}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeletePlan(item._id)}>
                <Icon name="trash" size={20} color="#000" style={styles.icon} />
                <Text style={styles.iconText}>{translations.deletePlan || 'Delete Plan'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        contentContainerStyle={styles.contentContainer}
        ListEmptyComponent={<Text style={styles.emptyListText}>{translations.noPlansAvailable || 'No plans available'}</Text>}
      />
    </View>
  );
};

export default PlanList;
