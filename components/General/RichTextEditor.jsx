import React, { forwardRef } from 'react';
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import inputStyles from './inputStyles';
import sharedStyles from './sharedStyles';

const RichTextEditor = forwardRef((props, ref) => {
  const { content, onContentChange } = props;

  return (
    <View style={styles.container}>
      <RichToolbar
        editor={ref}
        actions={[
          actions.setBold,
          actions.setItalic,
          actions.setUnderline,
          actions.insertBulletsList,
          actions.insertOrderedList,
          actions.insertLink,
        ]}
        iconTint="#000"
        selectedIconTint="#2095F2"
        disabledIconTint="#8b8b8b"
        style={styles.toolbar}
        accessibilityLabel="Rich Text Editor Toolbar"
      />
      <RichEditor
        ref={ref}
        style={styles.richEditor}
        initialContentHTML={content}
        onChange={onContentChange}
        editorInitializedCallback={() => {
          console.log('Editor initialized');
        }}
        placeholder="Start writing here..."
        accessibilityLabel="Rich Text Editor"
      />
    </View>
  );
});

RichTextEditor.propTypes = {
  content: PropTypes.string,
  onContentChange: PropTypes.func.isRequired,
};

RichTextEditor.defaultProps = {
  content: '',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  richEditor: {
    ...inputStyles.richTextEditor,
    minHeight: 150,  // You can adjust the height as needed
  },
  toolbar: {
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default RichTextEditor;
