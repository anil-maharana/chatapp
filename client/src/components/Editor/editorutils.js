import React from 'react';
import {EditorState ,getDefaultKeyBinding, KeyBindingUtil,Modifier } from 'draft-js';


export const insertCharacter=(characterToInsert, editorState)=> {

    
      const currentContent = editorState.getCurrentContent(),
            currentSelection = editorState.getSelection();
    
      const newContent = Modifier.replaceText(
        currentContent,
        currentSelection,
        characterToInsert
      );
    
      const newEditorState = EditorState.push(editorState, newContent, 'insert-characters');
    
      return  EditorState.forceSelection(newEditorState, newContent.getSelectionAfter());
}

export const keyBindingFunction=(event)=> {
    if (KeyBindingUtil.hasCommandModifier(event) && event.shiftKey && event.key === 'x') {
      return 'strikethrough';
    }
  
    if (KeyBindingUtil.hasCommandModifier(event) && event.shiftKey && event.key === '7') {
      return 'ordered-list';
    }
  
    if (KeyBindingUtil.hasCommandModifier(event) && event.shiftKey && event.key === '8') {
      return 'unordered-list';
    }
  
    if (KeyBindingUtil.hasCommandModifier(event) && event.shiftKey && event.key === '9') {
      return 'blockquote';
    }
  
    return getDefaultKeyBinding(event);
  }