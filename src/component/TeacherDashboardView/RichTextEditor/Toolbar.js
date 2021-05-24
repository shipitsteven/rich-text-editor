import React, { useState } from 'react';
import { useSlate } from 'slate-react';
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
  UnorderedListOutlined,
  OrderedListOutlined,
  DownOutlined,
  FileImageOutlined,
} from '@ant-design/icons';
import { Button, Tooltip, Divider, Dropdown } from 'antd';
import CustomEditor from './EditorLogic';
import './styles.css';
import ListCommands from './commands/listCommands';

const Toolbar = ({
  editor,
  listEditor,
  listTransforms,
  hlColor,
  handleHlColor,
}) => {
  const handleInsertLink = (editor) => {
    const userInput = prompt('Enter a URL'); // prompt the user for a link
    CustomEditor.insertLink(editor, userInput);
  };
  const valueEditor = useSlate();

  const [hlColorVisible, setHlColorVisible] = useState(false);
  const handleHlVisible = (flag) => setHlColorVisible(flag);
  const colorPicker = (
    <input type="color" value={hlColor} onChange={handleHlColor} />
  );

  return (
    <>
      <Dropdown overlay={() => <input type="file" />}>
        <Tooltip title="Images">
          <Button icon={<FileImageOutlined />} />
        </Tooltip>
      </Dropdown>
      <Tooltip title="Bold">
        <Button
          icon={<BoldOutlined />}
          className={
            CustomEditor.isMarkActive(valueEditor, 'bold')
              ? 'active-style'
              : null
          }
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
      <Tooltip title="Bullet point list">
        <Button
          icon={<UnorderedListOutlined />}
          onMouseDown={(event) => {
            event.preventDefault();
            ListCommands.toggleUL(listEditor, listTransforms, editor);
          }}
        />
      </Tooltip>
      <Tooltip title="Numbered list">
        <Button
          icon={<OrderedListOutlined />}
          onMouseDown={(event) => {
            event.preventDefault();
            ListCommands.toggleOL(listEditor, listTransforms, editor);
          }}
        />
      </Tooltip>
      <Divider type="vertical" />
      <Tooltip title="Highlight">
        <Button
          icon={<HighlightOutlined />}
          onMouseDown={(event) => {
            event.preventDefault();
            CustomEditor.toggleHighlightMark(editor, hlColor);
          }}
        ></Button>
      </Tooltip>
      <Dropdown
        overlay={colorPicker}
        visible={hlColorVisible}
        onVisibleChange={handleHlVisible}
      >
        <Tooltip title="Change highlight color">
          <Button
            icon={<DownOutlined />}
            style={{ backgroundColor: `${hlColor}` }}
          />
        </Tooltip>
      </Dropdown>
      <Divider type="vertical" />
    </>
  );
};

export default Toolbar;
