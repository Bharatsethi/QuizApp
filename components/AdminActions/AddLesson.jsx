import React, { useState, useContext, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { createLesson } from '../../services/api';
import Header from '../General/Header';
import RichTextEditor from '../General/RichTextEditor';
import styles from '../General/styles';
import { TranslationContext } from '../../context/TranslationContext';

const AddLesson = ({ navigation, route }) => {
  const { chapterId } = route.params;
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { translations } = useContext(TranslationContext);
  const richText = useRef();

  const handleCreateLesson = async () => {
    try {
      const response = await createLesson({ chapterId, title, content });
      if (response.status === 201) {
        Alert.alert('Success', `${translations.lesson} created successfully`);
        navigation.goBack();
      } else {
        Alert.alert('Error', `Failed to create ${translations.lesson.toLowerCase()}`);
      }
    } catch (error) {
      console.error('Error creating lesson:', error);
      Alert.alert('Error', `Failed to create ${translations.lesson.toLowerCase()}`);
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Back to Manage {translations.lesson}</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Add {translations.lesson}</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder={`Enter ${translations.lesson.toLowerCase()} title`}
      />
      <Text style={styles.label}>{translations.lesson} Content:</Text>
      <RichTextEditor
        ref={richText}
        content={content}
        onContentChange={setContent}
      />
      <TouchableOpacity style={styles.button} onPress={handleCreateLesson}>
        <Text style={styles.buttonText}>Create {translations.lesson}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddLesson;
