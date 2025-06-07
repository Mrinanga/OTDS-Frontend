import React, { useState, useContext } from 'react';
import { Container, Paper, Typography, Box, CircularProgress, Alert, Tabs, Tab, Divider } from '@mui/material';
import { AuthContext } from '../App';
import ProfileSettings from '../components/Settings/ProfileSettings';
import BranchOfficeSettings from '../components/Settings/BranchOfficeSettings';
import PreferencesSettings from '../components/Settings/PreferencesSettings';
import NotificationSettings from '../components/Settings/NotificationSettings';
import SecuritySettings from '../components/Settings/SecuritySettings';
import SystemSettings from '../components/Settings/SystemSettings';
import UsersSettings from '../components/Settings/UsersSettings';

const SettingsPage = () => {
    const { isAuthenticated } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const renderActiveTab = () => {
        switch (activeTab) {
            case 0:
                return <ProfileSettings />;
            case 1:
                return <BranchOfficeSettings />;
            case 2:
                return <PreferencesSettings />;
            case 3:
                return <NotificationSettings />;
            case 4:
                return <SecuritySettings />;
            case 5:
                return <SystemSettings />;
            case 6:
                return <UsersSettings />;
            default:
                return <ProfileSettings />;
        }
    };

    if (!isAuthenticated) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Alert severity="error">Please log in to access settings.</Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Paper sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Settings
                </Typography>
                <Divider sx={{ mb: 3 }} />
                
                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                    <Tabs 
                        value={activeTab} 
                        onChange={handleTabChange}
                        variant="scrollable"
                        scrollButtons="auto"
                    >
                        <Tab label="Profile" />
                        <Tab label="Branch Offices" />
                        <Tab label="Preferences" />
                        <Tab label="Notifications" />
                        <Tab label="Security" />
                        <Tab label="System" />
                        <Tab label="Users" />
                    </Tabs>
                </Box>

                {loading ? (
                    <Box display="flex" justifyContent="center" my={4}>
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
                ) : (
                    renderActiveTab()
                )}
            </Paper>
        </Container>
    );
};

export default SettingsPage;
