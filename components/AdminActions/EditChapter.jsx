import React, { useState, useContext, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { updateChapter } from '../../services/api';
import Header from '../General/Header';
import RichTextEditor from '../General/RichTextEditor';
import styles from '../General/styles';
import { TranslationContext } from '../../context/TranslationContext';
import { UserContext } from '../../context/UserContext';
import Icon from 'react-native-vector-icons/FontAwesome';

const EditChapter = ({ route, navigation }) => {
  const { chapter } = route.params;
  const [title, setTitle] = useState(chapter.title);
  const [introduction, setIntroduction] = useState(chapter.introduction);
  const [overview, setOverview] = useState(chapter.overview);
  const { translations } = useContext(TranslationContext);
  const { user } = useContext(UserContext);
  const richTextIntroduction = useRef();
  const richTextOverview = useRef();

  const handleSaveChanges = async () => {
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
      <Text style={styles.title}>{translations.edit || 'Edit'} {translations.chapter || 'Chapter'}</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder={`${translations.enter || 'Enter'} ${translations.chapter?.toLowerCase() || 'chapter'} ${translations.title || 'title'}`}
      />
      <Text style={styles.label}>{translations.chapter || 'Chapter'} {translations.introduction || 'Introduction'}:</Text>
      <RichTextEditor
        ref={richTextIntroduction}
        content={introduction}
        onContentChange={setIntroduction}
      />
      <Text style={styles.label}>{translations.chapter || 'Chapter'} {translations.overview || 'Overview'}:</Text>
      <RichTextEditor
        ref={richTextOverview}
        content={overview}
        onContentChange={setOverview}
      />
      <View style={styles.buttonContainer}>
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
