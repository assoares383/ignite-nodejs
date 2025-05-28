import { authenticate } from "@/http/controllers/authenticate.controller";
import { profile } from "@/http/controllers/profile.controller";
import { register } from "@/http/controllers/register.controller";
import { FastifyInstance } from "fastify";

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/sessions', authenticate)

  // Authenticated routes
  app.get('/me', profile)
}
