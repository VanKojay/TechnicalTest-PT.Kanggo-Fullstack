const request = require('supertest');
const app = require('../src/app');
const { sequelize, User, Task } = require('../src/models');

// Test data
const testUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123',
};

let authToken = '';
let taskId = '';

beforeAll(async () => {
  // Sync database (use force to recreate tables for clean test)
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  // Cleanup
  await sequelize.close();
});

describe('Auth Endpoints', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data.email).toBe(testUser.email);
      expect(res.body.data).not.toHaveProperty('password');
    });

    it('should reject duplicate email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      expect(res.statusCode).toBe(409);
      expect(res.body.success).toBe(false);
    });

    it('should reject invalid email format', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ name: 'Bad', email: 'notanemail', password: 'password123' });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should reject short password', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ name: 'Short', email: 'short@test.com', password: '123' });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login successfully and return token', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: testUser.email, password: testUser.password });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('token');
      expect(res.body.data.user.email).toBe(testUser.email);

      authToken = res.body.data.token;
    });

    it('should reject wrong password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: testUser.email, password: 'wrongpassword' });

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should reject non-existent email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'noone@test.com', password: 'password123' });

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });
});

describe('Task Endpoints', () => {
  describe('POST /api/tasks', () => {
    it('should create a task', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Test Task', description: 'A test task', status: 'pending' });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('Test Task');
      taskId = res.body.data.id;
    });

    it('should reject task without title', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ description: 'No title' });

      expect(res.statusCode).toBe(400);
    });

    it('should reject request without token', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({ title: 'No auth' });

      expect(res.statusCode).toBe(401);
    });
  });

  describe('GET /api/tasks', () => {
    it('should get all tasks for user', async () => {
      const res = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.tasks).toBeInstanceOf(Array);
      expect(res.body.data.pagination).toBeDefined();
    });

    it('should filter tasks by status', async () => {
      const res = await request(app)
        .get('/api/tasks?status=pending')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      res.body.data.tasks.forEach((task) => {
        expect(task.status).toBe('pending');
      });
    });
  });

  describe('PUT /api/tasks/:id', () => {
    it('should update a task', async () => {
      const res = await request(app)
        .put(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Updated Task', status: 'in-progress' });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.title).toBe('Updated Task');
      expect(res.body.data.status).toBe('in-progress');
    });

    it('should return 404 for non-existent task', async () => {
      const res = await request(app)
        .put('/api/tasks/99999')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Ghost' });

      expect(res.statusCode).toBe(404);
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('should delete a task', async () => {
      const res = await request(app)
        .delete(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should return 404 for already deleted task', async () => {
      const res = await request(app)
        .delete(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(404);
    });
  });
});
