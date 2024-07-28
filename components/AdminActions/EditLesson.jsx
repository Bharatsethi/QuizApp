// components/AdminActions/EditLesson.jsx
import React, { useState, useContext, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { updateLesson } from '../../services/api';
import Header from '../General/Header';
import RichTextEditor from '../General/RichTextEditor';
import AdvancedRTF from '../General/AdvancedRTF'; // Import the new AdvancedRTF component
import styles from '../General/styles';
import { TranslationContext } from '../../context/TranslationContext';
import { UserContext } from '../../context/UserContext';
import Icon from 'react-native-vector-icons/FontAwesome';

const EditLesson = ({ route, navigation }) => {
  const { lesson } = route.params;
  const { user } = useContext(UserContext);
  const [title, setTitle] = useState(lesson.title);
  const [content, setContent] = useState(lesson.content);
  const [useAdvancedEditor, setUseAdvancedEditor] = useState(false); // State to toggle between editors
  const { translations } = useContext(TranslationContext);
  const richText = useRef();

  const handleSaveChanges = async () => {
    try {
      const adminId = user?.userId;
      if (!adminId) {
        Alert.alert(translations.error || 'Error', 'Admin ID is missing');
        return;
      }
      const response = await updateLesson(lesson._id, { title, content, adminId });
      if (response.status === 200) {
        Alert.alert(translations.success || 'Success', `${translations.lesson || 'Lesson'} ${translations.updatedSuccessfully || 'updated successfully'}`);
        navigation.goBack();
      } else {
        Alert.alert(translations.error || 'Error', `${translations.failedToUpdate || 'Failed to update'} ${translations.lesson?.toLowerCase() || 'lesson'}`);
      }
    } catch (error) {
      console.error('Error updating lesson:', error);
      Alert.alert(translations.error || 'Error', `${translations.failedToUpdate || 'Failed to update'} ${translations.lesson?.toLowerCase() || 'lesson'}`);
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={16} color="#fff" />
        <Text style={styles.backButtonText}>{translations.backToDashboard || 'Back to Dashboard'}</Text>
      </TouchableOpacity>
      <Text style={styles.title}>{translations.edit || 'Edit'} {translations.lesson || 'Lesson'}</Text>
      <Text style={styles.label}>{translations.lesson || 'Lesson'} {translations.title || 'Title'}:</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder={`${translations.enter || 'Enter'} ${translations.lesson?.toLowerCase() || 'lesson'} ${translations.title?.toLowerCase() || 'title'}`}
      />
      <Text style={styles.label}>{translations.lesson || 'Lesson'} {translations.content || 'Content'}:</Text>
      {useAdvancedEditor ? (
        <AdvancedRTF content={content} onContentChange={setContent} />
      ) : (
        <RichTextEditor
          ref={richText}
          content={content}
          onContentChange={setContent}
        />
      )}
      <TouchableOpacity 
        style={styles.toggleEditorButton}
        onPress={() => setUseAdvancedEditor(!useAdvancedEditor)}
      >
        <Text style={styles.buttonText}>{useAdvancedEditor ? 'Switch to Basic Editor' : 'Switch to Advanced Editor'}</Text>
      </TouchableOpacity>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.primaryButton} onPress={handleSaveChanges}>
          <Text style={styles.buttonText}>{translations.saveChanges || 'Save Changes'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>{translations.cancel || 'Cancel'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EditLesson;
