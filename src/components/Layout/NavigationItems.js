// ▶ Import react dependecies
import React from 'react';

// ▶ Import material-ui icons
import { Help as HelpIcon, Storage as StorageIcon } from '@material-ui/icons';

const NavigationItems = [
  {
    to: '/',
    primary: 'Subir registros',
    icon: <StorageIcon />,
  },
  {
    to: '/faq',
    primary: 'F.A.Q.',
    icon: <HelpIcon />,
  },
];

export default NavigationItems;
