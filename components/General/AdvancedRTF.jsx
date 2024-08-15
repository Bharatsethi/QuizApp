import React, { useEffect } from 'react';
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
    <link href="https://cdn.syncfusion.com/ej2/material.css" rel="stylesheet">
    <script src="https://cdn.syncfusion.com/ej2/dist/ej2.min.js"></script>
    <style>
      #defaultRTE {
        height: 300px;
        box-sizing: border-box;
      }
      .e-toolbar {
        height: 100px; /* Increase this value to make the toolbar larger */
      }
      .e-toolbar-item .e-btn {
        height: 40px; /* Increase the button size accordingly */
        line-height: 40px;
      }
      body, html {
        margin: 0;
        padding: 0;
        height: 100%;
        box-sizing: border-box;
      }
    </style>
  </head>
  <body>
    <div id="defaultRTE"></div>
    <script>
      var defaultRTE = new ej.richtexteditor.RichTextEditor({
        toolbarSettings: {
          items: [
            'Bold', 'Italic', 'Underline', 'StrikeThrough', '|',
            'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',
            'Formats', 'Alignments', 'OrderedList', 'UnorderedList', '|',
            'Outdent', 'Indent', 'CreateLink', 'Image', 'CreateTable', '|',
            'SourceCode', 'Undo', 'Redo'
          ]
        },
        value: \`${content}\`,
        height: 300,
        change: function (args) {
          window.ReactNativeWebView.postMessage(args.value);
        }
      });
      defaultRTE.appendTo('#defaultRTE');
    </script>
  </body>
  </html>
`;



  useEffect(() => {
    // Optionally, content updates or initialization actions
  }, [content]);

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
    height: 300,  // Adjust height as needed
    marginVertical: 10,
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});

export default AdvancedRTF;
