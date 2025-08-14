import { createContext, useContext, useState, useEffect } from 'react';
import { groupsAPI } from '../services/api';

const GroupContext = createContext();

export const useGroup = () => {
  const context = useContext(GroupContext);
  if (!context) {
    throw new Error('useGroup must be used within a GroupProvider');
  }
  return context;
};

export const GroupProvider = ({ children }) => {
  const [groups, setGroups] = useState([]);
  const [currentGroup, setCurrentGroup] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load user's groups on mount
  useEffect(() => {
    loadUserGroups();
  }, []);

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
    loadUserGroups,
    clearError,
  };

  return (
    <GroupContext.Provider value={value}>
      {children}
    </GroupContext.Provider>
  );
};
