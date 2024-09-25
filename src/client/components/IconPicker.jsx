import React, { useEffect } from 'react';
import { Popover, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as ficons from '@fortawesome/free-solid-svg-icons'; 
import axios from 'axios';
import { HostName } from '../util/HostName';

const IconPicker = ({ icon, onSelectIcon, onSelectIconId }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [icons, setIcons] = React.useState([]);

  useEffect(() => {
    const fetchIcons = async () => {
      try {
        const response = await axios.get(`${HostName}/api/admin/icon`);
        setIcons(response.data);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchIcons();
  }, []);

  const handleIconClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleIconSelect = (selectedIcon, selectedIconId) => {
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
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        PaperProps={{
          style: {
            maxWidth: '800px',
            maxHeight: '300px',
            overflow: 'auto',
          },
        }}
      >
        <div style={{ padding: '10px', display: 'flex', flexWrap: 'wrap' }}>
          {icons.map((iconItem) => {
            const IconComponent = ficons[iconItem.nameTouse];
            return (
              <IconButton key={iconItem.id} onClick={() => handleIconSelect(iconItem.nameTouse, iconItem.id)}>
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
