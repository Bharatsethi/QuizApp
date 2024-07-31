import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, FlatList } from 'react-native';
import { fetchChaptersByAdmin, createChapter } from '../../services/api';
import Header from '../General/Header';
import { TranslationContext } from '../../context/TranslationContext';
import { UserContext } from '../../context/UserContext';
import styles from '../General/stylesOld';
import Icon from 'react-native-vector-icons/FontAwesome';

const AddExistingChapter = ({ route, navigation }) => {
  const { planId } = route.params;
  const [existingChapters, setExistingChapters] = useState([]);
  const { translations } = useContext(TranslationContext);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const loadExistingChapters = async () => {
      try {
        const response = await fetchChaptersByAdmin(user.userId);
        setExistingChapters(response.data);
      } catch (error) {
        console.error('Error fetching chapters:', error);
        Alert.alert(translations.error || 'Error', translations.failedToFetchChapters || 'Failed to fetch chapters');
      }
    };

    loadExistingChapters();
  }, [user.id]);

  const handleAddExistingChapter = async (chapter) => {
    try {
      const response = await createChapter({ ...chapter, planId, admin: user.id });
      if (response.status === 201) {
        Alert.alert(translations.success || 'Success', `${translations.chapter || 'Chapter'} ${translations.addedSuccessfully || 'added successfully'}`);
        navigation.navigate('ManageChapters', { plan: { _id: planId } });
      } else {
        Alert.alert(translations.error || 'Error', `${translations.failedToAdd || 'Failed to add'} ${translations.chapter || 'chapter'}`);
      }
    } catch (error) {
      console.error('Add Existing Chapter error:', error);
      Alert.alert(translations.error || 'Error', `${translations.failedToAdd || 'Failed to add'} ${translations.chapter || 'chapter'}`);
    }
  };

  const renderChapterItem = ({ item }) => (
    <View style={styles.chapterItem}>
      <Text style={styles.chapterText}>{item.title}</Text>
      <TouchableOpacity onPress={() => handleAddExistingChapter(item)}>
        <Icon name="plus" size={20} color="#000" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header />
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.navigate('ManageChapters', { plan: { _id: planId } })}
      >
        <Icon name="arrow-left" size={16} color="#fff" />
        <Text style={styles.backButtonText}>{translations.backToManageChapters || `Back to Manage ${translations.chapter || 'Chapter'}`}</Text>
      </TouchableOpacity>
      <Text style={styles.sectionTitle}>{translations.addExisting || 'Add Existing'} {translations.chapter}</Text>
      <FlatList
        data={existingChapters}
        keyExtractor={(item) => item._id}
        renderItem={renderChapterItem}
        contentContainerStyle={styles.chaptersList}
      />
    </View>
  );
};

export default AddExistingChapter;
