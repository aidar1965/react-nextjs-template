import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Post } from '../types';
import { Loader2 } from "lucide-react";

interface PostsTableProps {
  posts: Post[] | undefined;
  isLoading: boolean;
  error: boolean;
}

export default function PostsTable({ posts, isLoading, error }: PostsTableProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center">
        <Loader2 className="w-6 h-6" />
      </div>
    );
  }

  if (error) {
    return <div>Error fetching posts</div>;
  }

  return (
    <Table className="bg-white dark:bg-gray-800">
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Body</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {posts?.map((post) => (
          <TableRow key={post.id}>
            <TableCell>{post.id}</TableCell>
            <TableCell>{post.title}</TableCell>
            <TableCell>{post.body.substring(0, 50)}...</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}