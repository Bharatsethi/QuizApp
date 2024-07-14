import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, Alert } from 'react-native';
import { fetchPlans, createPlan, updatePlan, deletePlan } from '../services/api';
import Header from './Header';

const ManagePlans = () => {
  const [plans, setPlans] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    const getPlans = async () => {
      const response = await fetchPlans();
      setPlans(response.data);
    };

    getPlans();
  }, []);

  const handleCreateOrUpdate = async () => {
    try {
      if (selectedPlan) {
        await updatePlan(selectedPlan._id, { title, description });
        Alert.alert('Success', 'Plan updated successfully');
      } else {
        await createPlan({ title, description });
        Alert.alert('Success', 'Plan created successfully');
      }
      setTitle('');
      setDescription('');
      setSelectedPlan(null);
      const response = await fetchPlans();
      setPlans(response.data);
    } catch (error) {
      Alert.alert('Error', 'Something went wrong');
    }
  };

  const handleEdit = (plan) => {
    setTitle(plan.title);
    setDescription(plan.description);
    setSelectedPlan(plan);
  };

  const handleDelete = async (planId) => {
    try {
      await deletePlan(planId);
      Alert.alert('Success', 'Plan deleted successfully');
      const response = await fetchPlans();
      setPlans(response.data);
    } catch (error) {
      Alert.alert('Error', 'Something went wrong');
    }
  };

  return (
    <View>
        <Header />
      <Text>Title:</Text>
      <TextInput value={title} onChangeText={setTitle} />
      <Text>Description:</Text>
      <TextInput value={description} onChangeText={setDescription} />
      <Button title={selectedPlan ? 'Update Plan' : 'Create Plan'} onPress={handleCreateOrUpdate} />
      <FlatList
        data={plans}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View>
            <Text>{item.title}</Text>
            <Text>{item.description}</Text>
            <Button title="Edit" onPress={() => handleEdit(item)} />
            <Button title="Delete" onPress={() => handleDelete(item._id)} />
          </View>
        )}
      />
    </View>
  );
};

export default ManagePlans;
