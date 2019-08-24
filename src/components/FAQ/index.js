import React, { useState } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import {
  Typography,
  IconButton,
  Grid,
  Card,
  CardContent,
  CardActions,
  CardHeader,
  Collapse,
  Container,
  Avatar,
} from '@material-ui/core/';
import { ExpandMore as ExpandMoreIcon, MoreVert as MoreVertIcon } from '@material-ui/icons/';

const {
  update: { database },
} = window.IFT;

const useStyles = makeStyles(theme => ({
  card: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  AppBar: {},
}));

const FAQ = () => {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  const tableStyle = {
    width: '100%',
    border: '1px solid #000',
  };

  const captionStyle = {
    padding: '0.3em',
    color: '#fff',
    background: '#000',
  };

  const tdStyle = {
    width: '25%',
    textAlign: 'left',
    verticalAlign: 'top',
    border: '1px solid #000',
    borderCollapse: 'collapse',
    padding: '0.3em',
    captionSide: 'bottom',
  };

  const thStyle = {
    width: '25%',
    textAlign: 'center',
    verticalAlign: 'top',
    border: '1px solid #000',
    borderCollapse: 'collapse',
    padding: '0.3em',
    captionSide: 'bottom',
  };

  return (
    <Container maxWidth="lg" className={classes.container}>
      <Grid container direction="column" justify="center" spacing={2}>
        <Grid item xs={12}>
          <Card className={classes.card}>
            <CardHeader
              avatar={
                <Avatar aria-label="Recipe" className={classes.avatar}>
                  ?
                </Avatar>
              }
              action={
                <IconButton aria-label="Settings">
                  <MoreVertIcon />
                </IconButton>
              }
              title="Simple handle data:"
              subheader={`Última actualización: ${database}`}
            />
            <CardContent>
              <Typography variant="body2" color="textSecondary" component="p">
                Software para el manejo de bases de datos con información de teléfonos y correos
                electrónicos.
              </Typography>
            </CardContent>
            <CardActions disableSpacing>
              <IconButton
                className={clsx(classes.expand, {
                  [classes.expandOpen]: expanded,
                })}
                onClick={handleExpandClick}
                aria-expanded={expanded}
                aria-label="Muestra más"
                title="Muestra más"
                color="secondary"
              >
                <ExpandMoreIcon />
              </IconButton>
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
              <CardContent>
                <Typography variant="h6" paragraph>
                  Preguntas frecuentes:
                </Typography>
                <Typography paragraph align="justify">
                  <b>¿Qué es una dupla?</b> En término de bases de datos, es una colección de
                  registros una clave única y un solo campo de valor, en el siguiente ejemplo el
                  numero de cuenta es la clave unica y el campo valor es el email, cada fila es un
                  registro
                </Typography>
                <br />
                <br />
                <table style={tableStyle}>
                  <caption style={captionStyle}>Ejemplo de Dupla</caption>
                  <thead>
                    <tr>
                      <th style={thStyle}>No. cuenta</th>
                      <th style={thStyle}>email</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={tdStyle}>01</td>
                      <td style={tdStyle}>email01@dominio.com</td>
                    </tr>
                    <tr>
                      <td style={tdStyle}>02</td>
                      <td style={tdStyle}>email02@dominio.com</td>
                    </tr>
                  </tbody>
                </table>
                <br />
                <br />

                <Typography paragraph align="justify">
                  <b>¿Qué es una tupla?</b> Al igual que la dupla es una colección de registros con
                  una clave única y varios campos de valor.
                </Typography>

                <br />
                <br />
                <table style={tableStyle}>
                  <caption style={captionStyle}>Ejemplo de Tupla</caption>
                  <thead>
                    <tr>
                      <th style={thStyle}>No. cuenta</th>
                      <th style={thStyle}>telefono 01</th>
                      <th style={thStyle}>telefono 02</th>
                      <th style={thStyle}>telefono 03</th>
                      <th style={thStyle}>telefono 04</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={tdStyle}>01</td>
                      <td style={tdStyle}>0000000001</td>
                      <td style={tdStyle}>0000000002</td>
                      <td style={tdStyle}>0000000003</td>
                      <td style={tdStyle}>0000000004</td>
                    </tr>
                    <tr>
                      <td style={tdStyle}>02</td>
                      <td style={tdStyle}>0000000001</td>
                      <td style={tdStyle}>0000000002</td>
                      <td style={tdStyle}>0000000003</td>
                      <td style={tdStyle}>0000000004</td>
                    </tr>
                  </tbody>
                </table>
                <br />
                <br />

                <Typography paragraph align="justify">
                  <b>NOTA:</b> En los ejemplos anteriores la columna &rdquo;No. cuenta&rdquo;
                  representa el campo-clave (ID o Clave unica), las otras columnas son campos-valor,
                  dependiendo del numero de campos-valor es el grado de una base de datos, cada fila
                  representa un registro.
                </Typography>

                <Typography paragraph align="justify">
                  <b>¿Qué tipos de archivos acepta el programa?</b> Solo acepta archivos de Excel
                  con extensión .xlsx y .xls, algún otro archivo causara error al subirlo.
                </Typography>
                <Typography paragraph align="justify">
                  <b>¿Qué características debe de tener el libro de Excel?</b> No se permiten{' '}
                  <b>libros vacíos</b>, el libro solo deberá de tener <b>una hoja</b> de trabajo, el
                  rango donde debe iniciar la información es la celda <b>A1</b>, dependiendo del
                  tipo de colección el número máximo de celdas tendrá tendrá un límite, si se elige
                  la opción de tipo <b>dupla</b> el rango máximo son <b>2 columnas</b>, la columna
                  para el campo único (campo clave) y la columna con la información a depurar
                  (teléfono o email), si se elige la opción <b>tupla</b> tiene un número máximo de{' '}
                  <b>26 columnas</b>, la columna para el campo clave y un máximo de 25 celdas para
                  añadir la información. A partir de las especificaciones anteriores se tiene claro
                  las posibles causas de errores:
                </Typography>
                <ol>
                  <li>Archivos que no de Excel (.xlsx o .xls)</li>
                  <li>Un libro de Excel vacío (Sin información)</li>
                  <li>Más de una hoja en el libro de Excel</li>
                  <li>Un libro que no empiece la información en la celda A1</li>
                  <li>Una hoja de Excel que exceda las columnas permitidas (2 o 26)</li>
                </ol>
              </CardContent>
            </Collapse>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default FAQ;
