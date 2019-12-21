// ▶ Import react dependecies
import React from 'react';
import PropTypes from 'prop-types';

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
  details: {
    flexDirection: 'column',
  },
}));

const MyExpansionPanel = props => {
  const classes = useStyles();
  const { expanded, handleChange } = props;

  return (
    <React.Fragment key="panel4a-content">
      <ExpansionPanel expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel4a-content"
          id="panel4a-header"
        >
          <Typography className={classes.heading}>
            ¿Qué tipos de archivos acepta el programa?
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.details}>
          <Typography paragraph align="justify">
            Solo acepta archivos de Excel con extensión <b>.xlsx</b> y <b>.xls</b>, algún otro
            archivo causara error al subirlo.
          </Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </React.Fragment>
  );
};

MyExpansionPanel.propTypes = {
  expanded: PropTypes.bool.isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default MyExpansionPanel;
