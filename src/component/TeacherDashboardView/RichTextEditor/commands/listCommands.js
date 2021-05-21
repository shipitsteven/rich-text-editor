const ListCommands = {
  isInList(listEditor, editor) {
    return listEditor.isSelectionInList(editor);
  },

  toggleUL(listEditor, transforms, editor) {
    let inList = this.isInList(listEditor, editor);
    if (inList) {
      transforms.unwrapList(editor);
      transforms.wrapInList(editor, 'ul_list');
    } else transforms.wrapInList(editor, 'ul_list');
  },

  toggleOL(listEditor, transforms, editor) {
    let inList = this.isInList(listEditor, editor);
    if (inList) {
      transforms.unwrapList(editor);
      transforms.wrapInList(editor, 'ol_list');
    } else transforms.wrapInList(editor, 'ol_list');
  },
};

export default ListCommands;
