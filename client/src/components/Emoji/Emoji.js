import React from 'react';
import Popover from '@mui/material/Popover';
import { withStyles, makeStyles } from "@mui/styles";
import Typography from '@mui/material/Typography';

import 'emoji-mart/css/emoji-mart.css';
import { Picker } from 'emoji-mart';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import IconButton from '@mui/material/IconButton';

import './Emoji.css'

const useStyles = makeStyles((theme) => ({
  typography: {
    // padding: theme.spacing(0),
  },
}));

export default function Emoji(props) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSelect = (emoji) => {
    props.addEmoji(emoji);
    handleClose();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <React.Fragment>
      <IconButton aria-describedby={id} onClick={handleClick} className="emojiButton">

        <EmojiEmotionsIcon ></EmojiEmotionsIcon>
      </IconButton>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Typography className={classes.typography}>

          <a style={{ cursor: 'hand' }}><Picker title='Citryl' emoji='point_up' onSelect={handleSelect} /></a>


        </Typography>
      </Popover>
    </React.Fragment>
  );
}