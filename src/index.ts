import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { prisma } from './db.js';
import { openApiSpec } from './swagger.js';

const app = express();
app.use(express.json());

app.get('/openapi.json', (_req, res) => {
  res.json(openApiSpec);
});
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiSpec));

app.get('/users', async (_req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.post('/users', async (req, res) => {
  const { email, name } = req.body ?? {};
  if (typeof email !== 'string' || !email) {
    res.status(400).json({ error: 'email is required' });
    return;
  }
  try {
    const user = await prisma.user.create({
      data: { email, name: typeof name === 'string' ? name : null },
    });
    res.status(201).json(user);
  } catch (err: any) {
    if (err?.code === 'P2002') {
      res.status(409).json({ error: 'A user with this email already exists' });
      return;
    }
    console.error(err);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

const PORT = Number(process.env.PORT) || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`API docs at http://localhost:${PORT}/docs`);
});

const shutdown = async () => {
  server.close();
  await prisma.$disconnect();
  process.exit(0);
};
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
