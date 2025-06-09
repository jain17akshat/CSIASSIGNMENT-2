import React, { useState, useEffect } from 'react';

const TodoApp = () => {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : [];
  });

  const [input, setInput] = useState('');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('default');

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAdd = () => {
    const trimmed = input.trim();
    if (!trimmed) return alert('Task cannot be empty!');
    const newTask = {
      id: Date.now(),
      text: trimmed,
      completed: false,
    };
    setTasks([...tasks, newTask]);
    setInput('');
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const removeTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'active') return !task.completed;
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sort === 'alpha') return a.text.localeCompare(b.text);
    if (sort === 'completed') return a.completed - b.completed;
    return 0;
  });

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">📝 To-Do List</h2>
      
      <div className="flex mb-4 gap-2">
        <input
          type="text"
          className="flex-1 border px-2 py-1 rounded"
          placeholder="Add new task..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
        />
        <button
          onClick={handleAdd}
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
        >
          Add
        </button>
      </div>

      <div className="flex justify-between mb-4">
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="border px-2 py-1 rounded">
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="border px-2 py-1 rounded">
          <option value="default">Default</option>
          <option value="alpha">A → Z</option>
          <option value="completed">Incomplete First</option>
        </select>
      </div>

      <ul className="space-y-2">
        {sortedTasks.map(task => (
          <li
            key={task.id}
            className="flex items-center justify-between border px-2 py-1 rounded"
          >
            <div
              onClick={() => toggleTask(task.id)}
              className={`flex-1 cursor-pointer ${task.completed ? 'line-through text-gray-500' : ''}`}
            >
              {task.text}
            </div>
            <button
              onClick={() => removeTask(task.id)}
              className="text-red-500 hover:text-red-700 ml-2"
            >
              ✖
            </button>
          </li>
        ))}
      </ul>

      {sortedTasks.length === 0 && <p className="text-center text-gray-500 mt-4">No tasks found.</p>}
    </div>
  );
};

export default TodoApp;
