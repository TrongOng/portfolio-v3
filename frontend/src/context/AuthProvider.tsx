import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import axios from "axios";
import { UserModel, getUser } from "../api/user";
import { useAsync } from "@react-hookz/web";

// Define the shape of the user object
interface AuthContextProps {
  authenticated: boolean;
  session: {
    create: (token: string) => void;
    end: () => void;
    refresh: () => void;
  };
  user: UserModel | null;
}

export const AuthContext = createContext<AuthContextProps>({
  authenticated: false,
  session: {
    create: () => {},
    end: () => {},
    refresh: () => {},
  },
  user: null,
});

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserModel | null>(null);
  const [mounted, setMounted] = useState(false);

  // api
  const [profileState, profileActions] = useAsync(getUser);
  const [refreshState, refreshActions] = useAsync(getUser);

  // handle profile
  useEffect(() => {
    if (!isAuthenticated) {
      if (profileState.status === "success" && profileState.result) {
        setUser(profileState.result);
        setIsAuthenticated(true);
      }
    }
  }, [profileState, isAuthenticated, mounted]);

  // initial check
  useEffect(() => {
    const token = sessionStorage.getItem("access_token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      if (profileState.status === "not-executed") {
        profileActions.execute();
      }
    } else {
      setIsAuthenticated(false);
      setMounted(true);
    }
  }, [profileActions, profileState]);

  const handleAuthentication = (authenticated: boolean) => {
    if (authenticated) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
    setMounted(true);
  };

  useEffect(() => {
    if (profileState.status === "success" && profileState.result) {
      handleAuthentication(true);
    }
    if (profileState.status === "error") {
      handleAuthentication(false);
    }
  }, [profileState.status, profileState.result]);

  useEffect(() => {
    if (refreshState.status === "success" && refreshState.result) {
      setUser(refreshState.result);
    }
    if (refreshState.status === "error") {
      setIsAuthenticated(false);
    }
  }, [refreshState]);

  const createSession = async (token: string) => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    sessionStorage.setItem("access_token", token);
    profileActions.execute();
  };

  const endSession = () => {
    axios.defaults.headers.common["Authorization"] = "";
    sessionStorage.removeItem("access_token");
    setIsAuthenticated(false);
    setUser(null);
    profileActions.execute();
  };

  const refreshSession = async () => {
    setUser(null);
    refreshActions.execute();
  };

  const session = {
    create: createSession,
    end: endSession,
    refresh: refreshSession,
  };

  const value = {
    authenticated: isAuthenticated,
    session,
    user,
  };

  if (!mounted) {
    return null;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
