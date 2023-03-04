/// <reference types="@auth/sveltekit" />

import type { Prisma } from '@prisma/client';
import type { Session as CoreSession } from '@auth/core/types';

type Session = CoreSession & { user?: Prisma.UserSelect };

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      getSession(): Promise<Session | null>;
      requireLogin(): Promise<{ user: Prisma.UserSelect }>;
      requireAdmin(): Promise<{ user: Prisma.UserSelect }>;
    }
    interface PageData {
      session: Session | null;
    }
    // interface Platform {}
  }
}

export {};
