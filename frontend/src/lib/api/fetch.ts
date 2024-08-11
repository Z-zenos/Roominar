import type { Session } from 'next-auth';
import apiConfig from './apiConfig';
import { AuthApi } from './generated';

export default function fetch(session?: Session) {
  const config = apiConfig(session);
  return {
    auth: new AuthApi(config),
  };
}
