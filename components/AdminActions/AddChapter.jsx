import React, { useState, useContext, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { createChapter } from '../../services/api';
import Header from '../General/Header';
import RichTextEditor from '../General/RichTextEditor';
import AdvancedRTF from '../General/AdvancedRTF';
import styles from '../General/styles';
//import buttonStyles from '../General/buttonStyles';
import { TranslationContext } from '../../context/TranslationContext';
import { UserContext } from '../../context/UserContext';
import Icon from 'react-native-vector-icons/FontAwesome';

const AddChapter = ({ route, navigation }) => {
  const { planId } = route.params;
  const [title, setTitle] = useState('');
  const [introduction, setIntroduction] = useState('');
  const [overview, setOverview] = useState('');
  const [useAdvancedEditor, setUseAdvancedEditor] = useState(false);
  const { translations } = useContext(TranslationContext);
  const { user } = useContext(UserContext);
  const richTextIntroduction = useRef();
  const richTextOverview = useRef();

  const handleAddChapter = async () => {
    if (!title || !introduction || !overview) {
      Alert.alert(translations.error || 'Error', 'All fields are required');
      return;
    }
    try {
      const response = await createChapter({ planId, title, introduction, overview, admin: user.userId });
      if (response.status === 201) {
        Alert.alert(translations.success || 'Success', `${translations.chapter || 'Chapter'} ${translations.addedSuccessfully || 'added successfully'}`);
        navigation.navigate('ManageChapters', { plan: { _id: planId } });
      } else {
        Alert.alert(translations.error || 'Error', `${translations.failedToAdd || 'Failed to add'} ${translations.chapter || 'chapter'}`);
      }
    } catch (error) {
      console.error('Add Chapter error:', error);
      Alert.alert(translations.error || 'Error', `${translations.failedToAdd || 'Failed to add'} ${translations.chapter || 'chapter'}`);
    }
  };

  const handleNavigateToExistingChapters = () => {
    navigation.navigate('AddExistingChapter', { planId });
  };

  return (
    <View style={styles.container}>
      <Header />
      <TouchableOpacity 
        style={buttonStyles.backButton} 
        onPress={() => navigation.navigate('ManageChapters', { plan: { _id: planId } })}
      >
        <Icon name="arrow-left" size={16} color="#fff" />
        <Text style={buttonStyles.backButtonText}>{translations.backToManageChapters || `Back to Manage ${translations.chapter || 'Chapter'}`}</Text>
      </TouchableOpacity>
      <ScrollView style={{ paddingBottom: 100 }}>
        <Text style={styles.title}>{translations.addChapter || `Add ${translations.chapter || 'Chapter'}`}</Text>
        <TouchableOpacity style={buttonStyles.addExistingButton} onPress={handleNavigateToExistingChapters}>
          <Icon name="search" size={16} color="#fff" />
          <Text style={buttonStyles.buttonText}>{translations.addExisting || 'Add Existing'} {translations.chapter}</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder={translations.enterChapterTitle || `Enter ${translations.chapter?.toLowerCase() || 'chapter'} title`}
        />
        <Text style={styles.label}>{translations.chapter} {translations.introduction || 'Introduction'}:</Text>
        {useAdvancedEditor ? (
          <AdvancedRTF content={introduction} onContentChange={setIntroduction} />
        ) : (
          <RichTextEditor
            ref={richTextIntroduction}
            content={introduction}
            onContentChange={setIntroduction}
          />
        )}
        <Text style={styles.label}>{translations.chapter} {translations.overview || 'Overview'}:</Text>
        {useAdvancedEditor ? (
          <AdvancedRTF content={overview} onContentChange={setOverview} />
        ) : (
          <RichTextEditor
            ref={richTextOverview}
            content={overview}
            onContentChange={setOverview}
          />
        )}
        <TouchableOpacity 
          style={buttonStyles.toggleEditorButton}
          onPress={() => setUseAdvancedEditor(!useAdvancedEditor)}
        >
          <Text style={buttonStyles.buttonText}>{useAdvancedEditor ? 'Switch to Basic Editor' : 'Switch to Advanced Editor'}</Text>
        </TouchableOpacity>
      </ScrollView>
      <View style={buttonStyles.superbuttonContainer}>
        <TouchableOpacity style={buttonStyles.primaryButton} onPress={handleAddChapter}>
          <Text style={buttonStyles.buttonText}>{translations.add || 'Add'} {translations.chapter}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={buttonStyles.cancelButton} onPress={() => navigation.goBack()}>
          <Text style={buttonStyles.buttonText}>{translations.cancel || 'Cancel'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AddChapter;
