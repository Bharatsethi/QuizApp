import React, { useState, useContext, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { createTopic } from '../../services/api';
import Header from '../General/Header';
import RichTextEditor from '../General/RichTextEditor';
import AdvancedRTF from '../General/AdvancedRTF'; // Import the new AdvancedRTF component
import styles from '../General/styles';
import buttonStyles from '../General/buttonStyles';
import { TranslationContext } from '../../context/TranslationContext';
import { UserContext } from '../../context/UserContext';
import Icon from 'react-native-vector-icons/FontAwesome';

const AddTopic = ({ route, navigation }) => {
  const { lessonId } = route.params;
  const { user } = useContext(UserContext);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [useAdvancedEditor, setUseAdvancedEditor] = useState(false); // State to toggle between editors
  const { translations } = useContext(TranslationContext);
  const richTextEditor = useRef();

  const handleAddTopic = async () => {
    try {
      const adminId = user?.userId;
      if (!adminId) {
        Alert.alert(translations.error || 'Error', 'Admin ID is missing');
        return;
      }
      const response = await createTopic({ lessonId, title, content, adminId });
      if (response.status === 201) {
        Alert.alert(translations.success || 'Success', `${translations.topic || 'Topic'} ${translations.addedSuccessfully || 'added successfully'}`);
        navigation.navigate('ManageTopics', { lesson: { _id: lessonId } });
      } else {
        console.error('Add topic failed:', response.data);
        Alert.alert(translations.error || 'Error', `${translations.failedToAdd || 'Failed to add'} ${translations.topic.toLowerCase() || 'topic'}`);
      }
    } catch (error) {
      console.error('Add topic error:', error.response ? error.response.data : error.message);
      Alert.alert(translations.error || 'Error', `${translations.failedToAdd || 'Failed to add'} ${translations.topic.toLowerCase() || 'topic'}`);
    }
  };

  const handleNavigateToExistingTopics = () => {
    navigation.navigate('AddExistingTopic', { lessonId });
  };

  return (
    <View style={styles.container}>
      <Header />
      <TouchableOpacity style={buttonStyles.backButton} onPress={() => navigation.navigate('ManageTopics', { lesson: { _id: lessonId } })}>
        <Icon name="arrow-left" size={16} color="#fff" />
        <Text style={buttonStyles.backButtonText}>{translations.backToManage || 'Back to Manage'} {translations.topic || 'Topic'}s</Text>
      </TouchableOpacity>
      <ScrollView style={{ paddingBottom: 100 }}>
        <Text style={styles.title}>{translations.add || 'Add'} {translations.topic || 'Topic'}</Text>
        <TouchableOpacity style={buttonStyles.addExistingButton} onPress={handleNavigateToExistingTopics}>
          <Icon name="search" size={16} color="#fff" />
          <Text style={buttonStyles.buttonText}>{translations.addExisting || 'Add Existing'} {translations.topic}</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder={`${translations.enter || 'Enter'} ${translations.topic.toLowerCase() || 'topic'} ${translations.title || 'title'}`}
        />
        <Text style={styles.label}>{translations.topic || 'Topic'} {translations.content || 'Content'}:</Text>
        {useAdvancedEditor ? (
          <AdvancedRTF content={content} onContentChange={setContent} />
        ) : (
          <RichTextEditor
            ref={richTextEditor}
            content={content}
            onContentChange={setContent}
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
        <TouchableOpacity style={buttonStyles.primaryButton} onPress={handleAddTopic}>
          <Text style={buttonStyles.buttonText}>{translations.add || 'Add'} {translations.topic || 'Topic'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={buttonStyles.cancelButton} onPress={() => navigation.navigate('ManageTopics', { lesson: { _id: lessonId } })}>
          <Text style={buttonStyles.buttonText}>{translations.cancel || 'Cancel'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AddTopic;
