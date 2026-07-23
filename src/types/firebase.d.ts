interface FirebaseApi {
  init(): Promise<void>;
  read(
    collectionName: string,
    options?: {
      docId?: string | null;
      size?: number;
      lastDoc?: unknown | null;
      search?: { key?: string | null; value?: unknown | null };
    }
  ): Promise<{
    data: Array<{ id: string; [key: string]: any }>;
    hasMore: boolean;
    lastDoc: unknown | null;
  }>;
  write(collectionName: string, docId: string, data: Record<string, unknown>): Promise<void>;
  loginWithGoogle(): Promise<unknown>;
  logout(): Promise<void>;
  getUser(): unknown;
  log(eventName: string, params?: Record<string, unknown>): void;
  publish(event: string, data?: Record<string, unknown>): void;
}

declare global {
  const Firebase: FirebaseApi;

  interface Window {
    Firebase: FirebaseApi;
  }
}

export {};
