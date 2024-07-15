import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { createPlan } from '../../services/api';
import Header from '../General/Header';
import { TranslationContext } from '../../context/TranslationContext';
import styles from '../General/styles';

const AddPlan = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const { translations } = useContext(TranslationContext);

  const handleAddPlan = async () => {
    try {
      const response = await createPlan({ title, description });
      if (response.status === 201) {
        Alert.alert('Success', `${translations.plan} added successfully`);
        navigation.navigate('ManagePlans');
      } else {
        Alert.alert('Error', `Failed to add ${translations.plan}`);
      }
    } catch (error) {
      console.error('Add Plan error:', error);
      Alert.alert('Error', `Failed to add ${translations.plan}`);
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('ManagePlans')}>
        <Text style={styles.backButtonText}>Back to Manage {translations.plans}</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Add {translations.plan}</Text>
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
      <TouchableOpacity style={styles.button} onPress={handleAddPlan}>
        <Text style={styles.buttonText}>Add {translations.plan}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddPlan;
