import React, { useState, useContext, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { createTopic } from '../../services/api';
import Header from '../General/Header';
import RichTextEditor from '../General/RichTextEditor';
import styles from '../General/styles';
import { TranslationContext } from '../../context/TranslationContext';

const AddTopic = ({ route, navigation }) => {
  const { lessonId } = route.params;
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { translations } = useContext(TranslationContext);
  const richTextEditor = useRef();

  const handleAddTopic = async () => {
    try {
      const response = await createTopic({ lessonId, title, content });
      if (response.status === 201) {
        Alert.alert('Success', `${translations.topic} added successfully`);
        navigation.navigate('ManageTopics', { lesson: { _id: lessonId } });
      } else {
        console.error('Add topic failed:', response.data);
        Alert.alert('Error', `Failed to add ${translations.topic.toLowerCase()}`);
      }
    } catch (error) {
      console.error('Add topic error:', error.response ? error.response.data : error.message);
      Alert.alert('Error', `Failed to add ${translations.topic.toLowerCase()}`);
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('ManageTopics', { lesson: { _id: lessonId } })}>
        <Text style={styles.backButtonText}>Back to Manage {translations.topic}s</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Add {translations.topic}</Text>
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
      <TouchableOpacity style={styles.button} onPress={handleAddTopic}>
        <Text style={styles.buttonText}>Add {translations.topic}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddTopic;
