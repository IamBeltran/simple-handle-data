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
                electrónicos
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
                <Typography paragraph>
                  <b>¿Qué es una dupla?</b> En término de bases de datos, es una colección de
                  registros una clave única y un solo campo de valor.
                </Typography>
                <Typography paragraph>
                  <b>¿Qué es una tupla?</b> Al igual que la dupla es una colección de registros con
                  una clave única y varios campos de valor.
                </Typography>
                <Typography paragraph>
                  <b>¿Qué tipos de archivos acepta el programa?</b> Solo acepta archivos de Excel
                  con extensión .xlsx y .xls, algún otro archivo causara error al subirlo.
                </Typography>
                <Typography paragraph>
                  <b>¿Qué características debe de tener el libro de Excel?</b> El libro solo deberá
                  de tener una sola hoja de trabajo, el rango donde deberá iniciar la información es
                  la celda A1, dependiendo del tipo de colección el número máximo de celdas tendrá
                  un límite, es decir si se elige la opción de tipo <b>dupla</b> el rango máximo de
                  columnas son <b>2</b>, la columna para el campo único (campo clave) y la columna
                  con la información a depurar (teléfono o email), si se elige la opción{' '}
                  <b>tupla</b> tiene un número máximo de <b>26</b>, la columna para el campo clave y
                  un máximo de 25 celdas para añadir la información. A partir de las
                  especificaciones anteriores se tiene claro las posibles causas de errores:
                </Typography>
                <ol>
                  <li>Más de una hoja en el libro de Excel</li>
                  <li>Un libro de Excel vacío</li>
                  <li>Un libro que no empiece la información en la celda A1</li>
                  <li>Una hoja de Excel que exceda las columnas permitidas</li>
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
