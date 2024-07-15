// EditChapter.jsx
import React, { useState, useContext, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { updateChapter } from '../../services/api';
import Header from '../General/Header';
import RichTextEditor from '../General/RichTextEditor';
import styles from '../General/styles';
import { TranslationContext } from '../../context/TranslationContext';

const EditChapter = ({ route, navigation }) => {
  const { chapter } = route.params;
  const [title, setTitle] = useState(chapter.title);
  const [introduction, setIntroduction] = useState(chapter.introduction);
  const [overview, setOverview] = useState(chapter.overview);
  const { translations } = useContext(TranslationContext);
  const richTextIntroduction = useRef();
  const richTextOverview = useRef();

  const handleSaveChanges = async () => {
    try {
      const response = await updateChapter(chapter._id, { title, introduction, overview });
      if (response.status === 200) {
        Alert.alert('Success', `${translations.chapter} updated successfully`);
        navigation.navigate('ManageChapters', { plan: { _id: chapter.planId } });
      } else {
        Alert.alert('Error', `Failed to update ${translations.chapter}`);
      }
    } catch (error) {
      console.error('Update Chapter error:', error);
      Alert.alert('Error', `Failed to update ${translations.chapter}`);
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('ManageChapters', { plan: { _id: chapter.planId } })}>
        <Text style={styles.backButtonText}>Back to Manage {translations.chapter}</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Edit {translations.chapter}</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder={`Enter ${translations.chapter.toLowerCase()} title`}
      />
      <Text style={styles.label}>{translations.chapter} Introduction:</Text>
      <RichTextEditor
        ref={richTextIntroduction}
        content={introduction}
        onContentChange={setIntroduction}
      />
      <Text style={styles.label}>{translations.chapter} Overview:</Text>
      <RichTextEditor
        ref={richTextOverview}
        content={overview}
        onContentChange={setOverview}
      />
      <TouchableOpacity style={styles.button} onPress={handleSaveChanges}>
        <Text style={styles.buttonText}>Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EditChapter;
