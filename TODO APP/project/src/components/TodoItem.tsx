import React, { useState, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Check, Trash2, Bell, BellOff, Tag } from 'lucide-react';
import { Todo } from '../types';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdateReminder: (id: string, reminder: Date | undefined) => void;
}

export const TodoItem = forwardRef<HTMLLIElement, TodoItemProps>(({ 
  todo, 
  onToggle, 
  onDelete,
  onUpdateReminder 
}, ref) => {
  const [showReminderInput, setShowReminderInput] = useState(false);
  const [reminderDate, setReminderDate] = useState(
    todo.reminder ? new Date(todo.reminder).toISOString().slice(0, 16) : ''
  );

  const handleReminderUpdate = () => {
    onUpdateReminder(todo.id, reminderDate ? new Date(reminderDate) : undefined);
    setShowReminderInput(false);
  };

  const priorityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
  };

  return (
    <motion.li
      ref={ref}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="group flex items-center justify-between bg-white p-4 rounded-lg shadow-sm mb-3 hover:shadow-md transition-shadow"
    >
      <motion.div
        className="flex items-center gap-3 flex-1"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <button
          onClick={() => onToggle(todo.id)}
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center
            ${todo.completed ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}
        >
          {todo.completed && <Check size={14} className="text-white" />}
        </button>
        
        <div className="flex-1">
          <span className={`text-gray-800 text-lg ${todo.completed ? 'line-through text-gray-400' : ''}`}>
            {todo.text}
          </span>
          <div className="flex flex-wrap gap-2 items-center mt-1">
            <span className={`text-xs px-2 py-1 rounded-full ${priorityColors[todo.priority]}`}>
              {todo.priority}
            </span>
            {todo.reminder && (
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Bell size={12} />
                {new Date(todo.reminder).toLocaleString()}
              </span>
            )}
            {todo.tags && todo.tags.length > 0 && (
              <div className="flex items-center gap-1">
                <Tag size={12} className="text-purple-500" />
                {todo.tags.map(tag => (
                  <span key={tag} className="text-xs text-purple-600">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
      
      <div className="flex items-center gap-2">
        {showReminderInput ? (
          <div className="flex items-center gap-2">
            <input
              type="datetime-local"
              value={reminderDate}
              onChange={(e) => setReminderDate(e.target.value)}
              className="px-2 py-1 rounded border border-gray-200 text-sm"
            />
            <button
              onClick={handleReminderUpdate}
              className="text-purple-500 hover:text-purple-600"
            >
              Save
            </button>
          </div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowReminderInput(true)}
            className="text-purple-500 hover:text-purple-600 p-2"
          >
            {todo.reminder ? <Bell size={18} /> : <BellOff size={18} />}
          </motion.button>
        )}
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onDelete(todo.id)}
          className="text-gray-400 hover:text-red-500 transition-colors p-2"
        >
          <Trash2 size={18} />
        </motion.button>
      </div>
    </motion.li>
  );
});

TodoItem.displayName = 'TodoItem';