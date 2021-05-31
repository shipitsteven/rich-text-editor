import React, { useMemo, useState, useCallback } from 'react';
import { createEditor } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import { withHistory } from 'slate-history';
import {
  DefaultElement,
  CodeElement,
  MiddleAligned,
  LeftAligned,
  RightAligned,
} from './Element';
import Leaf from './Leaf';
import Toolbar from './Toolbar';
import withLinks from './plugin/withLinks';
import { EditListPlugin } from '@productboard/slate-edit-list';
import { customOnKeyDown } from './util/onKeyDown';
import firebase from 'firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyBNTkJXewdc-uGCHudyXnJxGB0I1QnZbRQ',
  authDomain: 'rich-text-cb905.firebaseapp.com',
  projectId: 'rich-text-cb905',
  storageBucket: 'rich-text-cb905.appspot.com',
  messagingSenderId: '840547243181',
  appId: '1:840547243181:web:5beb56b5db7becafd56224',
};

firebase.initializeApp(firebaseConfig);

const options = {}; // additional options

const [withEditList, onKeyDown, { Editor, Transforms }] =
  EditListPlugin(options);

const RichTextEditor = () => {
  // withHistory tracks editor history, use Ctrl + Z for undo, Ctrl + Y for redo
  const editor = useMemo(
    () => withEditList(withLinks(withHistory(withReact(createEditor())))),
    []
  );
  // Add the initial value when setting up our state.
  const [value, setValue] = useState([
    {
      type: 'paragraph',
      children: [{ text: 'A line of text in a paragraph.' }],
    },
    {
      type: 'paragraph',
      children: [
        {
          text: "Since it's rich text, you can do things like turn a selection of text bold, or add a semantically rendered block quote in the middle of the page, like this:",
        },
      ],
    },
  ]);

  const [hlColor, setHlColor] = useState('#fcba03');
  const handleHlColor = (event) => {
    setHlColor(event.target.value);
  };
  const [textColor, setTextColor] = useState('#6495ed');
  const handleTextColor = (event) => {
    setTextColor(event.target.value);
  };

  // Define a rendering function based on the element passed to `props`. We use
  // `useCallback` here to memoize the function for subsequent renders.
  const renderElement = useCallback((props) => {
    switch (props.element.type) {
      case 'code':
        return <CodeElement {...props} />;
      case 'middle_aligned':
        return <MiddleAligned {...props} />;
      case 'left_aligned':
        return <LeftAligned {...props} />;
      case 'right_aligned':
        return <RightAligned {...props} />;
      case 'ul_list':
        return <ul {...props.attributes}>{props.children}</ul>;
      case 'ol_list':
        return <ol {...props.attributes}>{props.children}</ol>;
      case 'list_item':
        return <li {...props.attributes}>{props.children}</li>;
      default:
        return <DefaultElement {...props} />;
    }
  }, []);

  // Define a leaf rendering function that is memoized with `useCallback`.
  const renderLeaf = useCallback(
    (props) => {
      let withColors = { ...props, hlColor, textColor };
      return <Leaf props={withColors} />;
    },
    [hlColor, textColor]
  );

  return (
    <>
      <Slate
        editor={editor}
        value={value}
        onChange={(newValue) => {
          console.log(newValue);
          setValue(newValue);
        }}
      >
        <Toolbar
          editor={editor}
          handleTextColor={handleTextColor.bind(this)}
          textColor={textColor}
          listEditor={Editor}
          listTransforms={Transforms}
          hlColor={hlColor}
          handleHlColor={handleHlColor.bind(this)}
        />
        <div
          style={{
            border: '1px solid gray',
            padding: '0.5em',
            borderRadius: '8px',
            marginTop: '0.25em',
          }}
        >
          <Editable
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            onKeyDown={(event) => {
              customOnKeyDown(onKeyDown(editor), event, editor);
            }}
          />
        </div>
      </Slate>
    </>
  );
};

export default RichTextEditor;
