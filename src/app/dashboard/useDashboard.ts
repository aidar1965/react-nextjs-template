import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useSession, signOut } from "next-auth/react";
import { fetchPosts } from "./utils";
import { Post } from "./types";

export function useDashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [page, setPage] = useState(1);

  const {
    data: posts,
    isLoading: postsLoading,
    isError: postsError,
  } = useQuery<Post[]>({
    queryKey: ["posts", page],
    queryFn: () => fetchPosts(page),
    enabled: status === "authenticated",
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return {
    status,
    session,
    posts,
    postsLoading,
    postsError,
    page,
    handleSignOut,
    handlePageChange,
  };
}
