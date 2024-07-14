import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import { fetchChapters } from '../../services/api';
import Header from '../General/Header';

const ChapterList = ({ route, navigation }) => {
  const { planId } = route.params;
  const [chapters, setChapters] = useState([]);

  useEffect(() => {
    const getChapters = async () => {
      const response = await fetchChapters(planId);
      setChapters(response.data);
    };

    getChapters();
  }, [planId]);

  return (
    <View>
        <Header />
      {chapters.map((chapter) => (
        <View key={chapter._id}>
          <Text>{chapter.title}</Text>
          <Text>{chapter.introduction}</Text>
          <Text>{chapter.overview}</Text>
          <Button
            title="View Lessons"
            onPress={() => navigation.navigate('LessonList', { chapterId: chapter._id })}
          />
        </View>
      ))}
    </View>
  );
};

export default ChapterList;
