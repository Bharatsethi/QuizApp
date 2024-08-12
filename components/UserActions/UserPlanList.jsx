import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { fetchPlans, requestAccess, checkUserAccess } from '../../services/api';
import Header from '../General/Header';
import Icon from 'react-native-vector-icons/FontAwesome';
import { TranslationContext } from '../../context/TranslationContext';
import styles from '../General/styles';

const UserPlanList = ({ navigation }) => {
  const [plans, setPlans] = useState([]);
  const [userAccess, setUserAccess] = useState({});
  const [orientation, setOrientation] = useState('PORTRAIT');
  const { translations } = useContext(TranslationContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchPlans();
        setPlans(response.data);
        const accessResponse = await checkUserAccess('currentUserId'); // Replace with actual current user ID
        setUserAccess(accessResponse.data);
      } catch (error) {
        Alert.alert(translations.error, translations.failedToFetchPlansOrUserAccess);
      }
    };

    fetchData();

    const updateOrientation = () => {
      const { width, height } = Dimensions.get('window');
      setOrientation(width > height ? 'LANDSCAPE' : 'PORTRAIT');
    };

    Dimensions.addEventListener('change', updateOrientation);
    updateOrientation();

    return () => {
      Dimensions.removeEventListener('change', updateOrientation);
    };
  }, []);

  const handleRequestAccess = async (planId) => {
    try {
      const userId = 'currentUserId'; // Replace with actual current user ID
      await requestAccess({ userId, planId });
      Alert.alert(translations.success, translations.accessRequestSent);
    } catch (error) {
      Alert.alert(translations.error, translations.failedToRequestAccess);
    }
  };

  const handleAccessPlan = (planId) => {
    if (userAccess[planId]) {
      navigation.navigate('PlanDetails', { planId });
    } else {
      handleRequestAccess(planId);
    }
  };

  const renderPlanItem = ({ item }) => (
    <View style={styles.planItem}>
      <Text style={styles.planText}>{item.title}</Text>
      <Text style={styles.planAdminText}>{`${translations.admin}: ${item.admin.username}`}</Text>
      {orientation === 'LANDSCAPE' && <Text style={styles.planDescriptionText}>{item.description}</Text>}
      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={() => handleAccessPlan(item._id)}>
          <Icon name={userAccess[item._id] ? "unlock" : "key"} size={20} color="#000" style={styles.icon} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header />
      <FlatList
        data={plans}
        keyExtractor={(item) => item._id}
        renderItem={renderPlanItem}
        contentContainerStyle={styles.contentContainer}
      />
    </View>
  );
};

export default UserPlanList;
