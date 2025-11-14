const Todos = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Container */}
      <div className="max-w-xl mx-auto bg-white rounded-lg shadow p-6">
        {/* Header */}
        <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Your Todos
        </h1>

        {/* Create Todo Input */}
        <div className="flex items-center gap-3 mb-6">
          <input
            type="text"
            placeholder="Add a new todo..."
            className="grow px-3 py-2 border border-gray-300 rounded-md 
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md 
                             hover:bg-blue-700 transition-colors"
          >
            Add
          </button>
        </div>

        {/* Todo List */}
        <div className="space-y-3">
          {/* Todo Item */}
          <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md border">
            <div className="flex items-center gap-3">
              <input type="checkbox" className="h-4 w-4" />
              <span className="text-gray-800">Learn React Query</span>
            </div>
            <button className="text-red-600 hover:text-red-800 text-sm">
              Delete
            </button>
          </div>

          {/* Todo Item */}
          <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md border">
            <div className="flex items-center gap-3">
              <input type="checkbox" className="h-4 w-4" />
              <span className="text-gray-800">Learn Zustand</span>
            </div>
            <button className="text-red-600 hover:text-red-800 text-sm">
              Delete
            </button>
          </div>

          {/* Todo Item */}
          <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md border">
            <div className="flex items-center gap-3">
              <input type="checkbox" className="h-4 w-4" />
              <span className="text-gray-800">Build Todo App</span>
            </div>
            <button className="text-red-600 hover:text-red-800 text-sm">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Todos;
