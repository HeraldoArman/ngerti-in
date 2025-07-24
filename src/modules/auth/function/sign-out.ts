import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export const onLogout = () => {
  const router = useRouter();

  authClient.signOut({
    fetchOptions: {
      onSuccess: () => {
        router.push("/sign-in");
      },
    },
  });
};
