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
  FileImageOutlined,
  BgColorsOutlined,
  CameraOutlined,
  AlignCenterOutlined,
  AlignLeftOutlined,
  AlignRightOutlined,
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
  handleTextColor,
  textColor,
}) => {
  const valueEditor = useSlate();

  const highlightColorPicker = (
    <input type="color" value={hlColor} onChange={handleHlColor} />
  );

  const textColorPicker = (
    <input type="color" value={textColor} onChange={handleTextColor} />
  );
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
      <Tooltip title="Add image via URL">
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
      </Tooltip>
      <Tooltip title="Upload image">
        <Dropdown
          overlay={() => (
            <input
              type="file"
              accept="image/*"
              onChange={async (event) => {
                ImageCommands.uploadAndDisplay(
                  event,
                  editor,
                  failureFxn,
                  handleUpload.bind(this)
                );
                event.target.value = '';
              }}
            />
          )}
        >
          <Button icon={<FileImageOutlined />} />
        </Dropdown>
      </Tooltip>
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
            CustomEditor.toggleBlock(editor, 'code');
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
      <Tooltip title="Left Align">
        <Button
          icon={<AlignLeftOutlined />}
          onMouseDown={(event) => {
            event.preventDefault();
            CustomEditor.toggleAlignment(editor, 'left_aligned');
          }}
        />
      </Tooltip>
      <Tooltip title="Center Align">
        <Button
          icon={<AlignCenterOutlined />}
          onMouseDown={(event) => {
            event.preventDefault();
            CustomEditor.toggleAlignment(editor, 'middle_aligned');
          }}
        />
      </Tooltip>
      <Tooltip title="Right Align">
        <Button
          icon={<AlignRightOutlined />}
          onMouseDown={(event) => {
            event.preventDefault();
            CustomEditor.toggleAlignment(editor, 'right_aligned');
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
        />
      </Tooltip>
      <Tooltip title="Change Highlight Color">{highlightColorPicker}</Tooltip>
      <Divider type="vertical" />
      <Tooltip title="Color">
        <Button
          icon={<BgColorsOutlined />}
          onMouseDown={(event) => {
            event.preventDefault();
            CustomEditor.toggleColor(editor, textColor);
          }}
        />
      </Tooltip>
      <Tooltip title="Change Text Color">{textColorPicker}</Tooltip>
      <Divider type="vertical" />
    </>
  );
};

export default Toolbar;
