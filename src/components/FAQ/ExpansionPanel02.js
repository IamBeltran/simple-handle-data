// ▶ Import react dependecies
import React from 'react';

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

const MyExpansionPanel = () => {
  const classes = useStyles();
  const captionStyle = {
    background: '#000000',
    color: '#FFFFFF',
    padding: '10px',
  };

  return (
    <React.Fragment key="panel2a-content">
      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography className={classes.heading}>¿Qué es una dupla?</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.details}>
          <Typography paragraph align="justify">
            En término de bases de datos, es una colección de registros una clave única y un solo
            campo de valor, en el siguiente ejemplo el numero de cuenta es la clave unica y el campo
            valor es el email, cada fila es un registro.
          </Typography>
          <Table className={classes.table} size="small" aria-label="Ejemplo de Dupla">
            <caption style={captionStyle}>Ejemplo de Dupla</caption>
            <TableHead>
              <TableRow>
                <TableCell>No. Cuenta</TableCell>
                <TableCell>Email</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell component="th" scope="row">
                  01
                </TableCell>
                <TableCell>email01@dominio.com</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  02
                </TableCell>
                <TableCell>email02@dominio.com</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </React.Fragment>
  );
};

export default MyExpansionPanel;
