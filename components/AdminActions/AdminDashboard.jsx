// AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Header from '../General/Header';
import { fetchPlans } from '../../services/api';

const AdminDashboard = ({ navigation }) => {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    fetchPlansData();
  }, []);

  const fetchPlansData = async () => {
    try {
      const response = await fetchPlans();
      setPlans(response.data);
    } catch (error) {
      console.error('Failed to fetch plans:', error);
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

  const renderPlanItem = ({ item }) => (
    <View style={styles.planItem}>
      <Text style={styles.planText}>{item.title}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.tileButton} onPress={handleManagePlans}>
          <Icon name="book" size={30} color="#fff" />
          <Text style={styles.tileButtonText}>Manage Plans</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tileButton} onPress={handleManageUsers}>
          <Icon name="users" size={30} color="#fff" />
          <Text style={styles.tileButtonText}>Manage Users</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tileButton} onPress={handleManageMessages}>
          <Icon name="envelope" size={30} color="#fff" />
          <Text style={styles.tileButtonText}>Manage Messages</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.sectionTitle}>Plans</Text>
      {plans.length === 0 ? (
        <Text style={styles.noPlansText}>No plans created yet. Start by creating a plan.</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  tileButton: {
    backgroundColor: '#1E90FF',
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '30%',
  },
  tileButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
  },
  noPlansText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#333',
  },
  plansList: {
    paddingHorizontal: 20,
  },
  planItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginVertical: 5,
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
});

export default AdminDashboard;
