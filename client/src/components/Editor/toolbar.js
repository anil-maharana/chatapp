import React from 'react';
import '../../App.css';
import { RichUtils } from 'draft-js';

import FormatBoldIcon from '@mui/icons-material/FormatBold'
import FormatItalicIcon from '@mui/icons-material/FormatItalic'
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined'
import StrikethroughIcon from '@mui/icons-material/StrikethroughS'

import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'
import FormatQuoteIcon from '@mui/icons-material/FormatQuote'
import CodeIcon from '@mui/icons-material/Code'

import Emoji from '../Emoji/Emoji';
import IconButton from '@mui/material/IconButton';

const inlineStyleButtons = [
  {
    value: 'Bold',
    style: 'BOLD',
    icon: <FormatBoldIcon />
  },

  {
    value: 'Italic',
    style: 'ITALIC',
    icon: <FormatItalicIcon />
  },

  {
    value: 'Underline',
    style: 'UNDERLINE',
    icon: <FormatUnderlinedIcon />
  },

  {
    value: 'Strikethrough',
    style: 'STRIKETHROUGH',
    icon: <StrikethroughIcon />
  },

  {
    value: 'Code',
    style: 'CODE',
    icon: <CodeIcon />
  }
];

const blockTypeButtons = [
  {
    value: 'Blockquote',
    block: 'blockquote',
    icon: <FormatQuoteIcon />
  },

  {
    value: 'Unordered List',
    block: 'unordered-list-item',
    icon: <FormatListBulletedIcon />
  },

  {
    value: 'Ordered List',
    block: 'ordered-list-item',
    icon: <FormatListNumberedIcon />
  }
];


class ToolBar extends React.Component {
  constructor(props) {
    super(props);
  }

  renderBlockButton(value, block, icon) {
    const currentBlockType = RichUtils.getCurrentBlockType(this.props.editorState);
    let className = '';
    let color = 'default';
    if (currentBlockType === block) {
      className = 'active';
      color = 'primary';
    }

    return (
      <IconButton
        key={block}
        value={value}
        data-block={block}
        onMouseDown={this.props.toggleBlockType}
        color={color}
        size="small"
      >
        {icon}
      </IconButton>

    );
  }

  renderInlineStyleButton(value, style, icon) {
    const currentInlineStyle = this.props.editorState.getCurrentInlineStyle();
    let className = '';
    let color = 'default';
    if (currentInlineStyle.has(style)) {
      className = 'active';
      color = 'primary';
    }

    return (
      <IconButton
        key={style}
        value={value}
        data-style={style}
        className={className}
        onMouseDown={this.props.toggleInlineStyle}
        data-style={style}
        color={color}
        size="small"
      >
        {icon}
      </IconButton>
    );
  }


  render() {
    return (
      <div className="inline-style-options">
        {inlineStyleButtons.map((button) => {
          return this.renderInlineStyleButton(button.value, button.style, button.icon);
        })}
        {blockTypeButtons.map((button) => {
          return this.renderBlockButton(button.value, button.block, button.icon);
        })}
        <Emoji addEmoji={this.props.addEmoji}></Emoji>
      </div>
    )
  }
}
export default ToolBar;