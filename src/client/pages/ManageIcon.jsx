import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { HostName } from '../util/HostName';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as ficons from '@fortawesome/free-solid-svg-icons';
import Table from '@mui/material/Table';
import { TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, ButtonGroup, TextField, TablePagination } from '@mui/material';
import ManageIconModal from '../components/ManageIconModal';

function ManageIcon() {
    const [icons, setIcons] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [selectedIcon, setSelectedIcon] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    useEffect(() => {
        axios.get(`${HostName}/api/admin/icon`)
            .then((res) => {
              
                setIcons(res.data);
            })
            .catch((error) => {
                console.error('Error fetching icons:', error);
            });
    }, []);

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        setPage(0);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleEdit = (icon) => {
        console.log('Editing icon:', icon);
        setSelectedIcon(icon);
        setModalOpen(true);
        setIsEdit(true);
    };

    const handleDelete = async (name) => {
        try {
            console.log('Deleting icon with name:', name);
            await axios.delete(`${HostName}/api/admin/icon/name/${name}`, { withCredentials: true });
            setIcons(icons.filter(icon => icon.name !== name));
        } catch (error) {
            console.error('Error deleting icon:', error.response.data.message);
        }
    };

    const handleModalClose = () => {
        setSelectedIcon(null);
        setModalOpen(false);
    };

    const filteredIcons = icons.filter((icon) =>
        icon.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const paginatedIcons = filteredIcons.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1>Manage Icon</h1>
                <Button variant="contained" color="primary" onClick={() => setModalOpen(true)}>Add Icon</Button>
            </div>
            <TextField
                label="Search Icons"
                variant="outlined"
                value={searchQuery}
                onChange={handleSearchChange}
                fullWidth
                margin="normal"
            />
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Icon Name</TableCell>
                            <TableCell>Icon Name to Use</TableCell>
                            <TableCell>Icon</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedIcons.map((icon, index) => (
                            <TableRow key={index}>
                                <TableCell>{icon.name}</TableCell>
                                <TableCell>{icon.nameTouse}</TableCell>
                                <TableCell>
                                    <FontAwesomeIcon icon={ficons[icon.nameTouse]} />
                                </TableCell>
                                <TableCell>{icon.category_name}</TableCell>
                                <TableCell>
                                    <ButtonGroup>
                                        <Button variant="contained" sx={{ backgroundColor: '#fbb900', color: 'white', '&:hover': { backgroundColor: '#c79300' } }} onClick={() => handleEdit(icon)}>Edit</Button>
                                        <Button variant="contained" sx={{ backgroundColor: '#D50000', color: 'white', '&:hover': { backgroundColor: '#a20000' } }} onClick={() => handleDelete(icon.id)}>Delete</Button>
                                    </ButtonGroup>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                component="div"
                count={filteredIcons.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[10, 25, 50, 100]}
            />
            {modalOpen && (
                <ManageIconModal
                    open={modalOpen}
                    onClose={handleModalClose}
                    icon={selectedIcon}
                    setIcons={setIcons}
                    isEdit={isEdit}
                />
            )}
        </div>
    );
}

export default ManageIcon;