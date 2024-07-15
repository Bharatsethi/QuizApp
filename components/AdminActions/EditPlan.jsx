// EditPlan.jsx
import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import Header from '../General/Header';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from '../General/styles';
import { TranslationContext } from '../../context/TranslationContext';

const EditPlan = ({ route, navigation }) => {
  const { plan } = route.params;
  const [title, setTitle] = useState(plan.title);
  const [description, setDescription] = useState(plan.description);
  const { translations } = useContext(TranslationContext);
  const API_URL = 'http://137.154.208.211:3002';
  const handleEditPlan = async () => {
    try {
      const response = await axios.put(`http://${API_URL}:3002/admin/plans/${plan._id}`, { title, description });
      if (response.status === 200) {
        Alert.alert('Success', `${translations.plan} updated successfully`);
        navigation.navigate('ManagePlans');
      } else {
        console.error('Update failed:', response.data);
        Alert.alert('Error', `Failed to update ${translations.plan.toLowerCase()}`);
      }
    } catch (error) {
      console.error('Update error:', error.response ? error.response.data : error.message);
      Alert.alert('Error', `Failed to update ${translations.plan.toLowerCase()}`);
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('ManagePlans')}>
        <Icon name="arrow-left" size={16} color="#fff" />
        <Text style={styles.backButtonText}>Back to Manage {translations.plan}s</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Edit {translations.plan}</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder={`Enter ${translations.plan.toLowerCase()} title`}
      />
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        placeholder={`Enter ${translations.plan.toLowerCase()} description`}
      />
      <TouchableOpacity style={styles.button} onPress={handleEditPlan}>
        <Text style={styles.buttonText}>Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EditPlan;
