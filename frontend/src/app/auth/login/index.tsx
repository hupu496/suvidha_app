
import React from 'react';
import { useAppState } from '@/context/AppStateContext';
import { RoleLoginScreen } from '@/components/auth/RoleLoginScreen';

export default function LoginIndexPage() {
  const { selectedRole } = useAppState();

  return <RoleLoginScreen initialRole={selectedRole} />;
}
