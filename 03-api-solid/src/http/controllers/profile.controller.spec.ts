import { app } from '@/app';
import { after } from 'node:test';
import request from 'supertest';
import { beforeAll, describe, expect, test } from "vitest";

describe('Profile Controller (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  })

  after(async () => {
    await app.close();
  })
  test('should be able to get user profile', async () => {
    await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    })

    const authResponse = await request(app.server).post('/sessions').send({
      email: 'johndoe@example.com',
      password: '123456'
    })

    const { token } = authResponse.body;

    const profileResponse = await request(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(profileResponse.statusCode).toEqual(200);
    expect(profileResponse.body.user).toEqual(
      expect.objectContaining({
        email: 'johndoe@example.com'
      })
    )
  })
})
