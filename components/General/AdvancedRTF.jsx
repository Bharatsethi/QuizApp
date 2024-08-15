import React from 'react';
import { WebView } from 'react-native-webview';
import { View, StyleSheet } from 'react-native';

const AdvancedRTF = ({ content, onContentChange }) => {
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Rich Text Editor</title>
      <link href="https://cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet">
      <style>
        #editor {
          height: 100%;
        }
        body, html {
          height: 100%;
          margin: 0;
          padding: 0;
        }
      </style>
    </head>
    <body>
      <div id="toolbar">
        <button class="ql-bold"></button>
        <button class="ql-italic"></button>
        <button class="ql-underline"></button>
        <button class="ql-link"></button>
        <button class="ql-image"></button>
        <button class="ql-list" value="ordered"></button>
        <button class="ql-list" value="bullet"></button>
      </div>
      <div id="editor">${content}</div>
      <script src="https://cdn.quilljs.com/1.3.6/quill.js"></script>
      <script>
        const editor = new Quill('#editor', {
          modules: {
            toolbar: '#toolbar'
          },
          theme: 'snow'
        });

        // Set initial content
        editor.root.innerHTML = \`${content}\`;

        // Listen for text-change events
        editor.on('text-change', function() {
          const html = editor.root.innerHTML;
          window.ReactNativeWebView.postMessage(html);
        });
      </script>
    </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={['*']}
        source={{ html: htmlContent }}
        onMessage={(event) => onContentChange(event.nativeEvent.data)}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 300,
    marginVertical: 10,
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});

export default AdvancedRTF;
