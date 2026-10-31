
const DEMO_ADMIN_EMAIL = 'admin@subidha.demo';
const DEMO_ADMIN_PASSWORD = 'Admin@123';

let adminAuthenticated = false;

export function loginAdmin(
  email: string,
  password: string,
): boolean {
  const valid =
    email.trim().toLowerCase() === DEMO_ADMIN_EMAIL &&
    password === DEMO_ADMIN_PASSWORD;

  adminAuthenticated = valid;
  return valid;
}

export function isAdminAuthenticated(): boolean {
  return adminAuthenticated;
}

export function logoutAdmin(): void {
  adminAuthenticated = false;
}
