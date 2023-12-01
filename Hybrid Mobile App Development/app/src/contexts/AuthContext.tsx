import { createContext, ReactNode, useEffect, useState } from 'react';
import { UserDTO } from '@dtos/UserDTO';
import { api } from '@services/api';
import {
  storageUserGet,
  storageUserRemove,
  storageUserSave,
} from '@storage/storageUser';

// Type import 
import { IFeedback } from 'src/interfaces/IFeedback';

export type AuthContextDataProps = {
  user: UserDTO;
  userFeedbacks: IFeedback[];
  updateUserProfile: () => Promise<void>;
  fetchUserFeedback: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isLoadingUserStorageData: boolean;
};

type AuthContextProviderProps = {
  children: ReactNode;
};

const AuthContext = createContext<AuthContextDataProps>(
  {} as AuthContextDataProps
);

function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState<UserDTO>({} as UserDTO);
  const [userFeedbacks, setUserFeedbacks] = useState<IFeedback[]>([]);
  const [isLoadingUserStorageData, setIsLoadingUserStorageData] =
    useState(true);

  async function signIn(email: string, password: string) {
    try {
      console.log("** data login: ", email, password)
      const { data } = await api.post('/login', { email, senha: password });


      await storageUserSave(data);
      setUser(data);
    } catch (error) {
      throw error;
    }
  }

  async function signOut() {
    try {
      setIsLoadingUserStorageData(true);

      setUser({} as UserDTO);
      return await storageUserRemove();
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingUserStorageData(false);
    }
  }

  async function updateUserProfile() {
    try {
      const { data } = await api.get('/users/me');
      setUser(data);
      await storageUserSave(data);
    } catch (error) {
      throw error;
    }
  }

  async function fetchUserFeedback() {
    try {
      const { data } = await api.get('/users/products');
      setUserFeedbacks(
        data.map((item: IFeedback) => data)
      );
    } catch (error) {
      throw error;
    }
  }

  async function loadUserData() {
    try {
      setIsLoadingUserStorageData(true);

      const userLogged = await storageUserGet();

      if (userLogged) return setUser(userLogged);
    
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingUserStorageData(false);
      setUser({} as UserDTO);
    }
  }

  useEffect(() => {
    loadUserData();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        userFeedbacks,
        updateUserProfile,
        fetchUserFeedback,
        signIn,
        signOut,
        isLoadingUserStorageData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthContextProvider };
