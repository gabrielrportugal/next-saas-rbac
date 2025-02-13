import { z } from 'zod'
import { compare } from 'bcryptjs'
import { prisma } from '@/lib/prisma';

import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

export async function getProfile(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get('/profile', 
    {
      schema: {
        tags: ['auth'],
        summary: 'Get authenticated user profile',
        response: {
          200: z.object({
            user: z.object({
              id: z.string().uuid(),
              name: z.string().nullable(),
              email: z.string(),
              avatarUrl: z.string().url().nullable()
            })
          }),
          404: z.object({
            message: z.string()
          })
        }
      }
    },async (request, reply) => {
      const { sub } = await request.jwtVerify<{ sub: string }>()

      const user = await prisma.user.findUnique({
        select: { id: true, name: true, email: true, avatarUrl: true },
        where: { id: sub }
      })

      if (!user) {
        return reply.status(404).send({ message: 'User not found' })
      }

      return reply.send({ user })
  })
}