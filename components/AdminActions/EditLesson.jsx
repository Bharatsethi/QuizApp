// components/AdminActions/EditLesson.jsx
import React, { useState, useContext, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { updateLesson } from '../../services/api';
import Header from '../General/Header';
import RichTextEditor from '../General/RichTextEditor';
import styles from '../General/styles';
import { TranslationContext } from '../../context/TranslationContext';

const EditLesson = ({ route, navigation }) => {
  const { lesson } = route.params;
  const [title, setTitle] = useState(lesson.title);
  const [content, setContent] = useState(lesson.content);
  const { translations } = useContext(TranslationContext);
  const richText = useRef();

  const handleSaveChanges = async () => {
    try {
      await updateLesson(lesson._id, { title, content });
      Alert.alert('Success', `${translations.lesson} updated successfully`);
      navigation.goBack();
    } catch (error) {
      console.error('Error updating lesson:', error);
      Alert.alert('Error', `Failed to update ${translations.lesson.toLowerCase()}`);
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      <Text style={styles.label}>{translations.lesson} Title:</Text>
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
      <TouchableOpacity style={styles.button} onPress={handleSaveChanges}>
        <Text style={styles.buttonText}>Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EditLesson;
