import React from 'react';
import Paper from '@mui/material/Paper'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'

import { createStyles, withStyles, WithStyles } from '@mui/material/styles'
import { getVisibleSelectionRect, CompositeDecorator } from 'draft-js';


const styles = () => createStyles({
  container: {
    minWidth: "100px",
    position: "absolute",
    zIndex: 10,
    backgroundColor: "coral"

  },
  item: {
    cursor: "pointer"
  }
})

//#region Positionutils

const getEditorBounds = (editor) => {
  let fakeClientRect = getVisibleSelectionRect(window)
  return {
    selectionRect: fakeClientRect ? {
      top: fakeClientRect?.top,
      left: fakeClientRect?.left
    } : null,
    editorRect: editor.getBoundingClientRect()
  }
}

const getLineNumber = (editorState) => {
  const currentBlockKey = editorState.getSelection().getStartKey()
  return editorState.getCurrentContent().getBlockMap()
    .keySeq().findIndex(k => k === currentBlockKey)
}

export const updateAutocompletePosition = (editor, editorState) => {
  const lineHeight = 26;
  const { editorRect, selectionRect } = getEditorBounds(editor);
  const line = getLineNumber(editorState);
  const top = selectionRect ? selectionRect.top : editorRect.top + (lineHeight * line)
  const left = selectionRect ? selectionRect.left : editorRect.left
  const position = {
    top: editor.offsetTop + (top - editorRect.top) + lineHeight,
    left: editor.offsetLeft + (left - editorRect.left)
  }
  return position
}
//#endregion

//#region Textutils
export const getCaretPosition = (editorState) => {


  return editorState.getSelection().getAnchorOffset()
}

export const getText = (editorState, start, end) => {
  const block = getCurrentBlock(editorState)
  const blockText = block.getText()
  return blockText.substring(start, end)
}

export const getCurrentBlock = editorState => {
  if (editorState.getSelection) {
    const selectionState = editorState.getSelection()
    const contentState = editorState.getCurrentContent()
    const block = contentState.getBlockForKey(selectionState.getStartKey())
    return block
  }
}

//#endregion



export const Mention = ({ children, contentState, entityKey }) =>
  <span className="mention" title={contentState.getEntity(entityKey).getData().id}>{children}</span>


export const getMentionPosition = (editorState) => {
  const range = window.getSelection().getRangeAt(0).cloneRange();
  const rect = range.getBoundingClientRect();

  var finalTop = (rect.bottom == 0) ? window.getSelection().focusNode.offsetTop + 20 : rect.bottom;
  var finalLeft = (rect.left == 0) ? window.getSelection().focusNode.offsetLeft + 20 : rect.left;
  return { top: finalTop, left: finalLeft }
  //return { top: rect.bottom, left: rect.left }
}


export class Person extends React.Component {
  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)


  }
  handleClick(ev) {
    ev.preventDefault()
    ev.stopPropagation()
    const { person, onClick } = this.props
    onClick(person)
  }
  render() {
    const { person: { name }, selected, key } = this.props
    return (

      <ListItem
        key={key}
        className={styles.item}
        selected={selected}
        onClick={this.handleClick}
      >
        {name}
      </ListItem>


    )
  }
}

export const People = ({ top, left, people, selectedIndex = 0, onClick }) => {

  return (
    <Paper className={styles.container} style={{
      top: top,
      left: left,
      position: 'absolute'
    }}>
      <List dense={true}>
        {
          people.map((person, idx) =>
            <Person key={person.id} person={person} selected={idx === selectedIndex} onClick={onClick} />
          )
        }
      </List>

    </Paper>
  )
}