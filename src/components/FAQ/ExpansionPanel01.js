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

const {
  updated: { IFT, PNN },
  version: { APP, API },
} = window.INFORMATION;

const MyExpansionPanel01 = props => {
  const classes = useStyles();
  const { expanded, handleChange } = props;
  return (
    <React.Fragment key="panel1a-content">
      <ExpansionPanel expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes.heading}>¿Qué es Simple handle data?</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.details}>
          <Typography paragraph align="justify" component="p">
            Software para el manejo de bases de datos que contiene información de teléfonos y
            correos electrónicos, ayudando a la depuracion y validacion de ellos los desarrolladores
            del sofware conocen las necesidades y requerimientos del manejo y gestión de bases de
            datos de este rubro, los recursos que se gastan en la optimización de una base de datos,
            como dinero y tiempo.
          </Typography>
          <Typography paragraph align="justify" component="p">
            <b>Última actualización del Instituto Federal de Telecomunicaciones: {IFT}</b>.
          </Typography>
          <Typography paragraph align="justify" component="p">
            <b>Última actualización de la base de datos: {PNN}</b>.
          </Typography>
          <Typography paragraph align="justify" component="p">
            <b>Versión actual de APP: {APP}</b>.
          </Typography>
          <Typography paragraph align="justify" component="p">
            <b>Versión actual de API: {API}</b>.
          </Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </React.Fragment>
  );
};

MyExpansionPanel01.propTypes = {
  expanded: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]).isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default MyExpansionPanel01;
