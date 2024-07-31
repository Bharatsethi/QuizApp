// ChapterList.jsx
import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TouchableOpacity, Alert, FlatList } from 'react-native';
import { fetchChapters } from '../../services/api';
import Header from '../General/Header';
import styles from '../General/stylesOld';
import { TranslationContext } from '../../context/TranslationContext';

const ChapterList = ({ route, navigation }) => {
  const { planId } = route.params;
  const [chapters, setChapters] = useState([]);
  const { translations } = useContext(TranslationContext);

  useEffect(() => {
    const getChapters = async () => {
      try {
        const response = await fetchChapters(planId);
        setChapters(response.data);
      } catch (error) {
        console.error('Failed to fetch chapters:', error);
        Alert.alert(translations.error || 'Error', translations.failedToFetchChapters || `Failed to fetch ${translations.chapter.toLowerCase()}s`);
      }
    };

    getChapters();
  }, [planId, translations]);

  const renderChapterItem = ({ item }) => (
    <View key={item._id} style={styles.chapterItem}>
      <Text style={styles.chapterTitle}>{item.title}</Text>
      <Text style={styles.chapterText}>{item.introduction}</Text>
      <Text style={styles.chapterText}>{item.overview}</Text>
      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => navigation.navigate('LessonList', { chapterId: item._id })}
      >
        <Text style={styles.buttonText}>View {translations.lessons}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header />
      <FlatList
        data={chapters}
        keyExtractor={(item) => item._id}
        renderItem={renderChapterItem}
        contentContainerStyle={styles.contentContainer}
        ListEmptyComponent={<Text style={styles.emptyListText}>{translations.noChapters || 'No chapters available'}</Text>}
      />
    </View>
  );
};

export default ChapterList;
