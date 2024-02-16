import React, { useState } from 'react';
import { Editor, EditorState, RichUtils, Modifier  } from 'draft-js';

const DraftEditor = ({ element, order, id }) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const onChange = (newState) => {
    setEditorState(newState);
  };

  const onBoldClick = () => {
    onChange(RichUtils.toggleInlineStyle(editorState, 'BOLD'));
  };

  const onTableClick = () => {
    const contentState = editorState.getCurrentContent();
    const selectionState = editorState.getSelection();
    const newContentState = Modifier.insertText(contentState, selectionState, '| Cell |');
    onChange(EditorState.push(editorState, newContentState, 'insert-characters'));
  };

  return (
    <div className="myEditor">
      <button onMouseDown={onTableClick}>Insert Table</button>
      <button onMouseDown={onBoldClick}>Bold</button>
      <Editor editorState={editorState} onChange={onChange} />
    </div>
  );
};

export default DraftEditor;
