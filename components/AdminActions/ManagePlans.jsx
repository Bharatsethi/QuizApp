import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { fetchPlans, deletePlan } from '../../services/api';
import Header from '../General/Header';
import Icon from 'react-native-vector-icons/FontAwesome';
import { TranslationContext } from '../../context/TranslationContext';
import styles from '../General/styles';

const ManagePlans = ({ navigation }) => {
  const [plans, setPlans] = useState([]);
  const { translations } = useContext(TranslationContext);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetchPlans();
      setPlans(response.data);
    };
    fetchData();
  }, []);

  const handleAddPlan = () => {
    navigation.navigate('AddPlan');
  };

  const handleEditPlan = (plan) => {
    navigation.navigate('EditPlan', { plan });
  };

  const handleDeletePlan = async (planId) => {
    try {
      await deletePlan(planId);
      setPlans(plans.filter(plan => plan._id !== planId));
      Alert.alert('Success', `${translations.plan} deleted successfully`);
    } catch (error) {
      Alert.alert('Error', `Failed to delete ${translations.plan.toLowerCase()}`);
    }
  };
  
  const handleManageChapters = (plan) => {
    navigation.navigate('ManageChapters', { plan });
  };

  return (
    <View style={styles.container}>
      <Header />
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('AdminDashboard')}>
        <Icon name="arrow-left" size={16} color="#fff" />
        <Text style={styles.backButtonText}>Back to Dashboard</Text>
      </TouchableOpacity>
      <Text style={styles.sectionTitle}>Manage {translations.plans}</Text>
      <TouchableOpacity style={styles.addButton} onPress={handleAddPlan}>
        <Icon name="plus" size={16} color="#fff" style={styles.addButtonIcon} />
        <Text style={styles.addButtonText}>Add {translations.plan}</Text>
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
            </View>
          </View>
        )}
        contentContainerStyle={styles.plansList}
      />
    </View>
  );
};

export default ManagePlans;
