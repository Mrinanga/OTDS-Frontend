import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

export const UserProvider = ({ children }) => {
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load user details from localStorage when component mounts
        const loadUserDetails = () => {
            try {
                console.log('Loading user details from localStorage...');
                const storedUser = localStorage.getItem('user');
                console.log('Stored user data:', storedUser);
                
                if (storedUser) {
                    const parsedUser = JSON.parse(storedUser);
                    console.log('Parsed user data:', parsedUser);
                    setUserDetails(parsedUser);
                } else {
                    console.log('No user data found in localStorage');
                    setUserDetails(null);
                }
            } catch (error) {
                console.error('Error loading user details:', error);
                setUserDetails(null);
            } finally {
                setLoading(false);
            }
        };

        // Load user details on mount
        loadUserDetails();
    }, []);

    const updateUserDetails = (newDetails) => {
        try {
            console.log('Updating user details:', newDetails);
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
            console.log('Clearing user details');
            localStorage.removeItem('user');
            setUserDetails(null);
            return true;
        } catch (error) {
            console.error('Error clearing user details:', error);
            return false;
        }
    };

    // Log current state
    useEffect(() => {
        console.log('UserContext State:', {
            userDetails,
            loading
        });
    }, [userDetails, loading]);

    const value = {
        userDetails,
        loading,
        updateUserDetails,
        clearUserDetails,
        branchInfo: userDetails?.branch
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
}; 