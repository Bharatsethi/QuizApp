import React, { useEffect, useState, useContext, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { fetchChapters, deleteChapter } from '../../services/api';
import Header from '../General/Header';
import Icon from 'react-native-vector-icons/FontAwesome';
import { TranslationContext } from '../../context/TranslationContext';
import { UserContext } from '../../context/UserContext';
import { NavigationContext } from '../../context/NavigationContext';
import styles from '../General/styles';
import { COLORS, FONTS } from '../General/colors';

const ManageChapters = ({ route, navigation }) => {
  const { plan } = route.params;
  const [chapters, setChapters] = useState([]);
  const { currentPlanId, setCurrentPlanId, setCurrentChapterId } = useContext(NavigationContext);
  const { translations } = useContext(TranslationContext);
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (plan) {
      setCurrentPlanId(plan._id); // Set current plan ID in context
    }
  }, [plan, setCurrentPlanId]);

  const fetchData = async () => {
    try {
      const response = await fetchChapters(currentPlanId);
      setChapters(response.data);
    } catch (error) {
      console.error('Failed to fetch chapters:', error);
      Alert.alert(translations.error, translations.failedToFetchChapters || 'Failed to fetch chapters. Please try again later.');
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [currentPlanId])
  );

  const handleAddChapter = () => {
    navigation.navigate('AddChapter', { planId: currentPlanId });
  };

  const handleEditChapter = (chapter) => {
    navigation.navigate('EditChapter', { chapter });
  };

  const handleDeleteChapter = async (chapterId, action) => {
    try {
      await deleteChapter(chapterId, action, currentPlanId, user.userId);
      setChapters(chapters.filter(chapter => chapter._id !== chapterId));
      Alert.alert(translations.success, `${translations.chapter} ${action === 'delete' ? translations.deletedSuccessfully : translations.unlinkedSuccessfully}`);
    } catch (error) {
      console.error(`Failed to ${action} chapter:`, error);
      Alert.alert(translations.error, `${action === 'delete' ? translations.failedToDelete : translations.failedToUnlink} ${translations.chapter.toLowerCase()}`);
    }
  };

  const confirmDeleteOrUnlink = (chapterId) => {
    Alert.alert(
      translations.confirm,
      translations.confirmDeleteOrUnlink || 'Do you want to delete the chapter or just unlink it from the plan?',
      [
        {
          text: translations.delete || 'Delete',
          onPress: () => handleDeleteChapter(chapterId, 'delete'),
          style: 'destructive'
        },
        {
          text: translations.unlink || 'Unlink',
          onPress: () => handleDeleteChapter(chapterId, 'unlink')
        },
        {
          text: translations.cancel || 'Cancel',
          style: 'cancel'
        }
      ]
    );
  };

  const handleManageLessons = (chapter) => {
    setCurrentChapterId(chapter._id);
    navigation.navigate('ManageLessons', { chapter });
  };

  const handleManageQuizzes = (chapter) => {
    navigation.navigate('ManageQuizzes', { contextId: chapter._id, contextType: 'chapter' });
  };
  

  return (
    <View style={styles.container}>
      <Header />
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('ManagePlans')}>
        <Icon name="arrow-left" size={16} color={COLORS.white} />
        <Text style={styles.backButtonText}>Back to {translations.plan}</Text>
      </TouchableOpacity>
      <Text style={styles.sectionTitle}>{translations.manage} {translations.chapters} {translations.for} {plan.title}</Text>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={[styles.addButton, styles.shadow]} onPress={handleAddChapter}>
          <Icon name="plus" size={16} color={COLORS.white} />
          <Text style={styles.addButtonText}>{translations.add} {translations.chapter}</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={chapters}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={[styles.chapterItem, styles.shadow]}>
            <Text style={styles.chapterText}>{item.title}</Text>
            <View style={styles.iconContainer}>
              <TouchableOpacity onPress={() => handleEditChapter(item)}>
                <Icon name="pencil" size={20} color={COLORS.black} style={styles.icon} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => confirmDeleteOrUnlink(item._id)}>
                <Icon name="trash" size={20} color={COLORS.black} style={styles.icon} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleManageLessons(item)}>
                <Icon name="book" size={20} color={COLORS.black} style={styles.icon} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleManageQuizzes(item)}>
                <Icon name="question-circle" size={20} color={COLORS.black} style={styles.icon} />
              </TouchableOpacity>
            </View>
          </View>
        )}
        contentContainerStyle={styles.chaptersList}
      />
    </View>
  );
};

export default ManageChapters;
