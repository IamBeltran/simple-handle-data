// ▶ Import react dependecies
import React from 'react';
import PropTypes from 'prop-types';

// ▶ Import material-ui components
import { makeStyles } from '@material-ui/core/styles';
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
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
  table: {
    marginBottom: theme.spacing(2),
  },
}));

const MyExpansionPanel = props => {
  const classes = useStyles();
  const { expanded, handleChange } = props;
  const captionStyle = {
    background: '#43a047',
    color: '#FFFFFF',
    padding: '10px',
  };

  return (
    <React.Fragment key="panel3a-content">
      <ExpansionPanel expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3a-content"
          id="panel3a-header"
        >
          <Typography className={classes.heading}>¿Qué es una tupla?</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails direction="column" className={classes.details}>
          <Typography paragraph align="justify">
            Al igual que la dupla es una colección de registros con una clave única y varios campos
            de valor.
          </Typography>
          <Table className={classes.table} size="small" aria-label="Ejemplo de Dupla">
            <caption style={captionStyle}>Ejemplo de Tupla</caption>
            <TableHead>
              <TableRow>
                <TableCell>No. Cuenta</TableCell>
                <TableCell>Teléfono 01</TableCell>
                <TableCell>Teléfono 02</TableCell>
                <TableCell>Teléfono 03</TableCell>
                <TableCell>Teléfono 04</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell component="th" scope="row">
                  01
                </TableCell>
                <TableCell>0000000001</TableCell>
                <TableCell>0000000002</TableCell>
                <TableCell>0000000003</TableCell>
                <TableCell>0000000004</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  02
                </TableCell>
                <TableCell>0000000001</TableCell>
                <TableCell>0000000002</TableCell>
                <TableCell>0000000003</TableCell>
                <TableCell>0000000004</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <Typography paragraph align="justify">
            <b>NOTA:</b> En los ejemplos anteriores tanto en el de dupla y tupla, la columna ”No.
            cuenta” representa el campo-clave (ID o Clave unica), las otras columnas son
            campos-valor, dependiendo del numero de campos-valor es el grado de una base de datos,
            cada fila representa un registro.
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
