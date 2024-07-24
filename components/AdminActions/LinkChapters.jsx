import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
import { fetchAllChapters, linkChapterToPlan } from '../../services/api';
import Header from '../General/Header';
import Icon from 'react-native-vector-icons/FontAwesome';
import { TranslationContext } from '../../context/TranslationContext';
import { UserContext } from '../../context/UserContext';
import styles from '../General/styles';

const LinkChapters = ({ route, navigation }) => {
  const { plan } = route.params;
  const [chapters, setChapters] = useState([]);
  const { translations } = useContext(TranslationContext);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchAllChapters(user.userId);
        setChapters(response.data);
      } catch (error) {
        console.error('Failed to fetch chapters:', error);
        Alert.alert(translations.error || 'Error', translations.failedToFetchChapters || 'Failed to fetch chapters. Please try again later.');
      }
    };
    fetchData();
  }, [translations, user.userId]);

  const handleLinkChapter = async (chapterId) => {
    try {
      await linkChapterToPlan(plan._id, chapterId);
      Alert.alert(translations.success || 'Success', translations.chapterLinked || 'Chapter linked successfully');
    } catch (error) {
      console.error('Failed to link chapter:', error);
      Alert.alert(translations.error || 'Error', translations.failedToLinkChapter || 'Failed to link chapter');
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={16} color="#fff" />
        <Text style={styles.backButtonText}>{translations.backToPlans || 'Back to Plans'}</Text>
      </TouchableOpacity>
      <Text style={styles.sectionTitle}>{translations.linkChapters || 'Link Chapters'}</Text>
      <FlatList
        data={chapters}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.chapterItem}>
            <Text style={styles.chapterText}>{item.title}</Text>
            <TouchableOpacity onPress={() => handleLinkChapter(item._id)}>
              <Icon name="link" size={20} color="#000" style={styles.icon} />
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={styles.chaptersList}
      />
    </View>
  );
};

export default LinkChapters;
