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
        {props.subTitle}
      </CardContent>
      <CardActions>
        <Button
          key="play"
          color="primary"
          disabled={processing}
          onClick={() => startProcessing()}
        >
          Play
        </Button>
        <Button
          key="stop"
          color="secondary"
          disabled={!processing}
          onClick={() => stopProcessing()}
        >
          Stop
        </Button>
      </CardActions>
    </Card>
  );
};

AudioPlayerCard.propTypes = {
  title: PropTypes.string.isRequired,
  subTitle: PropTypes.element,
  onStart: PropTypes.func.isRequired,
  onStop: PropTypes.func.isRequired
};

export default AudioPlayerCard;
