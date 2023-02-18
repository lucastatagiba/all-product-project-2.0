import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { useRouter } from 'next/router';
import { useToast } from '@chakra-ui/react';
import {
  getAuthCookie,
  IAuthState,
  removeAuthCookie,
  setAuthCookie,
} from 'src/utils/storage';
import { apiWithAuth } from 'src/services';

interface UserAuthContext {
  handleLogin: (auth: IAuthState) => void;
  handleLogout: () => void;
  userAuth: IAuthState | null;
  isAdmin: boolean;
}

const UserContext = createContext({} as UserAuthContext);

export const UserProvider = ({ children }: PropsWithChildren) => {
  const [userAuth, setUserAuth] = useState<IAuthState | null>(() =>
    getAuthCookie()
  );
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const handleLogin = (auth: IAuthState) => {
    setUserAuth(auth);
    setAuthCookie(auth);
    router.push('/');
  };

  const handleLogout = useCallback(() => {
    setUserAuth(null);
    router.push('/login');
    removeAuthCookie();
  }, [router]);

  useEffect(() => {
    if (!userAuth) {
      removeAuthCookie();
    } else {
      setIsAdmin(userAuth.usuario.isAdmin);
    }
  }, [userAuth]);

  useEffect(() => {
    apiWithAuth.interceptors.response.use(
      (response) => response,
      (error) => {
        if (
          error?.status === 401 &&
          error?.message !== 'Incorrect email or password'
        ) {
          handleLogout();
          if (!toast.isActive('expiredToken')) {
            toast({
              description:
                'Token de autenticação expirado, para continuar refaça login',
              status: 'error',
              duration: 4000,
              position: 'top-right',
              containerStyle: { color: 'white' },
              isClosable: true,
              id: 'expiredToken',
            });
          }
        }

        return Promise.reject(error?.response?.data);
      }
    );
  }, [handleLogout, toast]);

  return (
    <UserContext.Provider
      value={{ handleLogin, handleLogout, userAuth, isAdmin }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
