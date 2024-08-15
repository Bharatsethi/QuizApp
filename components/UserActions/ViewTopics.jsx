import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { fetchQuizzesByTopicId } from '../../services/api';
import Header from '../General/Header';
import { TranslationContext } from '../../context/TranslationContext';
import { UserContext } from '../../context/UserContext';
import styles from '../General/styles';
import Icon from 'react-native-vector-icons/FontAwesome';

const ViewTopics = ({ route, navigation }) => {
  const { topicId } = route.params;
  const [quizzes, setQuizzes] = useState([]);
  const [content, setContent] = useState('');
  const { translations } = useContext(TranslationContext);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchQuizzesByTopicId(topicId);
        setQuizzes(response.data.quizzes);
        setContent(response.data.content);
      } catch (error) {
        Alert.alert(translations.error, translations.failedToFetchQuizzes);
      }
    };

    fetchData();
  }, [topicId, translations.error, translations.failedToFetchQuizzes]);

  const renderQuizItem = ({ item }) => (
    <TouchableOpacity
      style={styles.quizItem}
      onPress={() => navigation.navigate('ViewQuiz', { quizId: item._id })}
    >
      <Text style={styles.quizText}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={16} color="#fff" />
          <Text style={styles.backButtonText}>
            {translations.backToPrevious || 'Back'}
          </Text>
        </TouchableOpacity>
        <Text style={styles.title}>
          {translations.topicDetails || 'Topic Details'}
        </Text>
        <Text style={styles.contentText}>{content}</Text>

        <Text style={styles.subheading}>
          {translations.linkedQuizzes || 'Linked Quizzes'}
        </Text>
        {quizzes.length === 0 ? (
          <Text style={styles.noQuizzesText}>
            {translations.noQuizzesAvailable || 'No quizzes available for this topic.'}
          </Text>
        ) : (
          <FlatList
            data={quizzes}
            keyExtractor={(item) => item._id}
            renderItem={renderQuizItem}
            contentContainerStyle={styles.contentContainer}
          />
        )}
      </ScrollView>
    </View>
  );
};

export default ViewTopics;
