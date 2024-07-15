// EditTopic.jsx
import React, { useState, useContext, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { updateTopic } from '../../services/api';
import Header from '../General/Header';
import RichTextEditor from '../General/RichTextEditor';
import styles from '../General/styles';
import { TranslationContext } from '../../context/TranslationContext';

const EditTopic = ({ route, navigation }) => {
  const { topic } = route.params;
  const [title, setTitle] = useState(topic.title);
  const [content, setContent] = useState(topic.content);
  const { translations } = useContext(TranslationContext);
  const richTextEditor = useRef();

  const handleSaveChanges = async () => {
    try {
      const response = await updateTopic(topic._id, { title, content });
      if (response.status === 200) {
        Alert.alert('Success', `${translations.topic} updated successfully`);
        navigation.navigate('ManageTopics', { lesson: { _id: topic.lessonId } });
      } else {
        console.error('Update topic failed:', response.data);
        Alert.alert('Error', `Failed to update ${translations.topic.toLowerCase()}`);
      }
    } catch (error) {
      console.error('Update topic error:', error.response ? error.response.data : error.message);
      Alert.alert('Error', `Failed to update ${translations.topic.toLowerCase()}`);
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('ManageTopics', { lesson: { _id: topic.lessonId } })}>
        <Text style={styles.backButtonText}>Back to Manage {translations.topic}s</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Edit {translations.topic}</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder={`Enter ${translations.topic.toLowerCase()} title`}
      />
      <Text style={styles.label}>{translations.topic} Content:</Text>
      <RichTextEditor
        ref={richTextEditor}
        content={content}
        onContentChange={setContent}
      />
      <TouchableOpacity style={styles.button} onPress={handleSaveChanges}>
        <Text style={styles.buttonText}>Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EditTopic;
