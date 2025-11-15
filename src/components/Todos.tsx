import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

async function fetchTodoList() {
  const res = await api.get("/todo");
  return res.data;
}

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  completed: z.boolean().optional(),
});

type FormData = z.infer<typeof schema>;

type Todo = {
  _id: string;
  title: string;
  completed?: boolean;
  createdAt?: string;
};

const Todos: React.FC = () => {
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { title: "", completed: false },
  });

  const { isPending, data, error } = useQuery<Todo[] | { todos: Todo[] }>({
    queryKey: ["todos"],
    queryFn: fetchTodoList,
    staleTime: 1000 * 30,
    refetchOnWindowFocus: false,
  });

  const todos: Todo[] = Array.isArray(data)
    ? data
    : Array.isArray(data?.todos)
    ? data.todos
    : [];

  const addTodo = useMutation({
    mutationFn: async (payload: FormData) => {
      const res = await api.post("/todo", payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const deleteTodo = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/todo/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const toggleTodo = useMutation({
    mutationFn: async ({
      id,
      completed,
    }: {
      id: string;
      completed: boolean;
    }) => {
      const res = await api.patch(`/todo/${id}`, { completed });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const onSubmit = async (formData: FormData) => {
    formData.completed = false;
    addTodo.mutate(formData, {
      onSuccess: () => {
        reset();
      },
    });
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
    deleteTodo.mutate(id, {
      onSettled: () => {
        setDeletingId(null);
      },
    });
  };

  const handleToggle = (todo: Todo) => {
    setTogglingId(todo._id);
    toggleTodo.mutate(
      { id: todo._id, completed: !todo.completed },
      {
        onSettled: () => {
          setTogglingId(null);
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Your Todos
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex items-center gap-3 mb-6"
          noValidate
        >
          <input
            {...register("title")}
            type="text"
            placeholder="Add a new todo..."
            className="grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-invalid={!!errors.title}
            aria-describedby="title-error"
            disabled={isSubmitting || addTodo.isPending}
          />
          <button
            type="submit"
            disabled={isSubmitting || addTodo.isPending}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            {isSubmitting || addTodo.isPending ? "Adding..." : "Add"}
          </button>
        </form>

        {errors.title && (
          <p id="title-error" className="text-sm text-red-600 mb-4">
            {errors.title.message}
          </p>
        )}

        <div className="space-y-3">
          {error && (
            <p className="text-red-600">
              {error instanceof Error ? error.message : String(error)}
            </p>
          )}
          {isPending && <p>Loading...</p>}
          {todos.map((todo: Todo) => (
            <div
              key={todo._id}
              className="flex items-center justify-between bg-gray-50 p-3 rounded-md border"
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={!!todo.completed}
                  onChange={() => handleToggle(todo)}
                  className="h-4 w-4"
                  disabled={!!deletingId || togglingId === todo._id}
                />
                <span
                  className={`text-gray-800 ${
                    todo.completed ? "line-through text-gray-400" : ""
                  }`}
                >
                  {todo.title}
                </span>
                {togglingId === todo._id && (
                  <span className="text-xs text-gray-500 ml-2">
                    Updating...
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleDelete(todo._id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                  disabled={!!deletingId}
                >
                  {deletingId === todo._id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Todos;
