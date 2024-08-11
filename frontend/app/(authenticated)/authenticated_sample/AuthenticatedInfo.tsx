import { useSession } from 'next-auth/react';

export default function AuthenticatedInfo() {
  const session = useSession();
  return (
    <div>
      <div>Authenticated</div>
      <pre>{JSON.stringify(session.data, undefined, 2)}</pre>
    </div>
  );
}
