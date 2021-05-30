import React from 'react';
import CustomEditor from './EditorLogic';
import './styles.css';
import { useSlateStatic, useSelected, useFocused } from 'slate-react';

// Element = HTML block elements
const CodeElement = (props) => {
  return (
    <pre {...props.attributes}>
      <code>{props.children}</code>
    </pre>
  );
};
const DefaultElement = (props) => {
  return <p {...props.attributes}>{props.children}</p>;
};

const Link = ({ attributes, element, children }) => {
  const editor = useSlateStatic();
  const selected = useSelected();
  const focused = useFocused();

  return (
    <div className="element-link">
      <a {...attributes} href={element.href}>
        {children}
      </a>
      {selected && focused && (
        <div className="popup" contentEditable={false}>
          <a href={element.href} rel="noreferrer" target="_blank">
            {element.href}
          </a>
          <button
            onClick={() => {
              CustomEditor.removeLink(editor);
            }}
          >
            Unlink
          </button>
        </div>
      )}
    </div>
  );
};

const Image = ({ attributes, children, element }) => {
  const selected = useSelected();
  const focused = useFocused();
  return (
    <div {...attributes}>
      <div>
        <img
          src={element.url}
          className="image-in-editor"
          style={{
            boxShadow: `${selected && focused ? '0 0 0 3px #B4D5FF' : 'none'}`,
          }}
          alt="placeholder"
        />
      </div>
      {children}
    </div>
  );
};

export { CodeElement, DefaultElement, Link, Image };
