'use client';

import { useQueryGetProfile } from '@/src/api/auth.api';

export default function Home() {
  useQueryGetProfile();
  return <div>Home page</div>;
}
