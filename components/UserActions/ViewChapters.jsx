import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { fetchChapters } from '../../services/api';
import Header from '../General/Header';
import { TranslationContext } from '../../context/TranslationContext';
import styles from '../General/stylesOld';

const ViewChapters = ({ route, navigation }) => {
  const { planId } = route.params;
  const [chapters, setChapters] = useState([]);
  const { translations } = useContext(TranslationContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchChapters(planId);
        setChapters(response.data);
      } catch (error) {
        Alert.alert(translations.error, translations.failedToFetchChapters);
      }
    };

    fetchData();
  }, [planId, translations.error, translations.failedToFetchChapters]);

  const handleViewLessons = (chapterId) => {
    navigation.navigate('ViewLessons', { chapterId });
  };

  const renderChapterItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleViewLessons(item._id)}>
      <View style={styles.chapterItem}>
        <Text style={styles.chapterText}>{item.title}</Text>
        <Text style={styles.chapterDescription}>{item.introduction}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header />
      <FlatList
        data={chapters}
        keyExtractor={(item) => item._id}
        renderItem={renderChapterItem}
        contentContainerStyle={styles.contentContainer}
        ListEmptyComponent={<Text style={styles.noItemsText}>{translations.noChapters}</Text>}
      />
    </View>
  );
};

export default ViewChapters;
