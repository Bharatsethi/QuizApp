import React, { useState, useContext, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { updateTopic } from '../../services/api';
import Header from '../General/Header';
import RichTextEditor from '../General/RichTextEditor';
import AdvancedRTF from '../General/AdvancedRTF'; // Import the new AdvancedRTF component
import styles from '../General/styles';
import { TranslationContext } from '../../context/TranslationContext';
import { UserContext } from '../../context/UserContext';
import Icon from 'react-native-vector-icons/FontAwesome';

const EditTopic = ({ route, navigation }) => {
  const { topic } = route.params;
  const [title, setTitle] = useState(topic.title);
  const [content, setContent] = useState(topic.content);
  const [useAdvancedEditor, setUseAdvancedEditor] = useState(false); // State to toggle between editors
  const [loading, setLoading] = useState(false); // Loading state
  const { translations } = useContext(TranslationContext);
  const { user } = useContext(UserContext);
  const richTextEditor = useRef();

  const handleSaveChanges = async () => {
    if (!title.trim()) {
      Alert.alert(translations.error || 'Error', translations.titleCannotBeEmpty || 'Title cannot be empty.');
      return;
    }

    setLoading(true);
    try {
      const response = await updateTopic(topic._id, { title, content, adminId: user.userId });
      if (response.status === 200) {
        Alert.alert(translations.success || 'Success', `${translations.topic} ${translations.updatedSuccessfully || 'updated successfully'}`);
        navigation.navigate('ManageTopics', { lesson: { _id: topic.lessonId } });
      } else {
        throw new Error('Failed to update topic');
      }
    } catch (error) {
      console.error('Update topic failed:', error.response ? error.response.data : error.message);
      Alert.alert(translations.error || 'Error', `${translations.failedToUpdate || 'Failed to update'} ${translations.topic.toLowerCase()}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('ManageTopics', { lesson: { _id: topic.lessonId } })}>
        <Icon name="arrow-left" size={16} color="#fff" />
        <Text style={styles.backButtonText}>{translations.backToManage || 'Back to Manage'} {translations.topic || 'Topics'}</Text>
      </TouchableOpacity>
      <ScrollView style={{ paddingBottom: 100 }}>
        <Text style={styles.title}>{translations.edit || 'Edit'} {translations.topic}</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder={`${translations.enter || 'Enter'} ${translations.topic?.toLowerCase() || 'topic'} ${translations.title?.toLowerCase() || 'title'}`}
        />
        <Text style={styles.label}>{translations.topic} {translations.content || 'Content'}:</Text>
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
          style={styles.toggleEditorButton}
          onPress={() => setUseAdvancedEditor(!useAdvancedEditor)}
        >
          <Text style={styles.buttonText}>{useAdvancedEditor ? 'Switch to Basic Editor' : 'Switch to Advanced Editor'}</Text>
        </TouchableOpacity>
      </ScrollView>
      <View style={styles.superbuttonContainer}>
        <TouchableOpacity style={styles.primaryButton} onPress={handleSaveChanges} disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>{translations.saveChanges || 'Save Changes'}</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.navigate('ManageTopics', { lesson: { _id: topic.lessonId } })}>
          <Text style={styles.buttonText}>{translations.cancel || 'Cancel'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EditTopic;
