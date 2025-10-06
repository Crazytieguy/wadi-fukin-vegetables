import { SvelteKitAuth } from '@auth/sveltekit';
import GoogleProvider from '@auth/core/providers/google';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '$lib/server/prismaClient';
import { GOOGLE_ID, GOOGLE_SECRET } from '$env/static/private';
import { error, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

const addAuthorization = (async ({ event, resolve }) => {
  event.locals.requireLogin = async () => {
    const session = await event.locals.getSession();
    if (!session?.user) error(401, 'not signed in');
    return { user: session.user };
  };
  event.locals.requireAdmin = async () => {
    const { user } = await event.locals.requireLogin();
    if (!user.isAdmin) error(403, 'not an admin');
    return { user };
  };
  return await resolve(event);
}) satisfies Handle;

const svelteKitAuth = SvelteKitAuth({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  adapter: PrismaAdapter(prisma),
  providers: [
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    GoogleProvider({
      clientId: GOOGLE_ID,
      clientSecret: GOOGLE_SECRET
    })
  ],
  callbacks: {
    session({ session, user }) {
      session.user = { ...user, ...session.user };
      return session;
    }
  }
});

export const handle = sequence(svelteKitAuth, addAuthorization);
