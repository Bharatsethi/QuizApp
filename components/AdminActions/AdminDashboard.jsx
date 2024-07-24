import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Header from '../General/Header';
import { fetchPlans, fetchUsersbyAdmin, fetchTranslations, deletePlan, addUserToPlan } from '../../services/api';
import styles from '../General/styles';
import { TranslationContext } from '../../context/TranslationContext';

const AdminDashboard = ({ navigation }) => {
  const [plans, setPlans] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const { translations, setTranslationContext } = useContext(TranslationContext);

  useEffect(() => {
    fetchPlansData();
    fetchUsersData();
    fetchTranslationsData();
  }, []);

  const fetchPlansData = async () => {
    try {
      const response = await fetchPlans();
      setPlans(response.data);
    } catch (error) {
      console.error('Failed to fetch plans:', error);
      Alert.alert(translations.error || 'Error', translations.failedToFetchPlans || 'Failed to fetch plans. Please try again later.');
    }
  };

  const fetchUsersData = async () => {
    try {
      const response = await fetchUsersbyAdmin();
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      Alert.alert(translations.error || 'Error', translations.failedToFetchUsers || 'Failed to fetch users. Please try again later.');
    }
  };

  const fetchTranslationsData = async () => {
    try {
      const response = await fetchTranslations();
      if (response.data) {
        setTranslationContext(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch translations:', error);
    }
  };

  const handleManagePlans = () => {
    navigation.navigate('ManagePlans');
  };

  const handleManageUsers = () => {
    navigation.navigate('UserList');
  };

  const handleManageMessages = () => {
    navigation.navigate('ManageMessages');
  };

  const handleViewPlan = (planId) => {
    navigation.navigate('PlanDetails', { planId });
  };

  const handleAddUserToPlan = (plan) => {
    setSelectedPlan(plan);
    setShowUserModal(true);
  };

  const handleUserSelection = async (userId) => {
    try {
      await addUserToPlan(selectedPlan._id, userId);
      Alert.alert(translations.success || 'Success', translations.userAddedToPlan || 'User added to plan successfully');
      setShowUserModal(false);
    } catch (error) {
      console.error('Failed to add user to plan:', error);
      Alert.alert(translations.error || 'Error', translations.failedToAddUserToPlan || 'Failed to add user to plan. Please try again later.');
    }
  };

  const renderPlanItem = ({ item }) => (
    <View style={styles.planItem}>
      <Text style={styles.planText}>{item.title}</Text>
      <View style={styles.planActions}>
        <TouchableOpacity style={styles.planActionButton} onPress={() => handleViewPlan(item._id)}>
          <Icon name="eye" size={20} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.planActionButton} onPress={() => handleAddUserToPlan(item)}>
          <Icon name="user-plus" size={20} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.planActionButton} onPress={() => handleEditPlan(item._id)}>
          <Icon name="edit" size={20} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.planActionButton} onPress={() => handleDeletePlan(item._id)}>
          <Icon name="trash" size={20} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderUserItem = ({ item }) => (
    <TouchableOpacity style={styles.userItem} onPress={() => handleUserSelection(item._id)}>
      <Text style={styles.userText}>{item.username}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.adminDashboardContainer}>
        <TouchableOpacity style={styles.tileButton} onPress={handleManagePlans}>
          <Icon name="book" size={30} color="#fff" />
          <Text style={styles.tileButtonText}>{translations.managePlans || 'Manage Plans'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tileButton} onPress={handleManageUsers}>
          <Icon name="users" size={30} color="#fff" />
          <Text style={styles.tileButtonText}>{translations.manageUsers || 'Manage Users'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tileButton} onPress={handleManageMessages}>
          <Icon name="envelope" size={30} color="#fff" />
          <Text style={styles.tileButtonText}>{translations.manageMessages || 'Manage Messages'}</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.sectionTitle}>{translations.plans || 'Plans'}</Text>
      {plans.length === 0 ? (
        <Text style={styles.noPlansText}>{translations.noPlans || 'No plans created yet. Start by creating a plan.'}</Text>
      ) : (
        <FlatList
          data={plans}
          keyExtractor={(item) => item._id}
          renderItem={renderPlanItem}
          contentContainerStyle={styles.plansList}
        />
      )}
      <Modal visible={showUserModal} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>{translations.selectUser || 'Select User'}</Text>
          <FlatList
            data={users}
            keyExtractor={(item) => item._id}
            renderItem={renderUserItem}
            contentContainerStyle={styles.usersList}
          />
          <TouchableOpacity style={styles.modalCloseButton} onPress={() => setShowUserModal(false)}>
            <Text style={styles.modalCloseButtonText}>{translations.close || 'Close'}</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default AdminDashboard;
