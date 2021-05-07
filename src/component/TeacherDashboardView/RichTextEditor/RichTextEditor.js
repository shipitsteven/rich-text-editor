// Import React dependencies.
import React, { useMemo, useState, useCallback } from "react";
// Import the Slate editor factory.
import { createEditor } from "slate";
// Import the Slate components and React plugin.
import { Slate, Editable, withReact } from "slate-react";
import { withHistory } from "slate-history";
import CustomEditor from "./EditorLogic";
import { DefaultElement, CodeElement, Link } from "./Element";
import Leaf from "./Leaf";
import Toolbar from "./Toolbar";
import withLinks from "./plugin/withLinks";

const RichTextEditor = () => {
  // withHistory tracks editor history, use Ctrl + Z for undo, Ctrl + Y for redo
  const editor = useMemo(
    () => withLinks(withHistory(withReact(createEditor()))),
    []
  );
  // Add the initial value when setting up our state.
  const [value, setValue] = useState([
    {
      type: "paragraph",
      children: [{ text: "A line of text in a paragraph." }],
    },
    {
      type: "paragraph",
      children: [
        {
          text:
            "Since it's rich text, you can do things like turn a selection of text bold, or add a semantically rendered block quote in the middle of the page, like this:",
        },
      ],
    },
  ]);

  // Define a rendering function based on the element passed to `props`. We use
  // `useCallback` here to memoize the function for subsequent renders.
  const renderElement = useCallback((props) => {
    switch (props.element.type) {
      case "code":
        return <CodeElement {...props} />;
      case "link":
        return <Link {...props} />;
      default:
        return <DefaultElement {...props} />;
    }
  }, []);

  // Define a leaf rendering function that is memoized with `useCallback`.
  const renderLeaf = useCallback((props) => {
    return <Leaf {...props} />;
  }, []);

  return (
    <>
      <Toolbar editor={editor} />
      <Slate
        editor={editor}
        value={value}
        onChange={(newValue) => {
          console.log(newValue);
          setValue(newValue);
        }}
      >
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          onKeyDown={(event) => {
            if (!event.ctrlKey) {
              return;
            }

            // eslint-disable-next-line default-case
            switch (event.key) {
              // When "`" is pressed, keep our existing code block logic.
              case "`": {
                event.preventDefault();
                CustomEditor.toggleCodeBlock(editor);
                break;
              }

              // When "B" is pressed, bold the text in the selection.
              case "b": {
                event.preventDefault();
                CustomEditor.toggleBoldMark(editor);
                break;
              }
            }
          }}
        />
      </Slate>
    </>
  );
};

export default RichTextEditor;
