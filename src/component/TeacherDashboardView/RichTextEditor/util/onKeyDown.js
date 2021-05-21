import CustomEditor from '../EditorLogic';

export const customOnKeyDown = (listOnKeyDown, event, editor) => {
  if (event.ctrlKey) {
    // eslint-disable-next-line default-case
    switch (event.key) {
      // When "`" is pressed, keep our existing code block logic.
      case '`': {
        event.preventDefault();
        CustomEditor.toggleCodeBlock(editor);
        break;
      }

      // When "B" is pressed, bold the text in the selection.
      case 'b': {
        event.preventDefault();
        CustomEditor.toggleBoldMark(editor);
        break;
      }
    }
  }
  return listOnKeyDown(event);
};
