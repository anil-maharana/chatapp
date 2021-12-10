import React from 'react';
import { Editor, EditorState, CompositeDecorator, Modifier, SelectionState } from 'draft-js';
import {People,Mention,updateAutocompletePosition,getCaretPosition,getCurrentBlock,getText} from './mentionutils'
 

const people = [{
  id: 'annette1',
	name: 'Annette Cartwright'
}, {
  id:'steve123',
  name: 'Steve Liles'
}, {
  id: 'jojo96',
  name: 'Jo Orange'
}, {
  id: 'markbame2000',
  name: 'Mark Martirez'
}, {
  id: 'aliassam',
  name: 'Ali Assam'
}, {
  id: 'justjane',
  name: 'Jane Justin'
}]

//#region Decorators
const newEntityLocationStrategy = type => {
    const findEntitiesOfType = (contentBlock, callback, contentState) => {
      contentBlock.findEntityRanges(character => {
        const entityKey = character.getEntity()
        return (
          entityKey !== null &&
          contentState.getEntity(entityKey).getType() === type
        )
      }, callback)
    }
    return findEntitiesOfType
  }  
    
  export const decorator = new CompositeDecorator([
    {
      strategy: newEntityLocationStrategy('MENTION'),
      component: Mention
    }
  ])
  
//#endregion	
  

  




class Container extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(decorator),
      anchorEl:null
    };
    this.handleChange = this.handleChange.bind(this)
    this.handleBeforeInput = this.handleBeforeInput.bind(this)
		this.acceptSelectedPerson = this.acceptSelectedPerson.bind(this)
    this.handleReturn = this.handleReturn.bind(this)
    this.handleTab = this.handleTab.bind(this)
    this.handleEscape = this.handleEscape.bind(this)
    this.handleUpArrow = this.handleUpArrow.bind(this)
    this.handleDownArrow = this.handleDownArrow.bind(this)
    this.confirmMention = this.confirmMention.bind(this)
    this.handleClick = this.handleClick.bind(this)
    
  }
  handleChange(editorState) {
    const { mention } = this.state
    if (mention) {
      const caret = getCaretPosition(editorState)
      if (caret > mention.offset) {
      	const mentionText = getText(editorState, mention.offset+1, caret).toLowerCase()
      	const candidates = people.filter(person => person.name.toLowerCase().startsWith(mentionText)) 
        this.setState({
          editorState,
          mention: {
            ...mention,
            selectedIndex: 0,
            people: candidates
          }
        })
      } else {
        // last change deleted the @ character, so exit mention mode
        this.setState({editorState, mention: undefined})
      }
    } else {
      this.setState({editorState})
    }
  }
  handleBeforeInput(ch, editorState) {
    const { mention } = this.state


    if (mention) {
      // ???
    } else {
      if (ch === '@') {

        
        console.log(updateAutocompletePosition(this._editor.editorContainer,editorState));
        // enter "mention mode"
        this.setState({ 
          mention: {
            people: [],
            selectedIndex: 0,
            offset: getCaretPosition(editorState),
            //position: getMentionPosition(editorState)
            position: updateAutocompletePosition(this._editor.editorContainer,editorState)
          }
        })


      }
    }
    return false
  }
  handleEscape(ev) {
    if (this.state.mention) {
      this.setState({ mention: undefined })
      ev.preventDefault()
    }
  }
  acceptSelectedPerson(ev) {
    const { mention } = this.state   
  	if (mention) {    
      if (mention.people && mention.people.length > mention.selectedIndex) {
        let person = mention.people[mention.selectedIndex]
        this.confirmMention(person)
      } else {
        this.setState({mention:undefined})
      }
      ev.preventDefault()      
      return true
    }
    return false
  }
  handleTab(ev) {
    this.acceptSelectedPerson(ev)
  }
  handleReturn(ev, editorState) {
    return this.acceptSelectedPerson(ev)
  }
  handleUpArrow(ev){
    if (this.state.mention) {
			this.setState(({mention}) => ({
        mention:{ 
          ...mention, 
          selectedIndex: Math.max(0, mention.selectedIndex-1)
        }}))
      ev.preventDefault()
    }
  }
  handleDownArrow(ev){
    if (this.state.mention) {
			this.setState(({mention}) => ({
        mention:{ 
          ...mention, 
          selectedIndex: Math.min(mention.selectedIndex+1, people.length-1)
        }
      }))
      ev.preventDefault()
    }
  }
  handleClick(ev) {
    if (this.state.mention) {
      setTimeout(()=>this.setState({ mention: undefined }))
    }
    this._editor.focus()
  }
  confirmMention(person){
    const { editorState, mention } = this.state
    const contentState = editorState.getCurrentContent()
    const contentStateWithEntity = contentState.createEntity(
      'MENTION',
      'IMMUTABLE',
      person
    )
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey()
    const block = getCurrentBlock(editorState)
    const blockKey = block.getKey()
    const mentionText = '@' + person.name
    const contentStateWithReplacedText = Modifier.replaceText(
			contentStateWithEntity,
      new SelectionState({
        anchorKey: blockKey,
        anchorOffset: mention.offset,
        focusKey: blockKey,
        focusOffset: getCaretPosition(editorState),
        isBackward: false,
        hasFocus: true
      }),
      mentionText,
      null,
      entityKey
    )
    const newEditorState = EditorState.set(editorState, {
      currentContent: contentStateWithReplacedText,
			selection: new SelectionState({
        anchorKey: blockKey,
        anchorOffset: mention.offset + mentionText.length,
        focusKey: blockKey,
        focusOffset: mention.offset + mentionText.length,
        isBackward: false,
        hasFocus: true
      })
    })
    setTimeout(() => {
      this.setState({
        mention: undefined,
        editorState: newEditorState
      })
    }, 0)
  }


  
  render() {
    const { mention, editorState } = this.state;
    
    
    return (
      <div className="container-root" onClick={this.handleClick}>
        <Editor 
          ref={ref => this._editor = ref}
          placeholder="Try typing @mention's"
          editorState={editorState}
          onChange={this.handleChange}
          handleBeforeInput={this.handleBeforeInput}
          handleReturn={this.handleReturn}
          onTab={this.handleTab}
          onEscape={this.handleEscape}
          onUpArrow={this.handleUpArrow}
          onDownArrow={this.handleDownArrow}
        />
        { mention ? 


   
<People 
              {...(mention.position)} 
              people={mention.people}
              selectedIndex={mention.selectedIndex}
              onClick={this.confirmMention}/> 




	          
            : 
            null 
        }
      </div>
    );
  }
}

//ReactDOM.render(<Container />, document.getElementById('react-root'))
export default Container;