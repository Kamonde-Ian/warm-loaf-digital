import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/**
 * Staff accounts (local, device-only placeholder).
 * BACKEND: swap these helpers for real server-side auth (hashed passwords in a
 * database, HTTP-only session cookie, a `staff_roles` table) when an account
 * system is switched on. Nothing here should be trusted as a security boundary.
 */

export type StaffRole = "admin" | "staff";

export type StaffAccount = {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
  createdAt: string;
};

type StoredAccount = StaffAccount & { passwordHash: string };

const ACCOUNTS_KEY = "tamu-staff-accounts-v1";
const SESSION_KEY = "tamu-staff-session-v1";

/** Code the bakery shares with new team members so the sign-up page isn't open to all. */
export const STAFF_INVITE_CODE = "TEHILA-2026";

function readAccounts(): StoredAccount[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(ACCOUNTS_KEY);
    return raw ? (JSON.parse(raw) as StoredAccount[]) : [];
  } catch {
    return [];
  }
}

function writeAccounts(accounts: StoredAccount[]) {
  window.localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

async function hashPassword(email: string, password: string) {
  const data = new TextEncoder().encode(`${email.toLowerCase()}::${password}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function publicAccount(a: StoredAccount): StaffAccount {
  const { passwordHash: _hash, ...rest } = a;
  return rest;
}

type AuthContextValue = {
  user: StaffAccount | null;
  ready: boolean;
  accounts: StaffAccount[];
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (input: {
    name: string;
    email: string;
    password: string;
    inviteCode: string;
  }) => Promise<{ error?: string }>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function StaffAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<StaffAccount | null>(null);
  const [accounts, setAccounts] = useState<StaffAccount[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = readAccounts();
    setAccounts(stored.map(publicAccount));
    const email = window.localStorage.getItem(SESSION_KEY);
    const found = email
      ? stored.find((a) => a.email.toLowerCase() === email.toLowerCase())
      : undefined;
    setUser(found ? publicAccount(found) : null);
    setReady(true);
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const stored = readAccounts();
    const found = stored.find((a) => a.email.toLowerCase() === email.trim().toLowerCase());
    if (!found) return { error: "No staff account uses that email." };
    const hash = await hashPassword(found.email, password);
    if (hash !== found.passwordHash) return { error: "That password doesn't match." };
    window.localStorage.setItem(SESSION_KEY, found.email);
    setUser(publicAccount(found));
    return {};
  }, []);

  const signUp = useCallback<AuthContextValue["signUp"]>(async (input) => {
    const email = input.email.trim().toLowerCase();
    if (input.inviteCode.trim().toUpperCase() !== STAFF_INVITE_CODE) {
      return { error: "That team code isn't right. Ask the bakery manager for it." };
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { error: "Enter a valid email address." };
    }
    if (input.password.length < 8) {
      return { error: "Use at least 8 characters for the password." };
    }
    const stored = readAccounts();
    if (stored.some((a) => a.email.toLowerCase() === email)) {
      return { error: "An account already exists for that email." };
    }
    const account: StoredAccount = {
      id: crypto.randomUUID(),
      name: input.name.trim() || "Staff member",
      email,
      role: stored.length === 0 ? "admin" : "staff",
      createdAt: new Date().toISOString(),
      passwordHash: await hashPassword(email, input.password),
    };
    const next = [...stored, account];
    writeAccounts(next);
    setAccounts(next.map(publicAccount));
    window.localStorage.setItem(SESSION_KEY, account.email);
    setUser(publicAccount(account));
    return {};
  }, []);

  const signOut = useCallback(() => {
    window.localStorage.removeItem(SESSION_KEY);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, ready, accounts, signIn, signUp, signOut }),
    [user, ready, accounts, signIn, signUp, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useStaffAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useStaffAuth must be used inside StaffAuthProvider");
  return ctx;
}

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}
