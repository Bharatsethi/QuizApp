import React, { useState, useContext, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { createChapter } from '../../services/api';
import Header from '../General/Header';
import RichTextEditor from '../General/RichTextEditor';
import AdvancedRTF from '../General/AdvancedRTF';
import styles from '../General/styles';
import { TranslationContext } from '../../context/TranslationContext';
import { UserContext } from '../../context/UserContext';
import Icon from 'react-native-vector-icons/FontAwesome';

const AddChapter = ({ route, navigation }) => {
  const { planId } = route.params;
  const [title, setTitle] = useState('');
  const [introduction, setIntroduction] = useState('');
  const [overview, setOverview] = useState('');
  const [useAdvancedEditor, setUseAdvancedEditor] = useState(false);
  const [loading, setLoading] = useState(false); // New loading state
  const { translations } = useContext(TranslationContext);
  const { user } = useContext(UserContext);
  const richTextIntroduction = useRef();
  const richTextOverview = useRef();

  const handleAddChapter = async () => {
    if (!title || !introduction || !overview) {
      Alert.alert(translations.error || 'Error', translations.allFieldsRequired || 'All fields are required');
      return;
    }

    setLoading(true); // Start loading

    try {
      const response = await createChapter({ planId, title, introduction, overview, admin: user.userId });
      if (response.status === 201) {
        Alert.alert(translations.success || 'Success', `${translations.chapter || 'Chapter'} ${translations.addedSuccessfully || 'added successfully'}`);
        navigation.goBack();
      } else {
        Alert.alert(translations.error || 'Error', `${translations.failedToAdd || 'Failed to add'} ${translations.chapter || 'chapter'}`);
      }
    } catch (error) {
      console.error('Add Chapter error:', error);
      Alert.alert(translations.error || 'Error', error.response?.data?.message || `${translations.failedToAdd || 'Failed to add'} ${translations.chapter || 'chapter'}`);
    } finally {
      setLoading(false); // End loading
    }
  };

  const handleNavigateToExistingChapters = () => {
    navigation.navigate('AddExistingChapter', { planId });
  };

  return (
    <View style={styles.container}>
      <Header />
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.goBack()}
      >
        <Icon name="arrow-left" size={16} color="#fff" />
        <Text style={styles.backButtonText}>{translations.backToManageChapters || `Back to Manage ${translations.chapter || 'Chapter'}`}</Text>
      </TouchableOpacity>
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>{translations.addChapter || `Add ${translations.chapter || 'Chapter'}`}</Text>
        <TouchableOpacity style={styles.addExistingButton} onPress={handleNavigateToExistingChapters}>
          <Icon name="search" size={16} color="#fff" />
          <Text style={styles.buttonText}>{translations.addExisting || 'Add Existing'} {translations.chapter}</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder={translations.enterChapterTitle || `Enter ${translations.chapter?.toLowerCase() || 'chapter'} title`}
        />
        <Text style={styles.label}>{translations.chapter} {translations.introduction || 'Introduction'}:</Text>
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
        <Text style={styles.label}>{translations.chapter} {translations.overview || 'Overview'}:</Text>
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
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <>
            <TouchableOpacity style={styles.primaryButton} onPress={handleAddChapter}>
              <Text style={styles.buttonText}>{translations.add || 'Add'} {translations.chapter}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
              <Text style={styles.buttonText}>{translations.cancel || 'Cancel'}</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

export default AddChapter;
