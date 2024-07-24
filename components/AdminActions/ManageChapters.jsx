import React, { useEffect, useState, useContext, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { fetchChapters, deleteChapter } from '../../services/api';
import Header from '../General/Header';
import Icon from 'react-native-vector-icons/FontAwesome';
import { TranslationContext } from '../../context/TranslationContext';
import styles from '../General/styles';

const ManageChapters = ({ route, navigation }) => {
  const { plan } = route.params;
  const [chapters, setChapters] = useState([]);
  const { translations } = useContext(TranslationContext);

  const fetchData = async () => {
    try {
      const response = await fetchChapters(plan._id);
      setChapters(response.data);
    } catch (error) {
      console.error('Failed to fetch chapters:', error);
      Alert.alert(translations.error || 'Error', translations.failedToFetchChapters || 'Failed to fetch chapters. Please try again later.');
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [plan._id])
  );

  const handleAddChapter = () => {
    navigation.navigate('AddChapter', { planId: plan._id });
  };

  const handleEditChapter = (chapter) => {
    navigation.navigate('EditChapter', { chapter });
  };

  const handleDeleteChapter = async (chapterId) => {
    Alert.alert(
      translations.confirm || 'Confirm',
      translations.confirmDeleteOrUnlink || 'Do you want to delete the chapter or just unlink it from the plan?',
      [
        {
          text: translations.delete || 'Delete',
          onPress: async () => {
            try {
              await deleteChapter(chapterId, 'delete');
              setChapters(chapters.filter(chapter => chapter._id !== chapterId));
              Alert.alert(translations.success || 'Success', `${translations.chapter} ${translations.deletedSuccessfully || 'deleted successfully'}`);
            } catch (error) {
              console.error('Failed to delete chapter:', error);
              Alert.alert(translations.error || 'Error', `${translations.failedToDelete || 'Failed to delete'} ${translations.chapter.toLowerCase()}`);
            }
          },
          style: 'destructive'
        },
        {
          text: translations.unlink || 'Unlink',
          onPress: async () => {
            try {
              await deleteChapter(chapterId, 'unlink');
              setChapters(chapters.filter(chapter => chapter._id !== chapterId));
              Alert.alert(translations.success || 'Success', `${translations.chapter} ${translations.unlinkedSuccessfully || 'unlinked successfully'}`);
            } catch (error) {
              console.error('Failed to unlink chapter:', error);
              Alert.alert(translations.error || 'Error', `${translations.failedToUnlink || 'Failed to unlink'} ${translations.chapter.toLowerCase()}`);
            }
          }
        },
        {
          text: translations.cancel || 'Cancel',
          style: 'cancel'
        }
      ]
    );
  };

  const handleManageLessons = (chapter) => {
    navigation.navigate('ManageLessons', { chapter });
  };

  const handleManageQuizzes = (chapter) => {
    navigation.navigate('ManageQuizzes', { contextId: chapter._id, contextType: 'chapter' });
  };

  return (
    <View style={styles.container}>
      <Header />
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('ManagePlans')}>
        <Icon name="arrow-left" size={16} color="#fff" />
        <Text style={styles.backButtonText}>{translations.backToPlans || 'Back to Plans'}</Text>
      </TouchableOpacity>
      <Text style={styles.sectionTitle}>{translations.manage} {translations.chapters} {translations.for} {plan.title}</Text>
      <TouchableOpacity style={styles.addButton} onPress={handleAddChapter}>
        <Icon name="plus" size={16} color="#fff" style={styles.addButtonIcon} />
        <Text style={styles.addButtonText}>{translations.add} {translations.chapter}</Text>
      </TouchableOpacity>
      <FlatList
        data={chapters}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.chapterItem}>
            <Text style={styles.chapterText}>{item.title}</Text>
            <View style={styles.iconContainer}>
              <TouchableOpacity onPress={() => handleEditChapter(item)}>
                <Icon name="pencil" size={20} color="#000" style={styles.icon} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteChapter(item._id)}>
                <Icon name="trash" size={20} color="#000" style={styles.icon} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleManageLessons(item)}>
                <Icon name="book" size={20} color="#000" style={styles.icon} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleManageQuizzes(item)}>
                <Icon name="question-circle" size={20} color="#000" style={styles.icon} />
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
