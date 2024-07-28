import React, { useRef, useEffect } from 'react';
import { WebView } from 'react-native-webview';
import PropTypes from 'prop-types';

const createHtmlContent = (content) => `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <script src="https://cdn.ckeditor.com/4.16.0/standard-all/ckeditor.js"></script>
      <style>
        body { margin: 0; padding: 0; }
        .editor-container { height: 100vh; }
      </style>
    </head>
    <body>
      <textarea name="editor" id="editor">${content}</textarea>
      <script>
        CKEDITOR.replace('editor', {
          toolbar: [
            { name: 'document', items: ['Source', '-', 'NewPage', 'Preview', 'Print', '-', 'Templates'] },
            { name: 'clipboard', items: ['Cut', 'Copy', 'Paste', 'PasteText', '-', 'Undo', 'Redo'] },
            { name: 'editing', items: ['Find', 'Replace', '-', 'SelectAll', '-', 'SpellChecker'] },
            { name: 'forms', items: ['Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'ImageButton', 'HiddenField'] },
            '/',
            { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline', 'Strike', '-', 'RemoveFormat'] },
            { name: 'paragraph', items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', 'CreateDiv', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl'] },
            { name: 'links', items: ['Link', 'Unlink', 'Anchor'] },
            { name: 'insert', items: ['Image', 'Table', 'HorizontalRule', 'SpecialChar', 'PageBreak'] },
            '/',
            { name: 'styles', items: ['Styles', 'Format', 'Font', 'FontSize'] },
            { name: 'colors', items: ['TextColor', 'BGColor'] },
            { name: 'tools', items: ['Maximize', 'ShowBlocks'] },
            { name: 'about', items: ['About'] }
          ],
          height: '90vh'
        });

        CKEDITOR.instances.editor.on('change', function() {
          window.ReactNativeWebView.postMessage(CKEDITOR.instances.editor.getData());
        });

        document.addEventListener('message', function(event) {
          CKEDITOR.instances.editor.setData(event.data);
        });
      </script>
    </body>
  </html>
`;

const AdvancedRTF = ({ content, onContentChange }) => {
  const webViewRef = useRef();

  useEffect(() => {
    if (webViewRef.current) {
      webViewRef.current.injectJavaScript(`CKEDITOR.instances.editor.setData(\`${content}\`); true;`);
    }
  }, [content]);

  return (
    <WebView
      ref={webViewRef}
      originWhitelist={['*']}
      source={{ html: createHtmlContent(content) }}
      onMessage={(event) => {
        onContentChange(event.nativeEvent.data);
      }}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      style={{ flex: 1 }}
    />
  );
};

AdvancedRTF.propTypes = {
  content: PropTypes.string,
  onContentChange: PropTypes.func.isRequired,
};

AdvancedRTF.defaultProps = {
  content: '',
};

export default AdvancedRTF;
