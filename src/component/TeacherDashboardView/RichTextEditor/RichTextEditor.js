// Import React dependencies.
import React, { useMemo, useState, useCallback } from 'react';
// Import the Slate editor factory.
import { createEditor } from 'slate';
// Import the Slate components and React plugin.
import { Slate, Editable, withReact } from 'slate-react';
import { withHistory } from 'slate-history';
import CustomEditor from './EditorLogic';
import { DefaultElement, CodeElement, Link } from './Element';
import Leaf from './Leaf';
import Toolbar from './Toolbar';
import withLinks from './plugin/withLinks';
import { EditListPlugin } from '@productboard/slate-edit-list';

const options = {}; // additional options

const [
  withEditList, // applies normalization to editor
  onKeyDown, // keyDown handler for keyboard shortcuts
  { Editor, Element, Transforms }, // Slate classes with added utility functions and transforms this package provides
] = EditListPlugin(options);

const customOnKeyDown = (editor, event) => {
  onKeyDown(editor);
  if (event.key === '`' && event.ctrlKey) {
    event.preventDefault();
    CustomEditor.toggleCodeBlock(editor);
  }
};

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

  // Define a rendering function based on the element passed to `props`. We use
  // `useCallback` here to memoize the function for subsequent renders.
  const renderElement = useCallback((props) => {
    switch (props.element.type) {
      case 'code':
        return <CodeElement {...props} />;
      case 'link':
        return <Link {...props} />;
      case 'ul_list':
        return <ul {...props.attributes}>{props.children}</ul>;
      case 'ol_list':
        return <ol {...props.attributes}>{props.children}</ol>;

      case 'list_item':
        return <li {...props.attributes}>{props.children}</li>;

      case 'heading':
        return <h1 {...props.attributes}>{props.children}</h1>;
      default:
        return <DefaultElement {...props} />;
    }
  }, []);

  // Define a leaf rendering function that is memoized with `useCallback`.
  const renderLeaf = useCallback((props) => {
    return <Leaf {...props} />;
  }, []);

  const inList = Editor.isSelectionInList(editor);
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
        <Toolbar editor={editor} />
        <button
          className={inList ? 'active' : ''}
          onClick={() =>
            inList
              ? Transforms.unwrapList(editor)
              : Transforms.wrapInList(editor)
          }
        >
          List
        </button>
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          onKeyDown={(event) => customOnKeyDown(editor, event)}
        />
      </Slate>
    </>
  );
};

export default RichTextEditor;
