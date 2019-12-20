// ▶ Import react dependecies
import React, { useState } from 'react';

// ▶ Import material-ui components
import { CssBaseline } from '@material-ui/core/';
import { makeStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

// ▶ Import components
import AppBar from './AppBar';
import Drawer from './Drawer';

// ▶ Import ReactRouter
import ReactRouter from '../../containers/ReactRouter';

// ▶ Make styles
const drawerWidth = 240;

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
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    overflow: 'auto',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
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
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  hide: {
    display: 'none',
  },
  menuButton: {
    marginRight: 36,
  },
  title: {
    flexGrow: 1,
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 3),
    ...theme.mixins.toolbar,
  },
}));

const Layout = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState({
    palette: {
      primary: {
        main: '#eceff1',
      },
      secondary: {
        main: '#43a047',
      },
      type: 'light',
    },
  });

  // » We change the palette type of the theme in state
  const toggleTheme = () => {
    const NEW_TYPE = theme.palette.type === 'light' ? 'dark' : 'light';
    setTheme({
      palette: {
        primary: {
          main: '#eceff1',
        },
        secondary: {
          main: '#43a047',
        },
        type: NEW_TYPE,
      },
    });
  };

  // » We generate a MUI-theme from state's theme object
  const muiTheme = createMuiTheme(theme);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <MuiThemeProvider theme={muiTheme}>
      <div className={classes.root}>
        <CssBaseline />
        {/* SECTION MyAppBar */}
        <AppBar
          classes={classes}
          handleDrawerOpen={handleDrawerOpen}
          toggleTheme={toggleTheme}
          open={open}
        />
        {/* !SECTION */}

        {/* SECTION MyDrawer */}
        <Drawer classes={classes} handleDrawerClose={handleDrawerClose} open={open} />
        {/* !SECTION */}

        {/* SECTION main */}
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />

          {/* SECTION ReactRouter */}
          <ReactRouter />
          {/* !SECTION */}
        </main>
        {/* !SECTION */}
      </div>
    </MuiThemeProvider>
  );
};

export default Layout;
