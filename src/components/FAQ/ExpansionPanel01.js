// ▶ Import react dependecies
import React from 'react';

// ▶ Import material-ui components
import { makeStyles } from '@material-ui/core/styles';
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Typography,
} from '@material-ui/core';

// ▶ Import material-ui icons
import { ExpandMore as ExpandMoreIcon } from '@material-ui/icons/';

// ▶ Make styles
const useStyles = makeStyles(theme => ({
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

const MyExpansionPanel = () => {
  const classes = useStyles();
  const database = '2019-08-09';
  return (
    <React.Fragment key="panel1a-content">
      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes.heading}>¿Qué es Simple handle data?</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Typography align="justify" component="p">
            Software para el manejo de bases de datos con información de teléfonos y correos
            electrónicos, su última <b>actualización: {database}</b>.
          </Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </React.Fragment>
  );
};

export default MyExpansionPanel;
