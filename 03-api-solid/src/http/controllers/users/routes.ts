import { authenticate } from "@/http/controllers/users/authenticate.controller";
import { profile } from "@/http/controllers/users/profile.controller";
import { refresh } from "@/http/controllers/users/refresh.controller";
import { register } from "@/http/controllers/users/register.controller";
import { verifyJWT } from "@/http/middlewares/verify-jwt";
import { FastifyInstance } from "fastify";

export async function usersRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/sessions', authenticate)

  app.patch('/token/refresh', refresh)

  // Authenticated routes
  app.get('/me', { onRequest: [verifyJWT] }, profile)
}
