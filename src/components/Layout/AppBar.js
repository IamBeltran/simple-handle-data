// ▶ Import react dependencies
import React from 'react';
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
import { useAuthConsumer } from '../../context/AuthContext';

const MyAppBar = props => {
  const titleProyect = 'SIMPLE HANDLE DATA';
  const { classes, handleDrawerOpen, open, toggleTheme } = props;
  const { user, logout } = useAuthConsumer();

  const doLogout = () => {
    logout();
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
            onClick={doLogout}
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
