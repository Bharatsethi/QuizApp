import React, { useState, useContext, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { createLesson } from '../../services/api';
import Header from '../General/Header';
import RichTextEditor from '../General/RichTextEditor';
import styles from '../General/styles';
import { TranslationContext } from '../../context/TranslationContext';
import { UserContext } from '../../context/UserContext';  // Import UserContext
import Icon from 'react-native-vector-icons/FontAwesome';

const AddLesson = ({ navigation, route }) => {
  const { chapterId } = route.params;
  const { user } = useContext(UserContext); // Get the user context
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { translations } = useContext(TranslationContext);
  const richText = useRef();

  const handleCreateLesson = async () => {
    try {
      const adminId = user?.userId; // Get the adminId from the user context
      if (!adminId) {
        Alert.alert(translations.error || 'Error', 'Admin ID is missing');
        return;
      }
      const response = await createLesson({ chapterId, title, content, adminId }); // Include adminId in the request
      if (response.status === 201) {
        Alert.alert(translations.success || 'Success', `${translations.lesson || 'Lesson'} ${translations.createdSuccessfully || 'created successfully'}`);
        navigation.goBack();
      } else {
        Alert.alert(translations.error || 'Error', `${translations.failedToCreate || 'Failed to create'} ${translations.lesson || 'lesson'}`);
      }
    } catch (error) {
      console.error('Error creating lesson:', error);
      Alert.alert(translations.error || 'Error', `${translations.failedToCreate || 'Failed to create'} ${translations.lesson || 'lesson'}`);
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={16} color="#fff" />
        <Text style={styles.backButtonText}>{translations.backToManage || 'Back to Manage'} {translations.lessons || 'Lessons'}</Text>
      </TouchableOpacity>
      <Text style={styles.title}>{translations.add || 'Add'} {translations.lesson || 'Lesson'}</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder={`${translations.enter || 'Enter'} ${translations.lesson || 'lesson'} ${translations.title || 'title'}`}
      />
      <Text style={styles.label}>{translations.lesson || 'Lesson'} {translations.content || 'Content'}:</Text>
      <RichTextEditor
        ref={richText}
        content={content}
        onContentChange={setContent}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.primaryButton} onPress={handleCreateLesson}>
          <Text style={styles.buttonText}>{translations.create || 'Create'} {translations.lesson || 'Lesson'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>{translations.cancel || 'Cancel'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AddLesson;
