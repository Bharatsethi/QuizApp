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
    </head>
    <body>
      <div id="defaultRTE">${content}</div>
      <script>
        var defaultRTE = new ej.richtexteditor.RichTextEditor({
          value: '${content}',
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
    // License key setup
    window.ej.base.License.register('YOUR_SYNCFUSION_LICENSE_KEY');
  }, []);

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={['*']}
        source={{ html: htmlContent }}
        onMessage={(event) => onContentChange(event.nativeEvent.data)}
        style={styles.webview}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  webview: {
    flex: 1,
  },
});

export default AdvancedRTF;
