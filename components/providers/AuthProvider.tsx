"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { Profile } from "@/types";

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setUser(user);

        if (user) {
          const { data: profile, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .maybeSingle(); // Use maybeSingle() instead of single()

          if (error) {
            console.error("Error fetching profile:", error);
          } else {
            setProfile(profile);
          }
        }
      } catch (error) {
        console.error("Auth error:", error);
      } finally {
        setLoading(false);
      }
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .maybeSingle(); // Use maybeSingle() instead of single()

        if (error) {
          console.error("Profile fetch error:", error);
        } else {
          setProfile(profile);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
      router.refresh();
    });

    return () => subscription.unsubscribe();
  }, [supabase, router]);

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
