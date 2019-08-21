import React from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { Storage as StorageIcon, Help as HelpIcon } from '@material-ui/icons';

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
      <ListItemLink to="/" primary="Subir registros" icon={<StorageIcon />} />
      <ListItemLink to="/faq" primary="F.A.Q." icon={<HelpIcon />} />
    </React.Fragment>
  );
};

export default Navigation;
