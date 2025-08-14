import { useAuth } from '../contexts/AuthContext';
import { useGroup } from '../contexts/GroupContext';

export const useLogout = () => {
  const { logout: authLogout } = useAuth();
  const { clearGroups } = useGroup();

  const logout = () => {
    // Clear groups first
    clearGroups();
    // Then logout
    authLogout();
  };

  return { logout };
};
