
import { Elysia, t } from 'elysia';
import { PrismaClient } from '@prisma/client';
// import { z } from 'zod';

const db = new PrismaClient();

// --- Zod Validation Schema (Commented Out) ---
// const userSchema = z.object({
//   name: z.string().optional(),
//   email: z.string().email(),
// });

const app = new Elysia()
  .get('/', () => 'Welcome to the User API!')

  // 1. GET all users
  .get('/users', async () => {
    const users = await db.user.findMany();
    return users;
  })

  // 2. GET user by ID
  .get('/users/:id', async ({ params: { id } }) => {
    const user = await db.user.findUnique({
      where: { id: Number(id) },
    });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  })

  // 3. CREATE a new user
  .post('/users', async ({ body }) => {
    // Pure TS Implementation
    const { email, name } = body as { email: string; name?: string };
    const user = await db.user.create({
      data: {
        email,
        name,
      },
    });
    return user;
  }, {
    // Zod-based validation (Commented out)
    // body: userSchema,
    // async resolve({ body }) {
    //   const user = await db.user.create({
    //     data: body,
    //   });
    //   return user;
    // }
  })

  // 4. UPDATE a user by ID
  .put('/users/:id', async ({ params: { id }, body }) => {
    // Pure TS Implementation
    const { email, name } = body as { email?: string; name?: string };
    const user = await db.user.update({
      where: { id: Number(id) },
      data: {
        email,
        name,
      },
    });
    return user;
  }, {
    // Zod-based validation (Commented out)
    // body: userSchema.partial(), // .partial() makes all fields optional for updates
    // async resolve({ params: { id }, body }) {
    //   const user = await db.user.update({
    //     where: { id: Number(id) },
    //     data: body,
    //   });
    //   return user;
    // }
  })

  // 5. DELETE a user by ID
  .delete('/users/:id', async ({ params: { id } }) => {
    await db.user.delete({
      where: { id: Number(id) },
    });
    return { message: `User with id ${id} deleted successfully` };
  })

  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

