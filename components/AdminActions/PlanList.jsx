import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { fetchPlans, fetchQuizzesByPlanId, deletePlan } from '../../services/api';
import Header from '../General/Header';
import Icon from 'react-native-vector-icons/FontAwesome';
import { TranslationContext } from '../../context/TranslationContext';
import styles from '../General/styles';

const PlanList = ({ navigation }) => {
  const [plans, setPlans] = useState([]);
  const { translations } = useContext(TranslationContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchPlans();
        setPlans(response.data);
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch plans');
      }
    };

    fetchData();
  }, []);

  const handleViewQuizzes = async (planId) => {
    try {
      const response = await fetchQuizzesByPlanId(planId);
      navigation.navigate('QuizList', { quizzes: response.data });
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch quizzes');
    }
  };

  const handleDeletePlan = async (planId) => {
    try {
      await deletePlan(planId);
      setPlans(plans.filter((plan) => plan._id !== planId));
      Alert.alert('Success', 'Plan deleted successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to delete plan');
    }
  };

  const handleAddPlan = () => {
    navigation.navigate('AddPlan', { onGoBack: refreshPlanList });
  };

  const refreshPlanList = async () => {
    try {
      const response = await fetchPlans();
      setPlans(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to refresh plan list');
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      <TouchableOpacity style={styles.addButton} onPress={handleAddPlan}>
        <Text style={styles.addButtonText}>{translations.addPlan}</Text>
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
                <Text style={styles.planText}>{translations.viewQuizzes}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeletePlan(item._id)}>
                <Icon name="trash" size={20} color="#000" style={styles.icon} />
              </TouchableOpacity>
            </View>
          </View>
        )}
        contentContainerStyle={styles.contentContainer}
      />
    </View>
  );
};

export default PlanList;
