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
    <React.Fragment key="panel5a-content">
      <ExpansionPanel expanded={expanded === 'panel5'} onChange={handleChange('panel5')}>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel5a-content"
          id="panel5a-header"
        >
          <Typography className={classes.heading}>
            ¿Qué características debe de tener el libro de Excel?
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.details}>
          <Typography paragraph align="justify">
            No se permiten libros vacíos, el libro solo deberá de tener una hoja de trabajo, el
            rango donde debe iniciar la información es la celda A1, dependiendo del tipo de
            colección el número máximo de celdas tendrá tendrá un límite, si se elige la opción de
            tipo dupla el rango máximo son 2 columnas, la columna para el campo único (campo clave)
            y la columna con la información a depurar (teléfono o email), si se elige la opción
            tupla tiene un número máximo de 26 columnas, la columna para el campo clave y un máximo
            de 25 celdas para añadir la información. A partir de las especificaciones anteriores se
            tiene claro las posibles causas de errores:
          </Typography>
          <ol>
            <li>
              <b>Archivos que no de Excel (.xlsx o .xls)</b>
            </li>
            <li>
              <b>Un libro de Excel vacío (Sin información)</b>
            </li>
            <li>
              <b>Más de una hoja en el libro de Excel</b>
            </li>
            <li>
              <b>Un libro que no empiece la información en la celda A1</b>
            </li>
            <li>
              <b>Una hoja de Excel que exceda las columnas permitidas (2 o 26)</b>
            </li>
          </ol>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </React.Fragment>
  );
};

MyExpansionPanel.propTypes = {
  expanded: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]).isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default MyExpansionPanel;
