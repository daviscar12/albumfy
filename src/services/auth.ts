export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
};

type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

type LoginPayload = {
  email: string;
  password: string;
};

const USERS_STORAGE_KEY = 'albumfy_users';
const SESSION_STORAGE_KEY = 'albumfy_session';

const readUsers = (): User[] => {
  const raw = localStorage.getItem(USERS_STORAGE_KEY);

  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw) as User[];
  } catch {
    return [];
  }
};

const writeUsers = (users: User[]) => {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

const generateId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `user_${Date.now()}_${Math.random().toString(16).slice(2)}`;
};

export const authService = {
  registerUser({ name, email, password }: RegisterPayload) {
    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();

    if (!normalizedName || !normalizedEmail || !normalizedPassword) {
      throw new Error('Please complete all fields.');
    }

    const users = readUsers();
    const existingUser = users.find((user) => user.email.toLowerCase() === normalizedEmail);

    if (existingUser) {
      throw new Error('This email is already registered.');
    }

    const newUser: User = {
      id: generateId(),
      name: normalizedName,
      email: normalizedEmail,
      password: normalizedPassword,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    writeUsers(users);
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({ userId: newUser.id }));

    return { ...newUser, password: undefined };
  },

  loginUser({ email, password }: LoginPayload) {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();

    if (!normalizedEmail || !normalizedPassword) {
      throw new Error('Email and password are required.');
    }

    const users = readUsers();
    const user = users.find(
      (item) => item.email.toLowerCase() === normalizedEmail && item.password === normalizedPassword,
    );

    if (!user) {
      throw new Error('Invalid email or password.');
    }

    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({ userId: user.id }));

    return { ...user, password: undefined };
  },

  logoutUser() {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
  },

  getCurrentUser() {
    const session = sessionStorage.getItem(SESSION_STORAGE_KEY);

    if (!session) {
      return null;
    }

    try {
      const parsedSession = JSON.parse(session) as { userId?: string };
      const users = readUsers();
      return users.find((user) => user.id === parsedSession.userId) ?? null;
    } catch {
      return null;
    }
  },

  isAuthenticated() {
    return Boolean(this.getCurrentUser());
  },
};
