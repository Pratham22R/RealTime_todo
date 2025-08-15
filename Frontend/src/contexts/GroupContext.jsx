import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from "../contexts/AuthContext";
import { groupsAPI } from '../services/api';
const GroupContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useGroup = () => {
  const context = useContext(GroupContext);
  if (!context) {
    throw new Error('useGroup must be used within a GroupProvider');
  }
  return context;
};

export const GroupProvider = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const [groups, setGroups] = useState([]);
  const [currentGroup, setCurrentGroup] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load user's groups on mount

  useEffect(() => {
    if (!authLoading && user) {
      loadUserGroups();
    }
  }, [authLoading, user]);

  const loadUserGroups = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await groupsAPI.getMyGroups();
      setGroups(response.data);

      // Set first group as current if no current group is set
      if (response.data.length > 0 && !currentGroup) {
        setCurrentGroup(response.data[0]);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load groups');
      console.error('Error loading groups:', err);
    } finally {
      setLoading(false);
    }
  };

  const createGroup = async (groupData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await groupsAPI.create(groupData);
      const newGroup = response.data;

      setGroups(prev => [...prev, newGroup]);
      setCurrentGroup(newGroup);

      return newGroup;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create group');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const joinGroup = async (token) => {
    try {
      setLoading(true);
      setError(null);
      const response = await groupsAPI.join(token);
      const joinedGroup = response.data;

      // Check if group already exists in user's groups
      const exists = groups.find(g => g._id === joinedGroup._id);
      if (!exists) {
        setGroups(prev => [...prev, joinedGroup]);
      }

      setCurrentGroup(joinedGroup);
      return joinedGroup;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to join group');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const selectGroup = (group) => {
    setCurrentGroup(group);
  };

  const leaveGroup = async (groupId) => {
    try {
      setLoading(true);
      setError(null);
      console.log('leaveGroup called with groupId:', groupId);
      const response = await groupsAPI.leave(groupId);
      console.log('leaveGroup API response:', response);
      // Remove group from user's groups
      setGroups(prev => prev.filter(g => g._id !== groupId));
      // If leaving current group, select another group or clear current
      if (currentGroup?._id === groupId) {
        const remainingGroups = groups.filter(g => g._id !== groupId);
        setCurrentGroup(remainingGroups.length > 0 ? remainingGroups[0] : null);
      }
      return true;
    } catch (err) {
      console.error('leaveGroup error:', err);
      setError(err.response?.data?.error || 'Failed to leave group');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearGroups = () => {
    setGroups([]);
    setCurrentGroup(null);
    setError(null);
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    groups,
    currentGroup,
    loading,
    error,
    createGroup,
    joinGroup,
    selectGroup,
    leaveGroup,
    loadUserGroups,
    clearGroups,
    clearError,
  };

  return (
    <GroupContext.Provider value={value}>
      {children}
    </GroupContext.Provider>
  );
};
