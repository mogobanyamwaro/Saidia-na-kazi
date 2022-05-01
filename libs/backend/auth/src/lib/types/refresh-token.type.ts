export type IRefreshToken = {
  id: string;
  token: string;
  expiresAt: Date;
  revoked: boolean;
  user?: unknown;
};
