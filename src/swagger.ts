const errorResponse = (description: string) => ({
  description,
  content: {
    'application/json': { schema: { $ref: '#/components/schemas/Error' } },
  },
});

export const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'My Prisma Project API',
    version: '1.0.0',
    description: 'Express + Prisma (PostgreSQL) API for managing users.',
  },
  servers: [{ url: '/', description: 'Current server' }],
  tags: [{ name: 'Users', description: 'User management' }],
  paths: {
    '/users': {
      get: {
        tags: ['Users'],
        summary: 'List all users',
        operationId: 'listUsers',
        responses: {
          200: {
            description: 'List of users',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/User' },
                },
              },
            },
          },
          500: errorResponse('Server error'),
        },
      },
      post: {
        tags: ['Users'],
        summary: 'Create a user',
        operationId: 'createUser',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateUserInput' },
            },
          },
        },
        responses: {
          201: {
            description: 'User created',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/User' },
              },
            },
          },
          400: errorResponse('Invalid input (email missing)'),
          409: errorResponse('A user with this email already exists'),
          500: errorResponse('Server error'),
        },
      },
    },
  },
  components: {
    schemas: {
      User: {
        type: 'object',
        required: ['id', 'email', 'name'],
        properties: {
          id: { type: 'integer', example: 1 },
          email: { type: 'string', format: 'email', example: 'alice@example.com' },
          name: { type: 'string', nullable: true, example: 'Alice' },
        },
      },
      CreateUserInput: {
        type: 'object',
        required: ['email'],
        properties: {
          email: { type: 'string', format: 'email', example: 'alice@example.com' },
          name: { type: 'string', nullable: true, example: 'Alice' },
        },
      },
      Error: {
        type: 'object',
        required: ['error'],
        properties: {
          error: { type: 'string', example: 'email is required' },
        },
      },
    },
  },
};
