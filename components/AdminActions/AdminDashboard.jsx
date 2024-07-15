import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Header from '../General/Header';
import { fetchPlans, fetchTranslations } from '../../services/api';
import styles from '../General/styles';
import { TranslationContext } from '../../context/TranslationContext';

const AdminDashboard = ({ navigation }) => {
  const [plans, setPlans] = useState([]);
  const { translations, setTranslationContext } = useContext(TranslationContext);

  useEffect(() => {
    fetchPlansData();
    fetchTranslationsData();
  }, []);

  const fetchPlansData = async () => {
    try {
      const response = await fetchPlans();
      setPlans(response.data);
    } catch (error) {
      console.error('Failed to fetch plans:', error);
      Alert.alert('Error', 'Failed to fetch plans. Please try again later.');
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

  const handleManageTranslations = () => {
    navigation.navigate('ManageTranslations');
  };

  const handleViewAnswers = (planId) => {
    navigation.navigate('QuizList', { planId });
  };

  const renderPlanItem = ({ item }) => (
    <View style={styles.planItem}>
      <Text style={styles.planText}>{item.title}</Text>
      <TouchableOpacity style={styles.viewAnswersButton} onPress={() => handleViewAnswers(item._id)}>
        <Text style={styles.viewAnswersButtonText}>View Answers</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.tileButton} onPress={handleManagePlans}>
          <Icon name="book" size={30} color="#fff" />
          <Text style={styles.tileButtonText}>Manage {translations.plan}s</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tileButton} onPress={handleManageUsers}>
          <Icon name="users" size={30} color="#fff" />
          <Text style={styles.tileButtonText}>Manage Users</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tileButton} onPress={handleManageMessages}>
          <Icon name="envelope" size={30} color="#fff" />
          <Text style={styles.tileButtonText}>Manage Messages</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tileButton} onPress={handleManageTranslations}>
          <Icon name="language" size={30} color="#fff" />
          <Text style={styles.tileButtonText}>Manage Translations</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.sectionTitle}>{translations.plan}s</Text>
      {plans.length === 0 ? (
        <Text style={styles.noPlansText}>No {translations.plan.toLowerCase()}s created yet. Start by creating a {translations.plan.toLowerCase()}.</Text>
      ) : (
        <FlatList
          data={plans}
          keyExtractor={(item) => item._id}
          renderItem={renderPlanItem}
          contentContainerStyle={styles.plansList}
        />
      )}
    </View>
  );
};

export default AdminDashboard;
