import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const UserContext = createContext();

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

export const UserProvider = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load user details from localStorage when authentication state changes
        const loadUserDetails = () => {
            try {
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    const parsedUser = JSON.parse(storedUser);
                    setUserDetails(parsedUser);
                }
            } catch (error) {
                console.error('Error loading user details:', error);
            } finally {
                setLoading(false);
            }
        };

        if (isAuthenticated) {
            loadUserDetails();
        } else {
            setUserDetails(null);
            setLoading(false);
        }
    }, [isAuthenticated]);

    const updateUserDetails = (newDetails) => {
        try {
            const updatedDetails = { ...userDetails, ...newDetails };
            localStorage.setItem('user', JSON.stringify(updatedDetails));
            setUserDetails(updatedDetails);
            return true;
        } catch (error) {
            console.error('Error updating user details:', error);
            return false;
        }
    };

    const clearUserDetails = () => {
        try {
            localStorage.removeItem('user');
            setUserDetails(null);
            return true;
        } catch (error) {
            console.error('Error clearing user details:', error);
            return false;
        }
    };

    const value = {
        userDetails,
        loading,
        updateUserDetails,
        clearUserDetails,
        isAuthenticated
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
}; 