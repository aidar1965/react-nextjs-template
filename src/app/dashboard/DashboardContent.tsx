'use client';

import { useDashboard } from '../dashboard/useDashboard';
import NavBar from '../dashboard/components/NavBar';
import PostsTable from '../dashboard/components/PostsTable';
import Pagination from '../dashboard/components/Pagination';
import { Loader2 } from "lucide-react";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardContent() {
  const { 
    status, 
    session, 
    posts, 
    postsLoading, 
    postsError, 
    page, 
    handleSignOut, 
    handlePageChange 
  } = useDashboard();

  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/login');
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex-grow flex items-center justify-center h-[calc(100vh-64px)]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar userName={session?.user?.name} onSignOut={handleSignOut} />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PostsTable posts={posts} isLoading={postsLoading} error={postsError} />
        <Pagination 
          page={page} 
          onPageChange={handlePageChange} 
          isFirstPage={page === 1} 
        />
      </main>
    </div>
  );
}