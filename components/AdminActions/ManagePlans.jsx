import React, { useEffect, useState, useContext, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { fetchPlans, deletePlan, addUserToPlan } from '../../services/api';
import Header from '../General/Header';
import Icon from 'react-native-vector-icons/FontAwesome';
import { TranslationContext } from '../../context/TranslationContext';
import { UserContext } from '../../context/UserContext';
import { NavigationContext } from '../../context/NavigationContext';
import styles from '../General/styles';

const ManagePlans = ({ navigation }) => {
  const [plans, setPlans] = useState([]);
  const { translations } = useContext(TranslationContext);
  const { user } = useContext(UserContext);
  const { setCurrentPlanId } = useContext(NavigationContext);

  const fetchData = async () => {
    try {
      const response = await fetchPlans();
      setPlans(response.data);
    } catch (error) {
      console.error('Failed to fetch plans:', error);
      Alert.alert(translations.error || 'Error', translations.failedToFetchPlans || 'Failed to fetch plans. Please try again later.');
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [translations])
  );

  const handleAddPlan = () => {
    navigation.navigate('AddPlan');
  };

  const handleEditPlan = (plan) => {
    navigation.navigate('EditPlan', { plan });
  };

  const handleDeletePlan = async (planId) => {
    try {
      await deletePlan(planId, user.userId);
      setPlans(plans.filter(plan => plan._id !== planId));
      Alert.alert(translations.success || 'Success', `${translations.plan} ${translations.deletedSuccessfully || 'deleted successfully'}`);
    } catch (error) {
      console.error('Delete plan error:', error);
      Alert.alert(translations.error || 'Error', `${translations.failedToDelete || 'Failed to delete'} ${translations.plan.toLowerCase()}`);
    }
  };

  const handleManageChapters = (plan) => {
    setCurrentPlanId(plan._id);
    navigation.navigate('ManageChapters', { plan });
  };

  const handleManageQuizzes = (plan) => {
    navigation.navigate('ManageQuizzes', { contextId: plan._id, contextType: 'plan' });
  };

  const handleViewPlanAsUser = async (plan) => {
    try {
      await addUserToPlan(plan._id, user.userId);
      navigation.navigate('PlanDetails', { planId: plan._id });
    } catch (error) {
      Alert.alert(translations.error || 'Error', translations.failedToAddUserToPlan || 'Failed to add user to plan.');
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('AdminDashboard')}>
        <Icon name="arrow-left" size={16} color="#fff" />
        <Text style={styles.backButtonText}>{translations.backToDashboard || 'Back to Dashboard'}</Text>
      </TouchableOpacity>
      <Text style={styles.sectionTitle}>{translations.manage} {translations.plans}</Text>
      <TouchableOpacity style={styles.addButton} onPress={handleAddPlan}>
        <Icon name="plus" size={16} color="#fff" style={styles.addButtonIcon} />
        <Text style={styles.addButtonText}>{translations.add} {translations.plan}</Text>
      </TouchableOpacity>
      <FlatList
        data={plans}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.planItem}>
            <Text style={styles.planText}>{item.title}</Text>
            <View style={styles.iconContainer}>
              <TouchableOpacity onPress={() => handleEditPlan(item)}>
                <Icon name="pencil" size={20} color="#000" style={styles.icon} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeletePlan(item._id)}>
                <Icon name="trash" size={20} color="#000" style={styles.icon} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleManageChapters(item)}>
                <Icon name="book" size={20} color="#000" style={styles.icon} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleViewPlanAsUser(item)}>
                <Icon name="eye" size={20} color="#000" style={styles.icon} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleManageQuizzes(item)}>
                <Icon name="question-circle" size={20} color="#000" style={styles.icon} />
              </TouchableOpacity>
            </View>
          </View>
        )}
        contentContainerStyle={styles.plansList}
      />
    </View>
  );
};

export default ManagePlans;
