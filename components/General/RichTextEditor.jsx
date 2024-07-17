// General/RichTextEditor.jsx
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
  },
  toolbar: {
    backgroundColor: '#f5f5f5',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
});

export default RichTextEditor;
