import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { fetchTopics } from '../../services/api';
import Header from '../General/Header';
import styles from '../General/styles';
import { TranslationContext } from '../../context/TranslationContext';

const TopicList = ({ route, navigation }) => {
  const { lessonId } = route.params;
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const { translations } = useContext(TranslationContext);

  useEffect(() => {
    const getTopics = async () => {
      try {
        const response = await fetchTopics(lessonId);
        setTopics(response.data);
      } catch (error) {
        Alert.alert(
          translations.error || 'Error',
          `${translations.failedToLoad || 'Failed to load'} ${translations.topic?.toLowerCase() || 'topics'}`,
          [
            {
              text: translations.retry || 'Retry',
              onPress: getTopics,
            },
            { text: translations.cancel || 'Cancel', style: 'cancel' },
          ]
        );
      } finally {
        setLoading(false);
      }
    };

    getTopics();
  }, [lessonId, translations]);

  const renderTopicItem = ({ item }) => (
    <TouchableOpacity
      style={styles.planItem}
      onPress={() => navigation.navigate('TopicDetails', { topicId: item._id })}
    >
      <Text style={styles.planText}>{item.title}</Text>
      <Text style={styles.chapterText}>{item.content}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Header />
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>{translations.loading || 'Loading...'}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header />
      {topics.length === 0 ? (
        <Text style={styles.noPlansText}>{translations.noTopicsAvailable || 'No topics available.'}</Text>
      ) : (
        <FlatList
          data={topics}
          keyExtractor={(item) => item._id}
          renderItem={renderTopicItem}
          contentContainerStyle={styles.plansList}
        />
      )}
    </View>
  );
};

export default TopicList;
