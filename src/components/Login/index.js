// ▶ Import react dependecies
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

// ▶ Import material-ui components
import { makeStyles } from '@material-ui/core/styles';
import {
  Avatar,
  Button,
  Chip,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
} from '@material-ui/core';

// ▶ Import material-ui icons
import { LockOutlined as LockOutlinedIcon } from '@material-ui/icons/';

// ▶ Import AuthContext
import { useAuthConsumer } from '../../context/AuthContext';

// ▶ Make styles
const useStyles = makeStyles(theme => ({
  container: {
    padding: theme.spacing(0),
  },
  paper: {
    padding: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: '100vh',
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
    margin: theme.spacing(2),
  },
}));

const SignInForm = props => {
  const classes = useStyles();
  const { login, loginError, clearLoginError } = useAuthConsumer();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = event => {
    event.preventDefault();
    const { history } = props;
    login(email, password).then(() => {
      history.push('/');
    });
  };

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
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            {loginError && (
              <Chip
                label={loginError}
                variant="outlined"
                onDelete={onDelete}
                className={classes.chip}
                color="secondary"
              />
            )}
            <form className={classes.form} onSubmit={onSubmit} noValidate autoComplete="off">
              <TextField
                color="secondary"
                variant="outlined"
                margin="normal"
                name="email"
                label="Email Address"
                type="text"
                id="email"
                autoComplete="email"
                fullWidth
                required
                autoFocus
                value={email}
                onChange={event => setEmail(event.target.value)}
              />
              <TextField
                color="secondary"
                variant="outlined"
                margin="normal"
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                fullWidth
                required
                onChange={event => setPassword(event.target.value)}
                value={password}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="secondary"
                disabled={isDisabled}
                className={classes.submit}
              >
                Sign In
              </Button>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

SignInForm.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
};

export default withRouter(SignInForm);
