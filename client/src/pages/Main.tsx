import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getAllPosts } from "@/lib/api";
import { Post } from "@/types";
import { useQuery } from "react-query";

type DropDownProps = {
  action: (value: "delete" | "modify" | null) => void;
};
export function DropdownMenuCheckboxes(props: DropDownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">Edit</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Edit</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            props.action("modify");
          }}
        >
          Modify
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-red-400"
          onClick={() => {
            props.action("delete");
          }}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const Main = () => {
  const query = useQuery("blogs", getAllPosts);
  const userId = localStorage.getItem("userId");

  if (query.isLoading) {
    return <span className="font-bold"> Loading ... </span>;
  }

  const posts: Post[] = query.data;

  const modifyPost = (id: number) => {
    console.log("modify post with id", id);
  };

  const deletePost = (id: number) => {
    console.log("delete post with id", id);
  };

  return (
    <div className="p-4 bg-gray-100 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {posts.map((post) => (
        <Card key={post.id} className="lg:h-32 h-[12rem]">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>{post.title}</CardTitle>
            {post.userId === Number(userId) && (
              <DropdownMenuCheckboxes
                action={(action) => {
                  if (action === "delete") deletePost(post.id);
                  else if (action === "modify") modifyPost(post.id);
                  else {
                    console.error("what did you do");
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
    </div>
  );
};
