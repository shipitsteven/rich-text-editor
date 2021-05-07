import React from "react";
import {
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
  HighlightOutlined,
  StrikethroughOutlined,
  CodeOutlined,
  UndoOutlined,
  RedoOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import { Button, Tooltip } from "antd";
import CustomEditor from "./EditorLogic";

const Toolbar = ({ editor }) => {
  const handleInsertLink = (editor) => {
    const userInput = prompt("Enter a URL"); // prompt the user for a link
    CustomEditor.insertLink(editor, userInput);
  };

  return (
    <>
      <Tooltip title="Bold">
        <Button
          icon={<BoldOutlined />}
          onMouseDown={(event) => {
            event.preventDefault();
            CustomEditor.toggleBoldMark(editor);
          }}
        />
      </Tooltip>
      <Tooltip title="Italicize">
        <Button
          danger={CustomEditor.isItalicMarkActive(editor)}
          icon={<ItalicOutlined />}
          onMouseDown={(event) => {
            event.preventDefault();
            CustomEditor.toggleItalicMark(editor);
          }}
        />
      </Tooltip>
      <Tooltip title="Underline">
        <Button
          icon={<UnderlineOutlined />}
          onMouseDown={(event) => {
            event.preventDefault();
            CustomEditor.toggleUnderlineMark(editor);
          }}
        />
      </Tooltip>
      <Tooltip title="Highlight">
        <Button
          icon={<HighlightOutlined />}
          onMouseDown={(event) => {
            event.preventDefault();
            CustomEditor.toggleHighlightMark(editor);
          }}
        />
      </Tooltip>
      <Tooltip title="Strike through">
        <Button
          icon={<StrikethroughOutlined />}
          onMouseDown={(event) => {
            event.preventDefault();
            CustomEditor.toggleStrikethroughMark(editor);
          }}
        />
      </Tooltip>
      <Tooltip title="Code block">
        <Button
          icon={<CodeOutlined />}
          onMouseDown={(event) => {
            event.preventDefault();
            CustomEditor.toggleCodeBlock(editor);
          }}
        />
      </Tooltip>

      <Tooltip title="Undo">
        <Button
          icon={<UndoOutlined />}
          onMouseDown={(event) => {
            event.preventDefault();
            editor.undo();
          }}
        />
      </Tooltip>
      <Tooltip title="Redo">
        <Button
          icon={<RedoOutlined />}
          onMouseDown={(event) => {
            event.preventDefault();
            editor.redo();
          }}
        />
      </Tooltip>
      <Tooltip title="HyperLink">
        <Button
          icon={<LinkOutlined />}
          onMouseDown={(event) => {
            event.preventDefault();
            handleInsertLink(editor);
          }}
        />
      </Tooltip>
      {/* <Button
        onMouseDown={(event) => {
          event.preventDefault();
          CustomEditor.removeLink(editor);
        }}
      >
        Remove Link
      </Button> */}
    </>
  );
};

export default Toolbar;
