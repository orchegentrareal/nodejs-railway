
import express, { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
};

const users: User[] = [];
const sessions = new Map<string, string>();

function makeToken() {
  return crypto.randomBytes(24).toString('hex');
}

function sanitizeUser(user: User) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  };
}

function auth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : '';

  if (!token) {
    return res.status(401).json({ error: 'Missing token' });
  }

  const userId = sessions.get(token);
  if (!userId) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  const user = users.find((u) => u.id === userId);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  (req as Request & { user?: User }).user = user;
  next();

  
app.get("/", (req, res) => {
  const secret = req.headers["x-api-key"];

  if (secret !== process.env.APP_SECRET) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  res.json({ status: "ok", secure: true });
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.post('/signup', (req, res) => {
  const { name, email, password } = req.body || {};

  if (!name || !email || !password) {
    return res.status(400).json({
      error: 'name, email, and password are required',
    });
  }

  const existing = users.find(
    (u) => u.email.toLowerCase() === String(email).toLowerCase()
  );

  if (existing) {
    return res.status(409).json({ error: 'Email already registered' });
  }

  const user: User = {
    id: crypto.randomUUID(),
    name: String(name).trim(),
    email: String(email).trim().toLowerCase(),
    password: String(password),
    createdAt: new Date().toISOString(),
  };

  users.push(user);

  return res.status(201).json({
    message: 'Signup successful',
    user: sanitizeUser(user),
  });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({
      error: 'email and password are required',
    });
  }

  const user = users.find(
    (u) =>
      u.email === String(email).trim().toLowerCase() &&
      u.password === String(password)
  );

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = makeToken();
  sessions.set(token, user.id);

  return res.json({
    message: 'Login successful',
    token,
    user: sanitizeUser(user),
  });
});

app.get('/users', (_req, res) => {
  res.json({
    count: users.length,
    users: users.map(sanitizeUser),
  });
});

app.get('/me', auth, (req, res) => {
  const user = (req as Request & { user?: User }).user!;
  res.json({
    message: 'Authorized',
    user: sanitizeUser(user),
  });
});

app.post('/logout', auth, (req, res) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : '';

  if (token) {
    sessions.delete(token);
  }

  res.json({ message: 'Logged out successfully' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
