// ▶ Import react dependencies
import React, { useContext } from 'react';
import PropTypes from 'prop-types';

// ▶ Import clx dependency
import clsx from 'clsx';

// ▶ Import material-ui components
import { AppBar, IconButton, Toolbar, Typography } from '@material-ui/core';

// ▶ Import material-ui icons
import {
  InvertColors as InvertColorsIcon,
  Menu as MenuIcon,
  AccountCircle as AccountCircleIcon,
} from '@material-ui/icons/';

// ▶ Import AuthContext
import { AuthContext } from '../../context/AuthContext';

// ▶ Import Firebase
import { doSignOut } from '../../lib/Firebase';

const MyAppBar = props => {
  const titleProyect = 'SIMPLE HANDLE DATA';
  const { classes, handleDrawerOpen, open, toggleTheme } = props;
  const { state, dispatch } = useContext(AuthContext);
  const { user } = state;
  const signOut = () => {
    doSignOut().then(() => {
      dispatch({ type: 'SIGN_OUT', payload: null });
    });
  };
  return (
    <AppBar
      position="fixed"
      className={clsx(classes.appBar, {
        [classes.appBarShift]: open,
      })}
    >
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
          {titleProyect}
        </Typography>
        <IconButton
          color="inherit"
          aria-label="Cambiar de tema"
          title="Cambiar de tema"
          onClick={toggleTheme}
        >
          <InvertColorsIcon />
        </IconButton>
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
      </Toolbar>
    </AppBar>
  );
};

MyAppBar.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  open: PropTypes.bool.isRequired,
  handleDrawerOpen: PropTypes.func.isRequired,
  toggleTheme: PropTypes.func.isRequired,
};

export default MyAppBar;
