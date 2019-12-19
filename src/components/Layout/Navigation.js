// ▶ Import react dependecies
import React from 'react';
import PropTypes from 'prop-types';

// ▶ Import material-ui components
import { Link as RouterLink } from 'react-router-dom';
import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';

// ▶ Import NavigationItems
import NavigationItems from './NavigationItems';

const Link = React.forwardRef((props, ref) => <RouterLink {...props} innerRef={ref} />);

function ListItemLink(props) {
  const { primary, to, icon } = props;
  return (
    <li>
      <ListItem button component={Link} to={to}>
        {icon && <ListItemIcon>{icon}</ListItemIcon>}
        <ListItemText primary={primary} />
      </ListItem>
    </li>
  );
}

ListItemLink.propTypes = {
  icon: PropTypes.node.isRequired,
  primary: PropTypes.node.isRequired,
  to: PropTypes.string.isRequired,
};

const Navigation = () => {
  return (
    <React.Fragment key="navigation">
      {NavigationItems.map((item, index) => (
        <ListItemLink key={index.toString()} to={item.to} primary={item.primary} icon={item.icon} />
      ))}
    </React.Fragment>
  );
};

export default Navigation;
