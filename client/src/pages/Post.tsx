import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useLoaderData, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "react-query";
import { createPost, updatePost } from "@/lib/api";
import { Post, PostCreate, PostUpdate } from "@/types";
import { Check } from "lucide-react";
import useAutosizeTextArea from "@/hooks/useAutosizeTextArea";

export default function PostEditor() {
  const post = (useLoaderData() as {
    title: string;
    content: string;
    id?: number;
  } | null) || { title: "", content: "" };
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [showSaved, setShowSaved] = useState(false);
  const queryClient = useQueryClient();
  const updateMutation = useMutation<
    Post,
    Error,
    { id: number; data: PostUpdate }
  >(updatePost);
  const createMutation = useMutation<Post, Error, PostCreate>(createPost, {onSuccess: () => {
    queryClient.invalidateQueries("posts");
  }});
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const navigate = useNavigate();

  useAutosizeTextArea(textAreaRef.current, content);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleContentChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setContent(event.target.value);
  };

  const handleClick = () => {
    if (post.id) {
      updateMutation.mutate({ id: post.id, data: { title, content } });
    } else {
      createMutation.mutate({ title, content });
    }
    setShowSaved(true);
  };

  return (
    <div className="max-w-xl mx-auto">
      {showSaved && (
        <Alert className="mb-8 text-green-600 border border-green-600">
          <Check className="w-4 h-4 text-green-600" />
          <AlertTitle>Saved!</AlertTitle>
          <AlertDescription>Post Saved Succesfully!.</AlertDescription>
        </Alert>
      )}
      <div className="pb-4">
        <label
          htmlFor="post-title"
          className="block text-lg font-medium text-gray-800"
        >
          Post Title
        </label>
        <Input
          id="post-title"
          type="text"
          className="mt-1"
          value={title}
          onChange={handleTitleChange}
          placeholder="Enter the title of your post"
        />
      </div>
      <div className="pb-6">
        <label
          htmlFor="post-content"
          className="block text-lg font-medium text-gray-800"
        >
          Post Content
        </label>
        <Textarea
          ref={textAreaRef}
          onChange={handleContentChange}
          value={content}
        />
      </div>
      <div>
        <Button
          onClick={handleClick}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          Save
        </Button>
        <Button
          variant="outline"
          className="ml-2"
          onClick={() => navigate("/")}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
