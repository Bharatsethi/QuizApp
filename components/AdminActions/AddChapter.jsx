// AddChapter.jsx
import React, { useState, useContext, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { createChapter } from '../../services/api';
import Header from '../General/Header';
import RichTextEditor from '../General/RichTextEditor';
import styles from '../General/styles';
import { TranslationContext } from '../../context/TranslationContext';

const AddChapter = ({ route, navigation }) => {
  const { planId } = route.params;
  const [title, setTitle] = useState('');
  const [introduction, setIntroduction] = useState('');
  const [overview, setOverview] = useState('');
  const { translations } = useContext(TranslationContext);
  const richTextIntroduction = useRef();
  const richTextOverview = useRef();

  const handleAddChapter = async () => {
    try {
      const response = await createChapter({ planId, title, introduction, overview });
      if (response.status === 201) {
        Alert.alert('Success', `${translations.chapter} added successfully`);
        navigation.navigate('ManageChapters', { plan: { _id: planId } });
      } else {
        Alert.alert('Error', `Failed to add ${translations.chapter}`);
      }
    } catch (error) {
      console.error('Add Chapter error:', error);
      Alert.alert('Error', `Failed to add ${translations.chapter}`);
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('ManageChapters', { plan: { _id: planId } })}>
        <Text style={styles.backButtonText}>Back to Manage {translations.chapter}</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Add {translations.chapter}</Text>
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
      <TouchableOpacity style={styles.button} onPress={handleAddChapter}>
        <Text style={styles.buttonText}>Add {translations.chapter}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddChapter;
