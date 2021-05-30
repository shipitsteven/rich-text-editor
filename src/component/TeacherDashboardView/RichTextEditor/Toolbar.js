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
  CameraOutlined,
} from '@ant-design/icons';
import { Button, Tooltip, Divider, Dropdown, Progress } from 'antd';
import CustomEditor from './EditorLogic';
import './styles.css';
import ListCommands from './commands/listCommands';
import ImageCommands from './commands/imageCommands';

const Toolbar = ({
  editor,
  listEditor,
  listTransforms,
  hlColor,
  handleHlColor,
}) => {
  const valueEditor = useSlate();

  const [uploadStatus, setUploadStatus] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  // TODO: handle error states

  const handleUpload = (snapshot) => {
    if (snapshot.totalBytes) {
      setUploadStatus(true);
      getUploadProgress(
        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      );
      if (snapshot.bytesTransferred === snapshot.totalBytes) {
        setTimeout(() => {
          setUploadStatus(false);
        }, 1000);
      }
    }
  };

  const getUploadProgress = (percent) => {
    setUploadProgress(percent);
  };

  const colorPicker = (
    <input type="color" value={hlColor} onChange={handleHlColor} />
  );

  const failureFxn = () => {
    console.log('Failure function called');
  };

  return (
    <>
      <Progress
        className={uploadStatus ? null : 'hidden'}
        size="small"
        percent={uploadProgress}
        showUploadProgress={uploadStatus}
      />
      <Button
        onMouseDown={(event) => {
          event.preventDefault();
          const url = window.prompt('Enter the URL of the image:');
          if (url && !ImageCommands.isImageUrl(url)) {
            alert('URL is not an image');
            return;
          }
          ImageCommands.insertImage(editor, url);
        }}
        icon={<CameraOutlined />}
      />
      <Dropdown
        overlay={() => (
          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              ImageCommands.uploadAndDisplay(
                e,
                editor,
                failureFxn,
                handleUpload.bind(this)
              );
              e.target.value = '';
            }}
          />
        )}
      >
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
            CustomEditor.handleInsertLink(editor);
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
      <Tooltip title="Change highlight color">
        <Dropdown overlay={colorPicker}>
          <Button
            icon={<DownOutlined />}
            style={{ backgroundColor: `${hlColor}` }}
          />
        </Dropdown>
      </Tooltip>
      {colorPicker}
      <Divider type="vertical" />
    </>
  );
};

export default Toolbar;
