// ▶ Import react dependecies
import React from 'react';

// ▶ Import material-ui components
import { makeStyles } from '@material-ui/core/styles';
import { Container, Grid, Paper } from '@material-ui/core';

// ▶ Import components
import ExpansionPanel01 from './ExpansionPanel01';
import ExpansionPanel02 from './ExpansionPanel02';
import ExpansionPanel03 from './ExpansionPanel03';
import ExpansionPanel04 from './ExpansionPanel04';
import ExpansionPanel05 from './ExpansionPanel05';

// ▶ Make styles
const useStyles = makeStyles(theme => ({
  container: {
    padding: theme.spacing(0),
  },
  paper: {
    padding: theme.spacing(0),
    textAlign: 'left',
    color: theme.palette.text.primary,
  },
}));

const CollectionForm = () => {
  const classes = useStyles();
  return (
    <Container maxWidth="lg" className={classes.container}>
      <Grid container direction="column">
        <Grid item>
          <Paper className={classes.paper}>
            <ExpansionPanel01 />
            <ExpansionPanel02 />
            <ExpansionPanel03 />
            <ExpansionPanel04 />
            <ExpansionPanel05 />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CollectionForm;
