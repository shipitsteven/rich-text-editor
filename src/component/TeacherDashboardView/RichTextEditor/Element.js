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

const MiddleAligned = (props) => {
  return <p style={{ textAlign: 'center' }}>{props.children}</p>;
};

const LeftAligned = (props) => {
  return <p style={{ textAlign: 'left' }}>{props.children}</p>;
};

const RightAligned = (props) => {
  return <p style={{ textAlign: 'right' }}>{props.children}</p>;
};

export {
  CodeElement,
  MiddleAligned,
  LeftAligned,
  RightAligned,
  DefaultElement,
  Link,
};
