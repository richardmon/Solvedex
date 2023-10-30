import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deletePost, getAllPosts } from "@/lib/api";
import { Post } from "@/types";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Pencil, Plus } from "lucide-react";
import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tooltip } from "@radix-ui/react-tooltip";

type DropDownProps = {
  action: (value: "delete" | "modify" | null) => void;
};
export function DropdownMenuCheckboxes(props: DropDownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleDeleteClick = () => {
    setIsOpen(true);
  };

  const handleDeleteResult = (result: boolean) => {
    setIsOpen(false);
    if (result) {
      props.action("delete");
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button data-testid="dropdown-pencil" variant="ghost">
            <Pencil />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Edit</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
          data-testid="dropdown-modify"
          onClick={() => props.action("modify")}>
            Modify
          </DropdownMenuItem>
          <DropdownMenuItem
           data-testid="dropdown-delete"
            onClick={handleDeleteClick}
            className="text-red-400"
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteDialog isOpen={isOpen} status={handleDeleteResult} />
    </>
  );
}

const DeleteDialog = ({
  isOpen,
  status,
}: {
  isOpen: boolean;
  status: (state: boolean) => void;
}) => {
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this post
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => status(false)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={() => status(true)}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export const Main = () => {
  const queryClient = useQueryClient();
  const query = useQuery("posts", getAllPosts);
  const mutation = useMutation(deletePost, {
    onSuccess: () => {
      queryClient.invalidateQueries("posts");
    },
  });
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  if (query.isLoading) {
    return <span className="font-bold"> Loading ... </span>;
  }

  const posts: Post[] = query.data;

  const modifyPost = (id: number) => {
    navigate(`/post/${id}`);
  };

  const removePost = async (id: number) => {
    mutation.mutate(id);
  };

  return (
    <>
      <div className="p-4 bg-gray-100 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((post) => (
          <Card key={post.id} className="h-[12rem]" data-testid="post-card">
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>{post.title}</CardTitle>
              {post.userId === Number(userId) && (
                <DropdownMenuCheckboxes
                  action={(action) => {
                    if (action === "delete") removePost(post.id);
                    else if (action === "modify") modifyPost(post.id);
                    else {
                      console.warn("what did you do");
                    }
                  }}
                />
              )}
            </CardHeader>
            <CardContent className="h-2">
              <p>
                {post.content && post.content.length > 100
                  ? post.content.substring(0, 100) + "..."
                  : post.content}
              </p>
            </CardContent>
          </Card>
        ))}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
              data-test="new-post-button"
              className="fixed bottom-16 right-6 w-16 h-16 rounded-full"
              onClick={() => navigate("/post")}
              >
                <Plus />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Create new post</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </>
  );
};
