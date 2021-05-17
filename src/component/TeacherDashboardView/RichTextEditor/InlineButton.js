import { useSlate } from 'slate-react';
import React from 'react';
// import {
//   BoldOutlined,
//   //   ItalicOutlined,
//   //   UnderlineOutlined,
//   //   HighlightOutlined,
//   //   StrikethroughOutlined,
//   //   CodeOutlined,
//   //   UndoOutlined,
//   //   RedoOutlined,
//   //   LinkOutlined,
// } from '@ant-design/icons';
// import { Button, Tooltip } from 'antd';
import CustomEditor from './EditorLogic';
import { Tag } from 'antd';

const { CheckableTag } = Tag;
const MarkButton = ({ format, icon }) => {
  const editor = useSlate();
  return (
    <CheckableTag
      checked={CustomEditor.isMarkActive(editor, format)}
      onMouseDown={(event) => {
        event.preventDefault();
        CustomEditor.toggleMark(editor, format);
      }}
    ></CheckableTag>
  );
};

export default MarkButton;
