import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, ListTodo, LogOut, Bell, Filter, Search, Calendar } from 'lucide-react';
import { TodoItem } from './components/TodoItem';
import { Login } from './components/Login';
import { Todo, User } from './types';

export default function App() {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [todos, setTodos] = useState<Todo[]>(() => {
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
  });
  
  const [newTodo, setNewTodo] = useState('');
  const [reminder, setReminder] = useState<string>('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'priority'>('date');
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('todos', JSON.stringify(todos));
    }
  }, [todos, user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('todos');
    }
  }, [user]);

  useEffect(() => {
    const checkReminders = setInterval(() => {
      todos.forEach(todo => {
        if (todo.reminder && new Date(todo.reminder) <= new Date() && !todo.completed) {
          new Notification(`Reminder: ${todo.text}`, {
            body: 'This task is due now!',
            icon: '/notification-icon.png'
          });
        }
      });
    }, 60000);

    return () => clearInterval(checkReminders);
  }, [todos]);

  useEffect(() => {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  const DEMO_USER = { id: '1234', username: '1234', password: '1234' };

  const handleLogin = (username: string, password: string) => {
    if (username === DEMO_USER.username && password === DEMO_USER.password) {
      setUser(DEMO_USER);
    } else {
      alert('Invalid credentials! Use ID: 1234 and Password: 1234');
    }
  };

  const handleRegister = (username: string, password: string) => {
    alert('For demo purposes, please use ID: 1234 and Password: 1234');
  };

  const handleLogout = () => {
    setUser(null);
    setTodos([]);
  };

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    
    const todoTags = newTodo.match(/#\w+/g)?.map(tag => tag.slice(1)) || [];
    const todoText = newTodo.replace(/#\w+/g, '').trim();
    
    const todo: Todo = {
      id: Date.now().toString(),
      text: todoText,
      completed: false,
      createdAt: new Date(),
      reminder: reminder ? new Date(reminder) : undefined,
      priority,
      tags: todoTags
    };
    
    setTodos([todo, ...todos]);
    setTags([...new Set([...tags, ...todoTags])]);
    setNewTodo('');
    setReminder('');
    setPriority('medium');
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const updateReminder = (id: string, reminder: Date | undefined) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, reminder } : todo
    ));
  };

  const filteredAndSortedTodos = todos
    .filter(todo => {
      const matchesSearch = todo.text.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPriority = filterPriority === 'all' || todo.priority === filterPriority;
      const matchesStatus = filterStatus === 'all' || 
        (filterStatus === 'completed' ? todo.completed : !todo.completed);
      const matchesTags = selectedTags.length === 0 || 
        selectedTags.every(tag => todo.tags?.includes(tag));
      
      return matchesSearch && matchesPriority && matchesStatus && matchesTags;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
    });

  const stats = {
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    high: todos.filter(t => t.priority === 'high' && !t.completed).length,
    upcoming: todos.filter(t => t.reminder && new Date(t.reminder) > new Date()).length
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-pink-50 py-8 px-4 flex items-center justify-center">
        <Login onLogin={handleLogin} onRegister={handleRegister} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-pink-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <ListTodo className="w-8 h-8 text-purple-500" />
              <h1 className="text-3xl font-bold text-gray-800">My Tasks</h1>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-red-500 hover:text-red-600"
            >
              <LogOut size={20} />
              Logout
            </motion.button>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-purple-600">Total Tasks</p>
              <p className="text-2xl font-bold text-purple-700">{stats.total}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-600">Completed</p>
              <p className="text-2xl font-bold text-green-700">{stats.completed}</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-red-600">High Priority</p>
              <p className="text-2xl font-bold text-red-700">{stats.high}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600">Upcoming</p>
              <p className="text-2xl font-bold text-blue-700">{stats.upcoming}</p>
            </div>
          </div>

          <form onSubmit={addTodo} className="space-y-4 mb-6">
            <div className="flex gap-2">
              <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="Add a new task... (Use #tag for tags)"
                className="flex-1 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="px-6 py-3 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              >
                <PlusCircle className="w-6 h-6" />
              </motion.button>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reminder
                </label>
                <div className="flex gap-2 items-center">
                  <Bell size={20} className="text-purple-500" />
                  <input
                    type="datetime-local"
                    value={reminder}
                    onChange={(e) => setReminder(e.target.value)}
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
                  className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
          </form>

          {/* Filters Section */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search tasks..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value as 'all' | 'low' | 'medium' | 'high')}
                className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Priorities</option>
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'completed')}
                className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'priority')}
                className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="date">Sort by Date</option>
                <option value="priority">Sort by Priority</option>
              </select>
            </div>

            {tags.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Filter by Tags:</p>
                <div className="flex flex-wrap gap-2">
                  {tags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => setSelectedTags(prev => 
                        prev.includes(tag) 
                          ? prev.filter(t => t !== tag)
                          : [...prev, tag]
                      )}
                      className={`px-3 py-1 rounded-full text-sm ${
                        selectedTags.includes(tag)
                          ? 'bg-purple-500 text-white'
                          : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                      }`}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <motion.ul layout>
            <AnimatePresence mode="popLayout">
              {filteredAndSortedTodos.map(todo => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={toggleTodo}
                  onDelete={deleteTodo}
                  onUpdateReminder={updateReminder}
                />
              ))}
            </AnimatePresence>
          </motion.ul>

          {filteredAndSortedTodos.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8 text-gray-500"
            >
              <p>No tasks found. Try adjusting your filters or add a new task!</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}