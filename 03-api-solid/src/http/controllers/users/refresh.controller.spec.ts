import { app } from '@/app';
import { after } from 'node:test';
import request from 'supertest';
import { beforeAll, describe, expect, test } from "vitest";

describe('Refresh Token Controller (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  })

  after(async () => {
    await app.close();
  })
  test('should be able to refresh a token', async () => {
    await request(app.server)
      .post('/users')
      .send({
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123456'
      })

    const authResponse = await request(app.server)
      .post('/sessions')
      .send({
        email: 'johndoe@example.com',
        password: '123456'
      })

    const cookies = authResponse.get('Set-Cookie') ?? [];

    const response = await request(app.server)
      .patch('/token/refresh')
      .set('Cookie', cookies)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      token: expect.any(String)
    })
    expect(response.get('Set-Cookie')).toEqual([
      expect.stringContaining('refreshToken='),
    ])
  })
})
