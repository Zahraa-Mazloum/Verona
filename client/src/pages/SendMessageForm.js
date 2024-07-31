import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import api from '../api/axios';
import { ToastContainer, toast } from 'react-toastify';

const SendMessageForm = () => {
    const [subject, setSubject] = useState(''); 
    const [message, setMessage] = useState('');
    const investorId = localStorage.getItem('id');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post(`/investors/newmessage/${investorId}`, {
                subject,
                message,
            });
            toast.success("Message sent successfully!", {
                position: "top-right",
                autoClose: 3000,
                closeOnClick: true,
            });
            setSubject('');
            setMessage('');
        } catch (error) {
            toast.error("Failed to send message.", {
                position: "top-right",
                autoClose: 3000,
                closeOnClick: true,
            });
        }
    };

    return (
        <Box
            component="form"
            sx={{
                maxWidth: 500,
                mx: 'auto',
                p: 3,
                bgcolor: '#f5f5f5',
                borderRadius: 1,
                boxShadow: 2,
                mt: 4
            }}
            onSubmit={handleSubmit}
        >
            <Typography variant="h5" gutterBottom>Send Message to Admin</Typography>
            <TextField
                label="Subject"
                variant="outlined"
                fullWidth
                required
                margin="normal"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
            />
            <TextField
                label="Message"
                variant="outlined"
                fullWidth
                required
                margin="normal"
                multiline
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <Button
                type="submit"
                variant="contained"
                sx={{
                    mt: 2,
                    backgroundColor: '#d25716',
                    '&:hover': {
                        backgroundColor: '#b04e13',
                    },
                }}
                fullWidth
            >
                Send Message
            </Button>
            <ToastContainer />
        </Box>
    );
};

export default SendMessageForm;
