import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { createPlan } from '../../services/api';
import Header from '../General/Header';
import { TranslationContext } from '../../context/TranslationContext';
import { UserContext } from '../../context/UserContext';
import styles from '../General/styles';
import Icon from 'react-native-vector-icons/FontAwesome';

const AddPlan = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const { translations } = useContext(TranslationContext);
  const { user } = useContext(UserContext);

  const handleAddPlan = async () => {
    if (!title || !description) {
      Alert.alert(translations.error || 'Error', translations.fillAllFields || 'Please fill all fields');
      return;
    }

    try {
      const planData = { title, description, adminId: user.userId };
      const response = await createPlan(planData);
      
      // Assuming the API returns the created plan data
      if (response && response.data) {
        Alert.alert(
          translations.success || 'Success',
          translations.planAdded || 'Plan added successfully',
          [
            {
              text: 'OK',
              onPress: () => {
                // Optionally, navigate to the details of the newly created plan
                navigation.goBack();
              },
            },
          ]
        );
      } else {
        throw new Error('Unexpected response');
      }
    } catch (error) {
      console.error('Error adding plan:', error); // Log the error for debugging purposes
      Alert.alert(translations.error || 'Error', translations.somethingWentWrong || 'Something went wrong');
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('ManagePlans')}>
        <Icon name="arrow-left" size={16} color="#fff" />
        <Text style={styles.backButtonText}>
          {translations.backToManagePlans || `Back to Manage ${translations.plans}`}
        </Text>
      </TouchableOpacity>
      <Text style={styles.title}>{translations.addPlan || `Add ${translations.plan}`}</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder={translations.enterPlanTitle || `Enter ${translations.plan.toLowerCase()} title`}
        autoCorrect={false}
      />
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        placeholder={translations.enterPlanDescription || `Enter ${translations.plan.toLowerCase()} description`}
        multiline
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.primaryButton} onPress={handleAddPlan}>
          <Text style={styles.buttonText}>{translations.addPlan || `Add ${translations.plan}`}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>{translations.cancel || 'Cancel'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AddPlan;
