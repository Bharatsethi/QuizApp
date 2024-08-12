import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { fetchTopics } from '../../services/api';
import Header from '../General/Header';
import styles from '../General/styles';
import { TranslationContext } from '../../context/TranslationContext';

const ViewTopics = ({ route, navigation }) => {
  const { lessonId } = route.params;
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const { translations } = useContext(TranslationContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchTopics(lessonId);
        setTopics(response.data);
      } catch (error) {
        Alert.alert(translations.error, translations.failedToFetchTopics);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [lessonId, translations.error, translations.failedToFetchTopics]);

  const handleViewTopicContent = (topic) => {
    navigation.navigate('ViewTopicContent', { topicId: topic._id });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Header />
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>{translations.loading}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header />
      <FlatList
        data={topics}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleViewTopicContent(item)}>
            <View style={styles.topicItem}>
              <Text style={styles.topicText}>{item.title}</Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.contentContainer}
      />
      {topics.length === 0 && <Text style={styles.noItemsText}>{translations.noTopicsAvailable}</Text>}
    </View>
  );
};

export default ViewTopics;
