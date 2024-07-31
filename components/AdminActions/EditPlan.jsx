import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { updatePlan } from '../../services/api';
import Header from '../General/Header';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from '../General/stylesOld';
import { TranslationContext } from '../../context/TranslationContext';
import { UserContext } from '../../context/UserContext';

const EditPlan = ({ route, navigation }) => {
  const { plan } = route.params;
  const [title, setTitle] = useState(plan.title);
  const [description, setDescription] = useState(plan.description);
  const { translations } = useContext(TranslationContext);
  const { user } = useContext(UserContext); // Get the logged-in user's context

  const handleEditPlan = async () => {
    if (!title || !description) {
      Alert.alert(translations.error || 'Error', translations.fillAllFields || 'Please fill all fields');
      return;
    }
    try {
      const response = await updatePlan(plan._id, { title, description, adminId: user.userId }); // Include adminId
      if (response.status === 200) {
        Alert.alert(translations.success || 'Success', `${translations.plan || 'Plan'} ${translations.updatedSuccessfully || 'updated successfully'}`);
        navigation.navigate('ManagePlans');
      } else {
        console.error('Update failed:', response.data);
        Alert.alert(translations.error || 'Error', `${translations.failedToUpdate || 'Failed to update'} ${translations.plan?.toLowerCase() || 'plan'}`);
      }
    } catch (error) {
      console.error('Update error:', error.response ? error.response.data : error.message);
      Alert.alert(translations.error || 'Error', `${translations.failedToUpdate || 'Failed to update'} ${translations.plan?.toLowerCase() || 'plan'}`);
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('AdminDashboard')}>
        <Icon name="arrow-left" size={16} color="#fff" />
        <Text style={styles.backButtonText}>{translations.backToDashboard || 'Back to Dashboard'}</Text>
      </TouchableOpacity>
      <Text style={styles.title}>{translations.edit || 'Edit'} {translations.plan || 'Plan'}</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder={`${translations.enter || 'Enter'} ${translations.plan?.toLowerCase() || 'plan'} ${translations.title?.toLowerCase() || 'title'}`}
      />
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        placeholder={`${translations.enter || 'Enter'} ${translations.plan?.toLowerCase() || 'plan'} ${translations.description?.toLowerCase() || 'description'}`}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.primaryButton} onPress={handleEditPlan}>
          <Text style={styles.buttonText}>{translations.saveChanges || 'Save Changes'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>{translations.cancel || 'Cancel'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EditPlan;
