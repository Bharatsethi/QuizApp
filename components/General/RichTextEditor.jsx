// components/General/RichTextEditor.jsx
import React, { forwardRef } from 'react';
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';
import { StyleSheet, View } from 'react-native';

const RichTextEditor = forwardRef((props, ref) => {
  const { content, onContentChange } = props;

  return (
    <View style={styles.container}>
      <RichEditor
        ref={ref}
        style={styles.richEditor}
        initialContentHTML={content}
        onChange={onContentChange}
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
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  richEditor: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    minHeight: 200,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
});

export default RichTextEditor;
