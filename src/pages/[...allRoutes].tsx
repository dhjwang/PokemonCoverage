import { useEffect } from "react";
import { useRouter } from "next/router";

export default function RedirectRoutes() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/");
  }, [router]);
  return null;
}
