import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { fetchUserPlans, requestPlanAccess } from '../../services/api';
import { UserContext } from '../../context/UserContext';
import { TranslationContext } from '../../context/TranslationContext';
import Header from '../General/Header';
import styles from '../General/styles';
import Icon from 'react-native-vector-icons/FontAwesome';

const UserPlanList = ({ navigation }) => {
  const { user } = useContext(UserContext);
  const { translations } = useContext(TranslationContext);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPlans = async () => {
      try {
        const response = await fetchUserPlans(user.userId);
        setPlans(response.data);
      } catch (error) {
        console.error('Failed to fetch user plans:', error);
        Alert.alert(
          translations.error || 'Error',
          translations.failedToFetchPlans || 'Failed to fetch plans. Please try again later.'
        );
      } finally {
        setLoading(false);
      }
    };

    loadPlans();
  }, [user.userId, translations]);

  const handleRequestAccess = async (planId) => {
    try {
      const response = await requestPlanAccess(user.userId, planId);
      if (response.status === 200) {
        Alert.alert(translations.success || 'Success', translations.requestSent || 'Request sent successfully.');
        // Optionally update the plan's state to reflect the request
        setPlans((prevPlans) =>
          prevPlans.map((plan) =>
            plan._id === planId ? { ...plan, isAccessRequested: true } : plan
          )
        );
      } else {
        Alert.alert(translations.error || 'Error', translations.failedToSendRequest || 'Failed to send request. Please try again.');
      }
    } catch (error) {
      console.error('Failed to request access:', error);
      Alert.alert(translations.error || 'Error', translations.failedToSendRequest || 'Failed to send request. Please try again.');
    }
  };

  const renderPlanItem = ({ item }) => (
    <TouchableOpacity
      style={styles.planItem}
      onPress={() => item.isUserAssigned ? navigation.navigate('PlanDetails', { planId: item._id }) : null}
    >
      <View style={styles.planInfo}>
        <Text style={styles.planTitle}>{item.title || translations.untitledPlan || 'Untitled Plan'}</Text>
        <Text style={styles.planDescription}>{item.description || translations.noDescriptionAvailable || 'No description available.'}</Text>
      </View>
      <View style={styles.planActions}>
        {item.isUserAssigned ? (
          <Icon name="eye" size={20} color="#1E90FF" />
        ) : item.isAccessRequested ? (
          <Text style={styles.requestPendingText}>{translations.requestPending || 'Request Pending'}</Text>
        ) : (
          <TouchableOpacity onPress={() => handleRequestAccess(item._id)}>
            <Icon name="hand-paper-o" size={20} color="#FF4500" />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Header />
        <ActivityIndicator size="large" color="#1E90FF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header />
      <Text style={styles.title}>{translations.availablePlans || 'Available Plans'}</Text>
      {plans.length === 0 ? (
        <Text style={styles.noPlansText}>{translations.noPlansAvailable || 'No plans available.'}</Text>
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

export default UserPlanList;
