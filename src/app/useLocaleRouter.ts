import { useRouter, useParams } from "next/navigation";
import { useCallback } from "react";

function useLocaleRouter() {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale as string;

  // Enhanced router.push with locale support
  const push = useCallback(
    (path: string) => {
      router.push(`/${locale}${path}`);
    },
    [router, locale]
  );

  // Enhanced router.replace with locale support
  const replace = useCallback(
    (path: string) => {
      router.replace(`/${locale}${path}`);
    },
    [router, locale]
  );

  return { ...router, push, replace };
}

export default useLocaleRouter;
