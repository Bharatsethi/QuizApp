import React, { useState, useContext, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { createTopic } from '../../services/api';
import Header from '../General/Header';
import RichTextEditor from '../General/RichTextEditor';
import styles from '../General/styles';
import { TranslationContext } from '../../context/TranslationContext';
import { UserContext } from '../../context/UserContext'; // Import UserContext
import Icon from 'react-native-vector-icons/FontAwesome';

const AddTopic = ({ route, navigation }) => {
  const { lessonId } = route.params;
  const { user } = useContext(UserContext); // Get the user context
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { translations } = useContext(TranslationContext);
  const richTextEditor = useRef();

  const handleAddTopic = async () => {
    try {
      const adminId = user?.userId; // Get the adminId from the user context
      if (!adminId) {
        Alert.alert(translations.error || 'Error', 'Admin ID is missing');
        return;
      }
      const response = await createTopic({ lessonId, title, content, adminId }); // Include adminId in the request
      if (response.status === 201) {
        Alert.alert(translations.success || 'Success', `${translations.topic || 'Topic'} ${translations.addedSuccessfully || 'added successfully'}`);
        navigation.navigate('ManageTopics', { lesson: { _id: lessonId } });
      } else {
        console.error('Add topic failed:', response.data);
        Alert.alert(translations.error || 'Error', `${translations.failedToAdd || 'Failed to add'} ${translations.topic.toLowerCase() || 'topic'}`);
      }
    } catch (error) {
      console.error('Add topic error:', error.response ? error.response.data : error.message);
      Alert.alert(translations.error || 'Error', `${translations.failedToAdd || 'Failed to add'} ${translations.topic.toLowerCase() || 'topic'}`);
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('ManageTopics', { lesson: { _id: lessonId } })}>
        <Icon name="arrow-left" size={16} color="#fff" />
        <Text style={styles.backButtonText}>{translations.backToManage || 'Back to Manage'} {translations.topic || 'Topic'}s</Text>
      </TouchableOpacity>
      <Text style={styles.title}>{translations.add || 'Add'} {translations.topic || 'Topic'}</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder={`${translations.enter || 'Enter'} ${translations.topic.toLowerCase() || 'topic'} ${translations.title || 'title'}`}
      />
      <Text style={styles.label}>{translations.topic || 'Topic'} {translations.content || 'Content'}:</Text>
      <RichTextEditor
        ref={richTextEditor}
        content={content}
        onContentChange={setContent}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.primaryButton} onPress={handleAddTopic}>
          <Text style={styles.buttonText}>{translations.add || 'Add'} {translations.topic || 'Topic'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.navigate('ManageTopics', { lesson: { _id: lessonId } })}>
          <Text style={styles.buttonText}>{translations.cancel || 'Cancel'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AddTopic;
