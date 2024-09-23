import React, { useState, useEffect } from 'react'
import CustomModal from './CustomModal'
import Button from '@mui/material/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import * as ficons from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { HostName } from '../util/HostName';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

const IconForm = ({ formClose, _icon, setIcons, isEdit }) => {
    const [icon, setIcon] = useState('');
    const [iconName, setIconName] = useState('');
    const [findIcon, setFindIcon] = useState('');
    const [iconId, setIconId] = useState('');
    const [iconCategory, setIconCategory] = useState([]);
    const [formValid, setFormValid] = useState(false);

    useEffect(() => {
        // Only set the initial values when editing
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
            }
        };
        fetchIconCategory();
    }, [_icon, isEdit]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!icon) {
            alert('Please select an icon before submitting.');
            return;
        }
        if (!ficons[findIcon]) {
            alert('Icon not found in Font Awesome');
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
            formClose();
        } catch (error) {
            console.error('Error saving icon:', error);
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
            alert('Icon not found in Font Awesome');
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    {icon ? (
                        <FontAwesomeIcon icon={ficons[icon]} style={{ fontSize: '100px' }} />
                    ) : (
                        'Icon not found'
                    )}
                </div>
                <TextField
                    label="Find icon from FontAwesome"
                    variant="outlined"
                    value={findIcon}
                    onChange={(e) => setFindIcon(e.target.value)}
                />
                <Button variant="contained" color="primary" onClick={handleIconSearch}>
                    <FontAwesomeIcon icon={faSearch} />
                    Search
                </Button>
                <br />
                <TextField
                    label="Icon Name"
                    variant="outlined"
                    value={iconName}
                    onChange={(e) => setIconName(e.target.value)}
                />
                <FormControl variant="outlined">
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
                <Button type="submit" variant="contained" color="primary" disabled={!formValid}>
                    {isEdit ? 'Update Icon' : 'Add Icon'}
                </Button>
            </form>
        </div>
    );
};

function ManageIconModal({ open, onClose, icon, setIcons, icons,isEdit }) {
    const handleClose = () => onClose();   

  return (
    <div>
        <CustomModal open={open} onClose={handleClose} title="Add Icon" >
            <IconForm formClose={handleClose} _icon={icon} setIcons={setIcons} icons={icons} isEdit={isEdit}/>
        </CustomModal>
    </div>
  )
}

export default ManageIconModal