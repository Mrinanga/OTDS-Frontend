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

// Test function to verify localStorage data
const testLocalStorageData = () => {
    try {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');
        
        console.log('=== LocalStorage Test ===');
        console.log('Token exists:', !!storedToken);
        console.log('User data exists:', !!storedUser);
        
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            console.log('Parsed user data:', parsedUser);
            console.log('User ID:', parsedUser.user_id);
            console.log('User Role:', parsedUser.role);
            console.log('Branch data:', parsedUser.branch);
            return parsedUser;
        }
        return null;
    } catch (error) {
        console.error('Error testing localStorage:', error);
        return null;
    }
};

export const UserProvider = ({ children }) => {
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user: authUser, isAuthenticated } = useAuth();

    useEffect(() => {
        // Test localStorage data on mount
        testLocalStorageData();
        
        // Load user details from localStorage when component mounts
        const loadUserDetails = () => {
            try {
                console.log('UserContext: Loading user details from localStorage...');
                const storedUser = localStorage.getItem('user');
                console.log('UserContext: Stored user data:', storedUser);
                
                if (storedUser) {
                    const parsedUser = JSON.parse(storedUser);
                    console.log('UserContext: Parsed user data:', parsedUser);
                    setUserDetails(parsedUser);
                } else {
                    console.log('UserContext: No user data found in localStorage');
                    setUserDetails(null);
                }
            } catch (error) {
                console.error('UserContext: Error loading user details:', error);
                setUserDetails(null);
            } finally {
                setLoading(false);
            }
        };

        // Load user details on mount
        loadUserDetails();
    }, []);

    // Sync with AuthContext user data
    useEffect(() => {
        if (authUser && isAuthenticated) {
            console.log('UserContext: Syncing with AuthContext user data:', authUser);
            setUserDetails(authUser);
            // Also update localStorage to ensure consistency
            localStorage.setItem('user', JSON.stringify(authUser));
        } else if (!isAuthenticated) {
            console.log('UserContext: User not authenticated, clearing user details');
            setUserDetails(null);
        }
    }, [authUser, isAuthenticated]);

    const updateUserDetails = (newDetails) => {
        try {
            console.log('UserContext: Updating user details:', newDetails);
            const updatedDetails = { ...userDetails, ...newDetails };
            localStorage.setItem('user', JSON.stringify(updatedDetails));
            setUserDetails(updatedDetails);
            return true;
        } catch (error) {
            console.error('UserContext: Error updating user details:', error);
            return false;
        }
    };

    const clearUserDetails = () => {
        try {
            console.log('UserContext: Clearing user details');
            localStorage.removeItem('user');
            setUserDetails(null);
            return true;
        } catch (error) {
            console.error('UserContext: Error clearing user details:', error);
            return false;
        }
    };

    // Log current state
    useEffect(() => {
        console.log('UserContext State:', {
            userDetails,
            loading,
            authUser,
            isAuthenticated
        });
    }, [userDetails, loading, authUser, isAuthenticated]);

    const value = {
        userDetails,
        loading,
        updateUserDetails,
        clearUserDetails,
        branchInfo: userDetails?.branch,
        // Provide direct access to user data for convenience
        user: userDetails,
        isAuthenticated: !!userDetails
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
}; 