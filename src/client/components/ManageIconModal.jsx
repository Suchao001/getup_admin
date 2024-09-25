import React, { useState, useEffect } from 'react';
import CustomModal from './CustomModal';
import axios from 'axios';
import { HostName } from '../util/HostName';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import * as ficons from '@fortawesome/free-solid-svg-icons';
import {
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
  Grid,
  Paper,
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  margin: theme.spacing(2, 0),
}));

const IconPreview = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '150px',
  width: '100%',
  backgroundColor: theme.palette.grey[100],
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(2),
}));

const IconForm = ({ formClose, _icon, setIcons, isEdit }) => {
  const [icon, setIcon] = useState('');
  const [iconName, setIconName] = useState('');
  const [findIcon, setFindIcon] = useState('');
  const [iconId, setIconId] = useState('');
  const [iconCategory, setIconCategory] = useState([]);
  const [formValid, setFormValid] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (isEdit && _icon) {
      setIcon(_icon.nameTouse);
      setIconName(_icon.name);
      setIconId(_icon.category_id);
      setFindIcon(_icon.nameTouse);
      setFormValid(true);
    }
    
    const fetchIconCategory = async () => {
      try {
        const res = await axios.get(`${HostName}/api/admin/icon/category`);
        setIconCategory(res.data);
      } catch (error) {
        console.error('Error fetching icon categories:', error);
        setSnackbar({ open: true, message: 'Error fetching icon categories', severity: 'error' });
      }
    };
    fetchIconCategory();
  }, [_icon, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!icon || !ficons[findIcon]) {
      setSnackbar({ open: true, message: 'Please select a valid icon before submitting.', severity: 'error' });
      return;
    }

    try {
      const data = { name: iconName, nameTouse: icon, category_id: iconId };
      if (isEdit) {
        await axios.put(`${HostName}/api/admin/icon/${_icon.id}`, data, { withCredentials: true });
        setIcons((prevIcons) => prevIcons.map((i) => (i.id === _icon.id ? { ...i, ...data } : i)));
      } else {
        const res = await axios.post(`${HostName}/api/admin/icon`, data);
        setIcons((prevIcons) => [...prevIcons, res.data]);
      }
      setSnackbar({ open: true, message: `Icon successfully ${isEdit ? 'updated' : 'added'}`, severity: 'success' });
      formClose();
    } catch (error) {
      console.error('Error saving icon:', error);
      setSnackbar({ open: true, message: 'Error saving icon', severity: 'error' });
    }
  };

  const handleIconSearch = (e) => {
    e.preventDefault();
    if (ficons[findIcon]) {
      setIcon(findIcon);
      setFormValid(true);
    } else {
      setIcon('');
      setFormValid(false);
      setSnackbar({ open: true, message: 'Icon not found in Font Awesome', severity: 'warning' });
    }
  };

  return (
    <StyledPaper elevation={3}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <IconPreview>
              {icon ? (
                <FontAwesomeIcon icon={ficons[icon]} style={{ fontSize: '80px' }} />
              ) : (
                <Typography variant="body1" color="textSecondary">Icon not found</Typography>
              )}
            </IconPreview>
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" alignItems="center">
              <TextField
                fullWidth
                label="Find icon from FontAwesome"
                variant="outlined"
                value={findIcon}
                onChange={(e) => setFindIcon(e.target.value)}
              />
              <IconButton color="primary" onClick={handleIconSearch} sx={{ ml: 1 }}>
                <FontAwesomeIcon icon={faSearch} />
              </IconButton>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Icon Name"
              variant="outlined"
              value={iconName}
              onChange={(e) => setIconName(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="icon-category-label">Icon Category</InputLabel>
              <Select
                labelId="icon-category-label"
                id="icon-category"
                value={iconId}
                onChange={(e) => setIconId(e.target.value)}
                label="Icon Category"
              >
                {iconCategory.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.category_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={!formValid}
              size="large"
            >
              {isEdit ? 'Update Icon' : 'Add Icon'}
            </Button>
          </Grid>
        </Grid>
      </form>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </StyledPaper>
  );
};

function ManageIconModal({ open, onClose, icon, setIcons, icons, isEdit }) {
  return (
    <CustomModal
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit Icon" : "Add Icon"}
    >
      <IconForm
        formClose={onClose}
        _icon={icon}
        setIcons={setIcons}
        icons={icons}
        isEdit={isEdit}
      />
    </CustomModal>
  );
}

export default ManageIconModal;