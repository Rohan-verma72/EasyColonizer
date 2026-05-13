const LOCAL_USERS_KEY = "easyColonizerLocalUsers";

const demoUsers = [
  {
    id: "demo-admin",
    username: "admin",
    password: "admin123",
    name: "Admin User",
    email: "admin@easycolonizer.com",
    phone: "9876543210",
    role: "admin",
  },
  {
    id: "demo-customer",
    username: "customer",
    password: "customer123",
    name: "Demo Customer",
    email: "customer@easycolonizer.com",
    phone: "9876501234",
    role: "customer",
  },
];

const getLocalUsers = () => {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_USERS_KEY) || "[]");
  } catch {
    return [];
  }
};

const saveLocalUsers = (users) => {
  localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
};

export const registerLocalUser = (payload) => {
  const username = payload.username?.trim().toLowerCase();
  const email = payload.email?.trim().toLowerCase();

  if (!username || !payload.password) {
    throw new Error("Username and password are required.");
  }

  const users = getLocalUsers();
  const allUsers = [...demoUsers, ...users];

  if (allUsers.some((user) => user.username === username)) {
    throw new Error("Username already exists.");
  }

  if (email && allUsers.some((user) => user.email === email)) {
    throw new Error("Email already registered.");
  }

  const user = {
    id: `local-${Date.now()}`,
    username,
    password: payload.password,
    name: payload.name || username,
    email: email || "",
    phone: payload.phone || "",
    role: "customer",
    createdAt: new Date().toISOString(),
  };

  saveLocalUsers([...users, user]);
  return user;
};

export const loginLocalUser = ({ username, password }) => {
  const normalizedUsername = username?.trim().toLowerCase();
  const allUsers = [...demoUsers, ...getLocalUsers()];
  const user = allUsers.find(
    (item) =>
      item.username === normalizedUsername &&
      item.password === password
  );

  if (!user) {
    throw new Error("Invalid credentials.");
  }

  return {
    token: `local-token-${user.id}`,
    userId: user.id,
    username: user.username,
    name: user.name,
    role: user.role,
    user: {
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt,
    },
  };
};

export const getLocalUserProfile = (id) => {
  const user = [...demoUsers, ...getLocalUsers()].find(
    (item) => item.id === id
  );

  if (!user) return null;

  return {
    _id: user.id,
    username: user.username,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    createdAt: user.createdAt,
  };
};

export const updateLocalUserProfile = (id, data) => {
  const users = getLocalUsers();
  const updated = users.map((user) =>
    user.id === id ? { ...user, ...data } : user
  );
  saveLocalUsers(updated);
  return getLocalUserProfile(id) || { _id: id, ...data };
};

export const persistSession = (data) => {
  const token = data.token;
  const username = data.username || data.user?.username;
  const role = data.role || data.user?.role;
  const userId = data.userId || data.user?.id || data.user?._id;

  localStorage.setItem("token", token);
  localStorage.setItem("username", username);
  localStorage.setItem("userRole", role);
  localStorage.setItem("userId", userId);

  if (role === "admin" || role === "manager") {
    localStorage.setItem("adminToken", token);
    localStorage.setItem("adminUser", username);
  } else {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
  }

  window.dispatchEvent(new Event("storage"));

  return { username, role, userId };
};
