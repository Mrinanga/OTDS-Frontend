import React, { useState } from 'react';
import { 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions, 
    Button, 
    TextField,
    Typography,
    Box,
    IconButton
} from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import CloseIcon from '@mui/icons-material/Close';
import whatsappService from '../services/whatsappService';

const WhatsAppNotification = ({ open, onClose, bookingData }) => {
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSend = async () => {
        if (!message.trim()) return;

        setLoading(true);
        setError(null);

        try {
            // Format the message with booking details
            const formattedMessage = `
*Booking Update - ${bookingData.booking_number}*
${message}

Tracking Number: ${bookingData.booking_number}
Status: ${bookingData.status}
Service Type: ${bookingData.service_type}

Thank you for choosing our service!
            `.trim();

            await whatsappService.sendMessage(bookingData.customer_phone, formattedMessage);
            onClose();
        } catch (err) {
            setError('Failed to send WhatsApp message. Please try again.');
            console.error('WhatsApp message error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box display="flex" alignItems="center">
                        <WhatsAppIcon sx={{ mr: 1, color: '#25D366' }} />
                        <Typography variant="h6">Send WhatsApp Notification</Typography>
                    </Box>
                    <IconButton onClick={onClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>
            <DialogContent>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                    Send a WhatsApp message to customer: {bookingData?.customer_name}
                </Typography>
                <TextField
                    fullWidth
                    multiline
                    rows={4}
                    variant="outlined"
                    label="Message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    margin="normal"
                    error={!!error}
                    helperText={error}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button 
                    onClick={handleSend} 
                    variant="contained" 
                    color="primary"
                    disabled={loading || !message.trim()}
                    startIcon={<WhatsAppIcon />}
                >
                    {loading ? 'Sending...' : 'Send Message'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default WhatsAppNotification; 