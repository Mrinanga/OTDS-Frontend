import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Alert,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip
} from '@mui/material';
import apiService from '../services/api.service';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AssignmentIcon from '@mui/icons-material/Assignment';
import '../styles/finalDestination.css';

const FinalDestinationPage = () => {
    const navigate = useNavigate();
    const [shipments, setShipments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showExecutiveModal, setShowExecutiveModal] = useState(false);
    const [selectedShipment, setSelectedShipment] = useState(null);
    const [executives, setExecutives] = useState([]);
    const [selectedExecutive, setSelectedExecutive] = useState('');
    const [currentBranchId, setCurrentBranchId] = useState(null);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        console.log('User data from localStorage:', user);
        
        if (user && user.branch && user.branch.branch_id) {
            console.log('Setting branch ID:', user.branch.branch_id);
            setCurrentBranchId(user.branch.branch_id);
            fetchShipments(user.branch.branch_id);
            fetchExecutives(user.branch.branch_id);
        } else {
            console.error('User or branch data not found:', user);
            setError('User branch information not found. Please log in again.');
            setLoading(false);
        }
    }, []);

    const fetchShipments = async (branchId) => {
        try {
            setLoading(true);
            console.log('Fetching shipments for branch:', branchId);
            const response = await apiService.getShipmentsByBranch(branchId);
            console.log('Shipments response:', response);
            
            if (response.data && response.data.success) {
                setShipments(response.data.data || []);
                setError('');
            } else {
                console.log('Error in response:', response.data);
                setShipments([]);
                setError(response.data.message || 'Failed to fetch shipments');
            }
        } catch (err) {
            console.error('Error fetching shipments:', err);
            setError('Failed to fetch shipments');
            setShipments([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchExecutives = async (branchId) => {
        try {
            console.log('Fetching executives for branch:', branchId);
            const response = await apiService.getAvailableExecutives(branchId);
            console.log('Executives response:', response);
            
            if (response.data && response.data.success) {
                if (response.data.data && response.data.data.length > 0) {
                    setExecutives(response.data.data);
                    setError('');
                } else {
                    setExecutives([]);
                    setError(response.data.message || 'No executives found for this branch');
                }
            } else {
                console.log('Error in response:', response.data);
                setExecutives([]);
                setError(response.data.message || 'Failed to fetch executives');
            }
        } catch (err) {
            console.error('Error fetching executives:', err);
            setError('Failed to fetch executives');
            setExecutives([]);
        }
    };

    const handleAssignAndOutForDelivery = async () => {
        try {
            if (!selectedShipment || !selectedExecutive) {
                setError('Please select a field executive');
                return;
            }

            setLoading(true);
            const response = await apiService.assignExecutiveAndOutForDelivery({
                executive_id: selectedExecutive,
                shipment_id: selectedShipment.shipment_id
            });

            if (response.data.success) {
                await fetchShipments(currentBranchId);
                setShowExecutiveModal(false);
                setSelectedExecutive('');
                setSelectedShipment(null);
                setError('');
            } else {
                throw new Error(response.data.message || 'Failed to assign executive');
            }
        } catch (err) {
            console.error('Error in assign and out for delivery:', err);
            setError(err.message || 'Failed to process request. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsDelivered = async (shipmentId) => {
        try {
            setLoading(true);
            const response = await apiService.updateToDelivered(shipmentId);
            if (response.data.success) {
                await fetchShipments(currentBranchId);
                setError('');
            } else {
                throw new Error(response.data.message || 'Failed to mark shipment as delivered');
            }
        } catch (err) {
            console.error('Error marking as delivered:', err);
            setError(err.message || 'Failed to mark shipment as delivered');
        } finally {
            setLoading(false);
        }
    };

    const openExecutiveModal = (shipment) => {
        setSelectedShipment(shipment);
        setShowExecutiveModal(true);
    };

    const closeExecutiveModal = () => {
        setShowExecutiveModal(false);
        setSelectedShipment(null);
        setSelectedExecutive('');
    };

    if (loading) {
        return (
            <Box className="loading-container">
                <CircularProgress className="loading-spinner" />
            </Box>
        );
    }

    return (
        <Box className="final-destination-container">
            <Typography variant="h4" className="page-title">
                Final Destination Management
            </Typography>

            {error && (
                <Box className="alert-container">
                    <Alert severity="error">
                        {error}
                    </Alert>
                </Box>
            )}

            {!loading && shipments.length === 0 ? (
                <Box className="empty-state">
                    <LocalShippingIcon className="empty-state-icon" />
                    <Typography className="empty-state-text">
                        No shipments found for this branch.
                    </Typography>
                </Box>
            ) : (
                <TableContainer component={Paper} className="shipments-table">
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Tracking #</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Origin</TableCell>
                                <TableCell>Destination</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Location</TableCell>
                                <TableCell>Delivery Date</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {shipments.map((shipment) => (
                                <TableRow key={shipment.id} className="shipment-row">
                                    <TableCell>{shipment.tracking_number}</TableCell>
                                    <TableCell>
                                        <Chip 
                                            label={shipment.status.replace('_', ' ')}
                                            className={`status-chip status-${shipment.status}`}
                                        />
                                    </TableCell>
                                    <TableCell>{shipment.origin_branch}</TableCell>
                                    <TableCell>{shipment.destination_branch}</TableCell>
                                    <TableCell>
                                        <Typography className="description-text">
                                            {shipment.description}
                                        </Typography>
                                        {shipment.special_instructions && (
                                            <Typography className="instructions-text">
                                                Instructions: {shipment.special_instructions}
                                            </Typography>
                                        )}
                                    </TableCell>
                                    <TableCell>{shipment.current_location}</TableCell>
                                    <TableCell>
                                        {new Date(shipment.estimated_delivery_date).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        {shipment.status === 'pending' && (
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() => openExecutiveModal(shipment)}
                                                className="action-button"
                                                startIcon={<AssignmentIcon />}
                                                size="small"
                                            >
                                                Assign Executive
                                            </Button>
                                        )}
                                        {shipment.status === 'out_for_delivery' && (
                                            <Button
                                                variant="contained"
                                                color="success"
                                                onClick={() => handleMarkAsDelivered(shipment.shipment_id)}
                                                className="action-button"
                                                startIcon={<LocalShippingIcon />}
                                                size="small"
                                            >
                                                Mark Delivered
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <Dialog 
                open={showExecutiveModal} 
                onClose={closeExecutiveModal}
                className="executive-modal"
            >
                <DialogTitle>
                    <AssignmentIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Assign Field Executive
                </DialogTitle>
                <DialogContent>
                    <FormControl fullWidth>
                        <InputLabel>Select Executive</InputLabel>
                        <Select
                            value={selectedExecutive}
                            onChange={(e) => setSelectedExecutive(e.target.value)}
                            label="Select Executive"
                        >
                            {executives.map((executive) => (
                                <MenuItem key={executive.id} value={executive.id}>
                                    {executive.name} - {executive.phone}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeExecutiveModal}>Cancel</Button>
                    <Button 
                        onClick={handleAssignAndOutForDelivery}
                        variant="contained"
                        color="primary"
                        disabled={!selectedExecutive}
                        startIcon={<AssignmentIcon />}
                    >
                        Assign & Make Out for Delivery
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default FinalDestinationPage;
