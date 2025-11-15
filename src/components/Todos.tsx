import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "../store/auth";
import TodoItem, { type Todo } from "../components/TodoItem";

async function fetchTodoList() {
  const res = await api.get("/todo");
  return res.data;
}

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  completed: z.boolean().optional(),
});

type FormData = z.infer<typeof schema>;

const Todos = () => {
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
    const payload = { ...formData, completed: false };
    addTodo.mutate(payload, {
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
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Your Todos</h1>

          <button
            onClick={() => useAuthStore.getState().logout()}
            className="text-sm px-3 py-1 border border-gray-200 rounded-md text-gray-700 hover:bg-gray-50 transition"
          >
            Logout
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex items-center gap-3 mb-4"
          noValidate
        >
          <input
            {...register("title")}
            type="text"
            placeholder="Add a new todo..."
            className="grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-0"
            aria-invalid={!!errors.title}
            aria-describedby="title-error"
            disabled={isSubmitting || addTodo.isPending}
          />

          <button
            type="submit"
            disabled={isSubmitting || addTodo.isPending}
            className="rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:outline-none active:bg-slate-700 disabled:pointer-events-none disabled:opacity-50 ml-2"
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

          <ul className="space-y-3">
            {todos.map((todo: Todo) => (
              <TodoItem
                key={todo._id}
                todo={todo}
                deletingId={deletingId}
                togglingId={togglingId}
                onToggle={handleToggle}
                onDelete={handleDelete}
              />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Todos;
