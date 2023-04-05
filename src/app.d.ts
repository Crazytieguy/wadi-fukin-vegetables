/// <reference types="@auth/sveltekit" />

import type { Prisma } from '@prisma/client';
import type { Session as CoreSession } from '@auth/core/types';

type User = Prisma.UserGetPayload<{}>;
type Session = CoreSession & { user?: User };

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      getSession(): Promise<Session | null>;
      requireLogin(): Promise<{ user: User }>;
      requireAdmin(): Promise<{ user: User }>;
    }
    interface PageData {
      session: Session | null;
    }
    // interface Platform {}
  }
}

export {};
