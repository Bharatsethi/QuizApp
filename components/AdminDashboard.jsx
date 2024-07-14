import React from 'react';
import { View, Button } from 'react-native';
import Header from './Header';

const AdminDashboard = ({ navigation }) => {
  return (
    <View>
        <Header />
      <Button title="Manage Plans" onPress={() => navigation.navigate('ManagePlans')} />
      <Button title="Manage Chapters" onPress={() => navigation.navigate('ManageChapters')} />
      <Button title="Manage Lessons" onPress={() => navigation.navigate('ManageLessons')} />
      <Button title="Manage Topics" onPress={() => navigation.navigate('ManageTopics')} />
      <Button title="Manage Quizzes" onPress={() => navigation.navigate('ManageQuizzes')} />
    </View>
  );
};

export default AdminDashboard;
