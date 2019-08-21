import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import {
  Typography,
  Container,
  Paper,
  Grid,
  Avatar,
  Button,
  TextField,
  Chip,
} from '@material-ui/core/';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { makeStyles } from '@material-ui/core/styles';

import { AuthContext } from '../../context/AuthContext';
import { doSignInWithEmailAndPassword } from '../../libs/Firebase';

const styles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(4),
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

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};

const SignInForm = props => {
  const classes = styles();
  const { dispatch } = useContext(AuthContext);
  const [state, setState] = useState(INITIAL_STATE);

  const onChange = event => {
    const { target } = event;
    const { value } = target;
    const { name } = target;
    setState({
      ...state,
      [name]: value,
    });
  };

  const onSubmit = event => {
    event.preventDefault();
    const { history } = props;
    const { email, password } = state;
    doSignInWithEmailAndPassword(email, password)
      .then(user => {
        dispatch({ type: 'SIGN_IN', payload: user });
        history.push('/');
      })
      .catch(error => {
        setState({ ...state, error });
      });
  };

  const onDelete = () => {
    setState({ ...INITIAL_STATE });
  };
  const { email, password, error } = state;
  const isInvalid = password === '' || email === '';
  return (
    <Container component="main" maxWidth="lg">
      <Grid container direction="column" justify="center" spacing={2}>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            {error && (
              <Chip
                label={error}
                variant="outlined"
                onDelete={onDelete}
                className={classes.chip}
                color="secondary"
              />
            )}
            <form className={classes.form} onSubmit={onSubmit} noValidate>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                value={email}
                autoComplete="email"
                onChange={onChange}
                autoFocus
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                value={password}
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={onChange}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="secondary"
                disabled={isInvalid}
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
