import { Transforms, Editor, Text, Path, Range, Element } from 'slate';
import { ReactEditor } from 'slate-react';

// CustomEditor is a namespace that extracts the logic out of the editor so it can be re-used by the Toolbar AND keyboard shortcuts
const CustomEditor = {
  isBoldMarkActive(editor) {
    const [match] = Editor.nodes(editor, {
      match: (n) => n.bold === true,
      universal: true,
    });

    return !!match;
  },

  isMarkActive(editor, format) {
    const marks = Editor.marks(editor);
    return marks ? marks[format] === true : false;
  },

  toggleMark(editor, format) {
    const isActive = this.isMarkActive(editor, format);

    if (isActive) {
      Editor.removeMark(editor, format);
    } else {
      Editor.addMark(editor, format, true);
    }
  },

  isItalicMarkActive(editor) {
    const [match] = Editor.nodes(editor, {
      match: (n) => n.italic === true,
      universal: true,
    });

    return !!match;
  },

  isCodeBlockActive(editor) {
    const [match] = Editor.nodes(editor, {
      match: (n) => n.type === 'code',
    });

    return !!match;
  },

  isUnderlineActive(editor) {
    const [match] = Editor.nodes(editor, {
      match: (n) => n.underline === true,
      universal: true,
    });

    return !!match;
  },

  isHighlightActive(editor) {
    const [match] = Editor.nodes(editor, {
      match: (n) => n.highlight === true,
      universal: true,
    });

    return !!match;
  },

  isStrikethroughActive(editor) {
    const [match] = Editor.nodes(editor, {
      match: (n) => n.strikethrough === true,
      universal: true,
    });

    return !!match;
  },

  toggleBoldMark(editor) {
    const isActive = CustomEditor.isBoldMarkActive(editor);
    Transforms.setNodes(
      editor,
      { bold: isActive ? null : true },
      {
        match: (n) => Text.isText(n),
        mode: 'highest',
        split: true,
      }
    );
  },

  toggleItalicMark(editor) {
    const isActive = CustomEditor.isItalicMarkActive(editor);
    Transforms.setNodes(
      editor,
      { italic: isActive ? null : true },
      { match: (n) => Text.isText(n), split: true }
    );
  },

  toggleCodeBlock(editor) {
    const isActive = CustomEditor.isCodeBlockActive(editor);
    Transforms.setNodes(
      editor,
      { type: isActive ? null : 'code' },
      { match: (n) => Editor.isBlock(editor, n) }
    );
  },

  toggleUnderlineMark(editor) {
    const isActive = CustomEditor.isUnderlineActive(editor);
    Transforms.setNodes(
      editor,
      { underline: isActive ? null : true },
      { match: (n) => Text.isText(n), split: true }
    );
  },

  toggleHighlightMark(editor, color) {
    const isActive = CustomEditor.isHighlightActive(editor);
    Transforms.setNodes(
      editor,
      {
        highlight: isActive ? null : true,
        color: isActive ? null : color,
      },
      { match: (n) => Text.isText(n), split: true }
    );
  },

  toggleStrikethroughMark(editor) {
    const isActive = CustomEditor.isStrikethroughActive(editor);
    Transforms.setNodes(
      editor,
      { strikethrough: isActive ? null : true },
      { match: (n) => Text.isText(n), split: true }
    );
  },

  // Link specific logic
  createLinkNode(href, text) {
    return {
      type: 'link',
      href,
      children: [{ text }],
    };
  },

  createParagraphNode(children = [{ text: '' }]) {
    return {
      type: 'paragraph',
      children,
    };
  },

  removeLink(editor, opts = {}) {
    return Transforms.unwrapNodes(editor, {
      ...opts,
      match: (n) =>
        !Editor.isEditor(n) && Element.isElement(n) && n.type === 'link',
    });
  },

  insertLink(editor, url) {
    if (!url) return;

    const { selection } = editor;
    const link = this.createLinkNode(url, 'New Link');

    ReactEditor.focus(editor);

    if (!!selection) {
      const [parentNode, parentPath] = Editor.parent(
        editor,
        selection.focus?.path
      );

      // Remove the Link node if we're inserting a new link node inside of another
      // link.
      if (parentNode.type === 'link') {
        this.removeLink(editor);
      }

      if (editor.isVoid(parentNode)) {
        // Insert the new link after the void node
        Transforms.insertNodes(editor, this.createParagraphNode([link]), {
          at: Path.next(parentPath),
          select: true,
        });
      } else if (Range.isCollapsed(selection)) {
        // Insert the new link in our last known location
        Transforms.insertNodes(editor, link, { select: true });
      } else {
        // Wrap the currently selected range of text into a Link
        Transforms.wrapNodes(editor, link, { split: true });
        // Remove the highlight and move the cursor to the end of the highlight
        Transforms.collapse(editor, { edge: 'end' });
      }
    } else {
      // Insert the new link node at the bottom of the Editor when selection
      // is falsey
      Transforms.insertNodes(editor, this.createParagraphNode([link]));
    }
  },
};

export default CustomEditor;
