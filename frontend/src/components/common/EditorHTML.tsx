import React, { useState } from 'react';
import ReactQuill from 'react-quill';

import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';

const EditorHTML = (props: any) => {

  const [textQuillStandart, setTextQuillStandart] = useState(props?.value);

  const quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [
        { list: 'ordered' },
        { list: 'bullet' },
        { indent: '-1' },
        { indent: '+1' },
      ],
      ['link', 'image'],
      ['clean'],
    ],
  };

  const quillFormats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
  ];

  return (
    <ReactQuill
      theme="snow"
      value={textQuillStandart}
      onChange={(val: any) => {
        setTextQuillStandart(val);
        props.setValueText(val);
      }}
      modules={quillModules}
      formats={quillFormats}
    />
  );
};
export default React.memo(EditorHTML);
