// ManageChapters.jsx
import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { fetchChapters, deleteChapter } from '../../services/api';
import Header from '../General/Header';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from '../General/styles';
import { TranslationContext } from '../../context/TranslationContext';

const ManageChapters = ({ route, navigation }) => {
  const { plan } = route.params || {};
  const [chapters, setChapters] = useState([]);
  const { translations } = useContext(TranslationContext);

  useEffect(() => {
    if (plan && plan._id) {
      const fetchData = async () => {
        const response = await fetchChapters(plan._id);
        setChapters(response.data);
      };
      fetchData();
    } else {
      Alert.alert('Error', 'Plan information is missing');
      navigation.goBack();
    }
  }, [plan, navigation]);

  const handleAddChapter = () => {
    navigation.navigate('AddChapter', { planId: plan._id });
  };

  const handleEditChapter = (chapter) => {
    navigation.navigate('EditChapter', { chapter });
  };

  const handleDeleteChapter = async (chapterId) => {
    try {
      await deleteChapter(chapterId);
      setChapters(chapters.filter(chapter => chapter._id !== chapterId));
      Alert.alert('Success', `${translations.chapter} deleted successfully`);
    } catch (error) {
      Alert.alert('Error', `Failed to delete ${translations.chapter.toLowerCase()}`);
    }
  };

  const handleManageLessons = (chapter) => {
    navigation.navigate('ManageLessons', { chapter });
  };

  return (
    <View style={styles.container}>
      <Header />
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('ManagePlans')}>
        <Icon name="arrow-left" size={16} color="#fff" />
        <Text style={styles.backButtonText}>Back to {translations.plan}s</Text>
      </TouchableOpacity>
      {plan && <Text style={styles.sectionTitle}>Manage {translations.chapter}s for {plan.title}</Text>}
      <TouchableOpacity style={styles.addButton} onPress={handleAddChapter}>
        <Icon name="plus" size={16} color="#fff" style={styles.addButtonIcon} />
        <Text style={styles.addButtonText}>Add {translations.chapter}</Text>
      </TouchableOpacity>
      <FlatList
        data={chapters}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.planItem}>
            <Text style={styles.planText}>{item.title}</Text>
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
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default ManageChapters;
