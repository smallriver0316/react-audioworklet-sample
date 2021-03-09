import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  makeStyles,
  Card,
  CardActions,
  CardContent,
  Button,
  Typography
} from "@material-ui/core";
import { PlayArrow, Stop } from '@material-ui/icons';

const useStyles = makeStyles({
  root: {
    width: 256,
    margin: '16px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  title: {
    fontSize: 14,
  }
});

const AudioPlayerCard = (props) => {
  const classes = useStyles();
  const [processing, setProcessing] = useState(false);

  const startProcessing = () => {
    setProcessing(true);
    props.onStart();
  };

  const stopProcessing = () => {
    props.onStop();
    setProcessing(false);
  };

  return (
    <Card className={classes.root} variant="outlined">
      <CardContent>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
          {props.title}
        </Typography>
        <div>{props.children}</div>
      </CardContent>
      <CardActions>
        <Button
          key="play"
          color="primary"
          disabled={processing}
          startIcon={<PlayArrow />}
          onClick={() => startProcessing()}
        >
          Play
        </Button>
        <Button
          key="stop"
          color="secondary"
          disabled={!processing}
          startIcon={<Stop />}
          onClick={() => stopProcessing()}
        >
          Stop
        </Button>
      </CardActions>
    </Card>
  );
};

AudioPlayerCard.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string.isRequired,
  onStart: PropTypes.func.isRequired,
  onStop: PropTypes.func.isRequired
};

export default AudioPlayerCard;
