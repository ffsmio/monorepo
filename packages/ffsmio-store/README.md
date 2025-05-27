# Create store for ReactJS

Using `createContext` and `useReducer` of React to make store Provider.

## Using

```tsx
import { createStore, PayloadAction } from "@ffsm/store";

export interface AuthState {
  user: User | null;
  token: string;
  isLoading: boolean;
}

const initialState: AuthState = {
  user: null,
  token: "",
  isLoading: false,
};

const authStore = createStore({
  name: "auth"
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
    },
  },
});

export const AuthProvider = authStore.Provider;
export const useAuth = authStore.useStore;
```

Using in app

```tsx
import { useEffect } from 'react';
import { AuthProvider, useAuth } from '@/store/auth';

function LoggedUser() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return <div>User name: {user.name}</div>;
}

function NonLoggedIn() {
  const { setUser } = useAuth();

  useEffect(() => {
    const getUser = async () => {
      const user = await fetch('/api/user');
      setUser(user);
    };
    getUser();
  }, []);

  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <LoggedUser />
    </AuthProvider>
  );
}
```
