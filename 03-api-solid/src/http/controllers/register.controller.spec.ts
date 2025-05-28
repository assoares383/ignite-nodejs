import { app } from '@/app';
import { after } from 'node:test';
import request from 'supertest';
import { beforeAll, describe, expect, test } from "vitest";

describe('Register Controller (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  })

  after(async () => {
    await app.close();
  })
  test('should be able to register', async () => {
    const response = await request(app.server)
      .post('/users')
      .send({
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123456'
      })

    expect(response.statusCode).toEqual(201);
  })
})
