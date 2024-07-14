import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import Header from '../General/Header';

const ManagePlans = ({ navigation, route }) => {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    fetchPlans();

    const unsubscribe = navigation.addListener('focus', () => {
      fetchPlans();
    });

    return unsubscribe;
  }, [navigation]);

  const fetchPlans = async () => {
    try {
      const response = await axios.get('http://192.168.0.75:3002/plans');
      setPlans(response.data);
    } catch (error) {
      console.error('Failed to fetch plans:', error);
    }
  };

  const handleAddPlan = () => {
    navigation.navigate('CreatePlan');
  };

  const handleEditPlan = (plan) => {
    navigation.navigate('EditPlan', { plan });
  };

  const handleDeletePlan = async (planId) => {
    try {
      await axios.delete(`http://192.168.0.75:3002/admin/plans/${planId}`);
      setPlans(plans.filter(plan => plan._id !== planId));
      Alert.alert('Success', 'Plan deleted successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to delete plan');
    }
  };

  const handleBackToDashboard = () => {
    navigation.navigate('AdminDashboard');
  };

  return (
    <View style={styles.container}>
      <Header />
      <TouchableOpacity style={styles.backButton} onPress={handleBackToDashboard}>
        <Icon name="arrow-left" size={20} color="#fff" style={styles.backIcon} />
        <Text style={styles.backButtonText}>Back to Dashboard</Text>
      </TouchableOpacity>
      <Text style={styles.pageTitle}>Manage Plans</Text>
      <TouchableOpacity style={styles.addButton} onPress={handleAddPlan}>
        <Icon name="plus" size={20} color="#fff" style={styles.addIcon} />
        <Text style={styles.addButtonText}>Add Plan</Text>
      </TouchableOpacity>
      {plans.length === 0 ? (
        <Text style={styles.noPlansText}>No plans available. Start by creating a new plan.</Text>
      ) : (
        <FlatList
          data={plans}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.planItem}>
              <Text style={styles.planText}>{item.title}</Text>
              <View style={styles.iconContainer}>
                <TouchableOpacity onPress={() => handleEditPlan(item)}>
                  <Icon name="pencil" size={20} color="#1E90FF" style={styles.icon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeletePlan(item._id)}>
                  <Icon name="trash" size={20} color="#FF6347" style={styles.icon} />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  backButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E90FF',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 4,
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backIcon: {
    marginRight: 10,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
  },
  addButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E90FF',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 4,
    alignSelf: 'center',
    marginVertical: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addIcon: {
    marginRight: 10,
  },
  noPlansText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#333',
    marginTop: 20,
  },
  planItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 10,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  planText: {
    fontSize: 16,
    color: '#333',
  },
  iconContainer: {
    flexDirection: 'row',
  },
  icon: {
    marginLeft: 20,
  },
});

export default ManagePlans;
