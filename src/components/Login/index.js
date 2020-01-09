// ▶ Import react dependecies
import React, { useState, useEffect } from 'react';

// ▶ Import material-ui components
import { makeStyles } from '@material-ui/core/styles';
import {
  Avatar,
  Button,
  Chip,
  Container,
  Divider,
  Grid,
  Paper,
  TextField,
  Typography,
} from '@material-ui/core';

// ▶ Import material-ui icons
import { LockOutlined as LockOutlinedIcon } from '@material-ui/icons/';

// ▶ Import AuthContext
import { useAuthConsumer } from '../../context/AuthContext';

// ▶ Import Hooks
import useRouter from '../../hooks/useRouter';

// ▶ Make styles
const useStyles = makeStyles(theme => ({
  container: {
    padding: theme.spacing(0),
  },
  divider: {
    marginTop: theme.spacing(2),
  },
  paper: {
    padding: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: '80vh',
    color: theme.palette.text.primary,
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  chip: {
    margin: theme.spacing(0),
    width: '100%',
  },
}));

const SignInForm = () => {
  const classes = useStyles();
  const router = useRouter();
  const { user, login, loginError, clearLoginError } = useAuthConsumer();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submit = event => {
    event.preventDefault();
    login(email, password);
  };

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const onDelete = () => {
    setEmail('');
    setPassword('');
    clearLoginError();
  };

  const isDisabled = password === '' || email === '';
  return (
    <Container maxWidth="lg" className={classes.container}>
      <Grid container direction="column">
        <Grid item>
          <Paper className={classes.paper}>
            <Grid container direction="column" justify="center" alignItems="stretch" spacing={0}>
              <Grid item xs={12} sm={12} align="center">
                <Avatar className={classes.avatar}>
                  <LockOutlinedIcon />
                </Avatar>
              </Grid>
              <Grid item xs={12} sm={12} align="center">
                <Typography component="h1" variant="h5">
                  Iniciar sesión
                </Typography>
              </Grid>
              {loginError && (
                <Grid item xs={12} sm={12} align="center">
                  <Chip
                    color="secondary"
                    variant="outlined"
                    onDelete={onDelete}
                    className={classes.chip}
                    label={loginError}
                  />
                </Grid>
              )}
              <Divider className={classes.divider} />
            </Grid>
            <form className={classes.form} onSubmit={submit} noValidate autoComplete="off">
              <Grid container spacing={1}>
                <Grid item xs={12} sm={12}>
                  <TextField
                    color="secondary"
                    variant="outlined"
                    margin="normal"
                    name="email"
                    label="Correo electrónico"
                    type="text"
                    id="email"
                    autoComplete="email"
                    fullWidth
                    required
                    autoFocus
                    value={email}
                    onChange={event => setEmail(event.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <TextField
                    color="secondary"
                    variant="outlined"
                    margin="normal"
                    name="password"
                    label="Contraseña"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    fullWidth
                    required
                    onChange={event => setPassword(event.target.value)}
                    value={password}
                  />
                </Grid>
              </Grid>
              <Divider className={classes.divider} />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="secondary"
                    disabled={isDisabled}
                    className={classes.submit}
                  >
                    Iniciar sesión
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SignInForm;
