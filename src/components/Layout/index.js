import React, { useState } from 'react';
import clsx from 'clsx';
import { makeStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { AppBar, CssBaseline } from '@material-ui/core/';

import ToolBar from './ToolBar';
import Drawer from './Drawer';
import ReactRouter from '../../containers/ReactRouter';

import themes from './themes.json';

const drawerWidth = 240;

const { defaultTheme, darkTheme } = themes;
const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  title: {
    flexGrow: 1,
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));
const Layout = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState('default');

  // we change the palette type of the theme in state
  const toggleTheme = () => {
    const newTheme = theme === 'default' ? 'dark' : 'default';
    setTheme(newTheme);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  let muiTheme;

  // we generate a MUI-theme from state's theme object
  switch (theme) {
    case 'default':
      muiTheme = createMuiTheme({
        palette: defaultTheme.palette,
        themeName: defaultTheme.themeName,
      });
      break;
    case 'dark':
      muiTheme = createMuiTheme({
        palette: darkTheme.palette,
        themeName: darkTheme.themeName,
      });
      break;
    default:
      muiTheme = createMuiTheme();
      break;
  }

  return (
    <React.Fragment key="layout">
      <MuiThemeProvider theme={muiTheme}>
        <div className={classes.root}>
          <CssBaseline />
          <AppBar
            position="fixed"
            className={clsx(classes.appBar, {
              [classes.appBarShift]: open,
            })}
          >
            <ToolBar
              classes={classes}
              open={open}
              handleDrawerOpen={handleDrawerOpen}
              toggleTheme={toggleTheme}
            />
          </AppBar>
          <Drawer classes={classes} open={open} handleDrawerClose={handleDrawerClose} />
          <main className={classes.content}>
            <div className={classes.toolbar} />
            <div className={classes.appBarSpacer} />
            {/* SECTION ReactRouter */}
            <ReactRouter />
            {/* !SECTION ReactRouter */}
          </main>
        </div>
      </MuiThemeProvider>
    </React.Fragment>
  );
};

export default Layout;
