import React, { useState, useContext, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { updateTopic } from '../../services/api';
import Header from '../General/Header';
import RichTextEditor from '../General/RichTextEditor';
import styles from '../General/styles';
import { TranslationContext } from '../../context/TranslationContext';
import Icon from 'react-native-vector-icons/FontAwesome';

const EditTopic = ({ route, navigation }) => {
  const { topic } = route.params;
  const [title, setTitle] = useState(topic.title);
  const [content, setContent] = useState(topic.content);
  const { translations } = useContext(TranslationContext);
  const richTextEditor = useRef();

  const handleSaveChanges = async () => {
    try {
      const response = await updateTopic(topic._id, { title, content });
      if (response.status === 200) {
        Alert.alert(translations.success || 'Success', `${translations.topic} ${translations.updatedSuccessfully || 'updated successfully'}`);
        navigation.navigate('ManageTopics', { lesson: { _id: topic.lessonId } });
      } else {
        console.error('Update topic failed:', response.data);
        Alert.alert(translations.error || 'Error', `${translations.failedToUpdate || 'Failed to update'} ${translations.topic.toLowerCase()}`);
      }
    } catch (error) {
      console.error('Update topic error:', error.response ? error.response.data : error.message);
      Alert.alert(translations.error || 'Error', `${translations.failedToUpdate || 'Failed to update'} ${translations.topic.toLowerCase()}`);
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('AdminDashboard')}>
        <Icon name="arrow-left" size={16} color="#fff" />
        <Text style={styles.backButtonText}>{translations.backToDashboard || 'Back to Dashboard'}</Text>
      </TouchableOpacity>
      <Text style={styles.title}>{translations.edit || 'Edit'} {translations.topic}</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder={`${translations.enter || 'Enter'} ${translations.topic.toLowerCase()} ${translations.title?.toLowerCase() || 'title'}`}
      />
      <Text style={styles.label}>{translations.topic} {translations.content || 'Content'}:</Text>
      <RichTextEditor
        ref={richTextEditor}
        content={content}
        onContentChange={setContent}
      />
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

export default EditTopic;
