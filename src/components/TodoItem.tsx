export type Todo = {
  _id: string;
  title: string;
  completed?: boolean;
  createdAt?: string;
};

type Props = {
  todo: Todo;
  deletingId: string | null;
  togglingId: string | null;
  onToggle: (todo: Todo) => void;
  onDelete: (id: string) => void;
};

const TodoItem = ({
  todo,
  deletingId,
  togglingId,
  onToggle,
  onDelete,
}: Props) => {
  const isDeleting = deletingId === todo._id;
  const isToggling = togglingId === todo._id;

  return (
    <li className="flex items-center justify-between bg-gray-50 p-3 rounded-md border">
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={!!todo.completed}
          onChange={() => onToggle(todo)}
          className="h-4 w-4 cursor-pointer"
          disabled={isDeleting || isToggling}
          aria-label={`Mark ${todo.title} as ${
            todo.completed ? "incomplete" : "complete"
          }`}
        />

        <span
          className={`text-gray-800 ${
            todo.completed ? "line-through text-gray-400" : ""
          }`}
        >
          {todo.title}
        </span>

        {isToggling && (
          <span className="text-xs text-gray-500 ml-2">Updating...</span>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => onDelete(todo._id)}
          className={`px-3 py-1 text-sm rounded-md transition focus:outline-none ${
            isDeleting
              ? "bg-red-200 text-red-500 pointer-events-none opacity-70"
              : "bg-red-50 text-red-600 hover:bg-red-100 active:bg-red-200"
          }`}
          disabled={!!deletingId}
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </li>
  );
};

export default TodoItem;
