import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import BasicPattern from './BasicPattern';
import TextDefinePattern from './TextDefinePattern';
import ParamDefinePattern from './ParamDefinePattern';

const useStyles = makeStyles({
  container: {
    textAlign: 'left',
    paddingTop: '64px',
    display: 'flex',
    flexWrap: 'wrap'
  }
});

const AppContainer = () => {
  const classes = useStyles();
  return (
    <React.Fragment>
      <CssBaseline />
      <Container fixed>
        <div className={classes.container}>
          <BasicPattern />
          <TextDefinePattern />
          <ParamDefinePattern />
        </div>
      </Container>
    </React.Fragment>
  );
};

export default AppContainer;
