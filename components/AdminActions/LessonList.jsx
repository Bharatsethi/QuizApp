import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import { fetchLessons } from '../../services/api';
import Header from '../General/Header';

const LessonList = ({ route, navigation }) => {
  const { chapterId } = route.params;
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    const getLessons = async () => {
      const response = await fetchLessons(chapterId);
      setLessons(response.data);
    };

    getLessons();
  }, [chapterId]);

  return (
    <View>
        <Header />
      {lessons.map((lesson) => (
        <View key={lesson._id}>
          <Text>{lesson.title}</Text>
          <Text>{lesson.content}</Text>
          <Button
            title="View Topics"
            onPress={() => navigation.navigate('TopicList', { lessonId: lesson._id })}
          />
        </View>
      ))}
    </View>
  );
};

export default LessonList;
