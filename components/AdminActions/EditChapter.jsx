import React, { useState, useContext, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { updateChapter } from '../../services/api';
import Header from '../General/Header';
import RichTextEditor from '../General/RichTextEditor';
import AdvancedRTF from '../General/AdvancedRTF'; // Corrected import path for AdvancedRTF component
import styles from '../General/styles';
import { TranslationContext } from '../../context/TranslationContext';
import { UserContext } from '../../context/UserContext';
import Icon from 'react-native-vector-icons/FontAwesome';

const EditChapter = ({ route, navigation }) => {
  const { chapter } = route.params;
  const [title, setTitle] = useState(chapter.title);
  const [introduction, setIntroduction] = useState(chapter.introduction);
  const [overview, setOverview] = useState(chapter.overview);
  const [useAdvancedEditor, setUseAdvancedEditor] = useState(false); // State to toggle between editors
  const { translations } = useContext(TranslationContext);
  const { user } = useContext(UserContext);
  const richTextIntroduction = useRef();
  const richTextOverview = useRef();

  const handleSaveChanges = async () => {
    if (!title || !introduction || !overview) {
      Alert.alert(translations.error || 'Error', 'All fields are required');
      return;
    }
    try {
      const response = await updateChapter(chapter._id, {
        title,
        introduction,
        overview,
        adminId: user.userId // Ensure adminId is included
      });
      if (response.status === 200) {
        Alert.alert(translations.success || 'Success', `${translations.chapter || 'Chapter'} ${translations.updatedSuccessfully || 'updated successfully'}`);
        navigation.navigate('ManageChapters', { plan: { _id: chapter.planId } });
      } else {
        Alert.alert(translations.error || 'Error', `${translations.failedToUpdate || 'Failed to update'} ${translations.chapter || 'chapter'}`);
      }
    } catch (error) {
      console.error('Update Chapter error:', error);
      Alert.alert(translations.error || 'Error', `${translations.failedToUpdate || 'Failed to update'} ${translations.chapter || 'chapter'}`);
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('ManageChapters', { plan: { _id: chapter.planId } })}>
        <Icon name="arrow-left" size={16} color="#fff" />
        <Text style={styles.backButtonText}>{translations.backToManage || 'Back to Manage'} {translations.chapter || 'Chapter'}</Text>
      </TouchableOpacity>
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <Text style={styles.title}>{translations.edit || 'Edit'} {translations.chapter || 'Chapter'}</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder={`${translations.enter || 'Enter'} ${translations.chapter?.toLowerCase() || 'chapter'} ${translations.title || 'title'}`}
        />
        <Text style={styles.label}>{translations.chapter || 'Chapter'} {translations.introduction || 'Introduction'}:</Text>
        <View style={styles.editorWrapper}>
          {useAdvancedEditor ? (
            <AdvancedRTF content={introduction} onContentChange={setIntroduction} />
          ) : (
            <RichTextEditor
              ref={richTextIntroduction}
              content={introduction}
              onContentChange={setIntroduction}
            />
          )}
        </View>
        <Text style={styles.label}>{translations.chapter || 'Chapter'} {translations.overview || 'Overview'}:</Text>
        <View style={styles.editorWrapper}>
          {useAdvancedEditor ? (
            <AdvancedRTF content={overview} onContentChange={setOverview} />
          ) : (
            <RichTextEditor
              ref={richTextOverview}
              content={overview}
              onContentChange={setOverview}
            />
          )}
        </View>
        <TouchableOpacity 
          style={[styles.toggleEditorButton, { marginVertical: 20 }]} 
          onPress={() => setUseAdvancedEditor(!useAdvancedEditor)}
        >
          <Text style={styles.buttonText}>{useAdvancedEditor ? 'Switch to Basic Editor' : 'Switch to Advanced Editor'}</Text>
        </TouchableOpacity>
      </ScrollView>
      <View style={styles.superButtonContainer}>
        <TouchableOpacity style={styles.primaryButton} onPress={handleSaveChanges}>
          <Text style={styles.buttonText}>{translations.saveChanges || 'Save Changes'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.navigate('ManageChapters', { plan: { _id: chapter.planId } })}>
          <Text style={styles.buttonText}>{translations.cancel || 'Cancel'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EditChapter;
