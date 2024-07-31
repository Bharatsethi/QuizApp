import React, { useEffect, useRef } from 'react';
import { RichTextEditorComponent, HtmlEditor, Inject, Toolbar, Image, Link, QuickToolbar } from '@syncfusion/ej2-react-richtexteditor';

const AdvancedRTF = ({ content, onContentChange }) => {
  const rteRef = useRef(null);

  useEffect(() => {
    if (rteRef.current) {
      rteRef.current.value = content;
    }
  }, [content]);

  const handleChange = () => {
    if (rteRef.current) {
      onContentChange(rteRef.current.value);
    }
  };

  return (
    <RichTextEditorComponent ref={rteRef} change={handleChange}>
      <Inject services={[HtmlEditor, Toolbar, Image, Link, QuickToolbar]} />
    </RichTextEditorComponent>
  );
};

export default AdvancedRTF;
