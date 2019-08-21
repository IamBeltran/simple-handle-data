import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Toolbar, IconButton, Typography } from '@material-ui/core/';
import {
  Menu as MenuIcon,
  InvertColors as InvertColorsIcon,
  AccountCircle as AccountCircleIcon,
} from '@material-ui/icons/';

import { AuthContext } from '../../context/AuthContext';

const MyToolbar = ({ classes, open, handleDrawerOpen, toggleTheme }) => {
  const { state, dispatch } = useContext(AuthContext);
  const { user } = state;
  const signOut = () => dispatch({ type: 'SIGN_OUT' });

  return (
    <Toolbar className={classes.toolbar}>
      {user ? (
        <IconButton
          edge="start"
          color="inherit"
          aria-label="Abrir cajón"
          title="Abrir cajón"
          onClick={handleDrawerOpen}
          className={clsx(classes.menuButton, {
            [classes.hide]: open,
          })}
        >
          <MenuIcon />
        </IconButton>
      ) : null}
      <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
        SIMPLE HANDLE DATA
      </Typography>
      {user ? (
        <IconButton
          color="inherit"
          aria-label="Cerrar sesión"
          title="Cerrar sesión"
          onClick={signOut}
        >
          <AccountCircleIcon />
        </IconButton>
      ) : null}
      <IconButton
        color="inherit"
        aria-label="Cambiar de tema"
        title="Cambiar de tema"
        onClick={toggleTheme}
      >
        <InvertColorsIcon />
      </IconButton>
    </Toolbar>
  );
};

MyToolbar.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  open: PropTypes.bool.isRequired,
  handleDrawerOpen: PropTypes.func.isRequired,
  toggleTheme: PropTypes.func.isRequired,
};

export default MyToolbar;
