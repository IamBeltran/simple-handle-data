import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Drawer, IconButton, Divider, List } from '@material-ui/core/';
import { ChevronLeft as ChevronLeftIcon } from '@material-ui/icons/';

import Navigation from './Navigation';
import { AuthContext } from '../../context/AuthContext';

const MyDrawer = ({ classes, open, handleDrawerClose }) => {
  const { state } = useContext(AuthContext);
  const { user } = state;
  return (
    <React.Fragment key="drawer">
      {user ? (
        <Drawer
          variant="permanent"
          className={clsx(classes.drawer, {
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          })}
          classes={{
            paper: clsx({
              [classes.drawerOpen]: open,
              [classes.drawerClose]: !open,
            }),
          }}
          open={open}
        >
          <div className={classes.toolbarIcon}>
            <IconButton onClick={handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          </div>
          <Divider />
          <List component="nav" aria-label="Menú">
            <Navigation />
          </List>
        </Drawer>
      ) : null}
    </React.Fragment>
  );
};

MyDrawer.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  open: PropTypes.bool.isRequired,
  handleDrawerClose: PropTypes.func.isRequired,
};

export default MyDrawer;
