import React, { useState, useContext, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { createLesson } from '../../services/api';
import Header from '../General/Header';
import RichTextEditor from '../General/RichTextEditor';
import AdvancedRTF from '../General/AdvancedRTFold'; // Import the new AdvancedRTF component
import styles from '../General/styles';
//import buttonStyles from '../General/buttonStyles';
import { TranslationContext } from '../../context/TranslationContext';
import { UserContext } from '../../context/UserContext';
import Icon from 'react-native-vector-icons/FontAwesome';

const AddLesson = ({ navigation, route }) => {
  const { chapterId } = route.params;
  const { user } = useContext(UserContext);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [useAdvancedEditor, setUseAdvancedEditor] = useState(false); // State to toggle between editors
  const { translations } = useContext(TranslationContext);
  const richText = useRef();

  const handleCreateLesson = async () => {
    try {
      const adminId = user?.userId;
      if (!adminId) {
        Alert.alert(translations.error || 'Error', 'Admin ID is missing');
        return;
      }
      const response = await createLesson({ chapterId, title, content, adminId });
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

  const handleNavigateToExistingLessons = () => {
    navigation.navigate('AddExistingLesson', { chapterId });
  };

  return (
    <View style={styles.container}>
      <Header />
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={16} color="#fff" />
        <Text style={styles.backButtonText}>{translations.backToManage || 'Back to Manage'} {translations.lessons || 'Lessons'}</Text>
      </TouchableOpacity>
      <ScrollView style={{ paddingBottom: 100 }}>
        <Text style={styles.title}>{translations.add || 'Add'} {translations.lesson || 'Lesson'}</Text>
        <TouchableOpacity style={styles.addExistingButton} onPress={handleNavigateToExistingLessons}>
          <Icon name="search" size={16} color="#fff" />
          <Text style={styles.buttonText}>{translations.addExisting || 'Add Existing'} {translations.lesson}</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder={`${translations.enter || 'Enter'} ${translations.lesson || 'lesson'} ${translations.title || 'title'}`}
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
      </ScrollView>
      <View style={styles.superbuttonContainer}>
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
