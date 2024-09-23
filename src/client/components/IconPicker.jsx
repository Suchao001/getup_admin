import React from 'react';
import { Popover, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as ficons from '@fortawesome/free-solid-svg-icons'; 

const IconPicker = ({ icons, icon, onSelectIcon,onSelectIconId }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleIconClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleIconSelect = (selectedIcon,selectedIconId) => {
    onSelectIcon(selectedIcon);
    onSelectIconId(selectedIconId);
    setAnchorEl(null);
  };


  return (
    <div>
      <IconButton color="primary" onClick={handleIconClick}>
        <EditIcon />
      </IconButton>
      <Popover
        style={{ maxWidth: '800px' }}
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <div className="p-2">
          {icons.map((iconItem) => {
            const IconComponent = ficons[iconItem.nameTouse];
            return (
              <IconButton key={iconItem.id} onClick={() => handleIconSelect(iconItem.nameTouse,iconItem.id)}>
                <FontAwesomeIcon icon={IconComponent} /> 
              </IconButton>
            );
          })}
        </div>
      </Popover>
    </div>
  );
};

export default IconPicker;
