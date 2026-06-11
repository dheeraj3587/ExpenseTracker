import { type FormEvent, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import type { Task, TaskFormValues } from '@/types/task';

interface EditTaskModalProps {
  task: Task;
  onClose: () => void;
  onUpdate: (id: string, values: TaskFormValues) => void;
}

export function EditTaskModal({ task, onClose, onUpdate }: EditTaskModalProps) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [dueDate, setDueDate] = useState(task.dueDate);
  const [priority, setPriority] = useState<TaskFormValues['priority']>(task.priority);
  const [category, setCategory] = useState(task.category);
  const [titleError, setTitleError] = useState('');
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => { titleRef.current?.focus(); }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { setTitleError('Title is required.'); titleRef.current?.focus(); return; }
    onUpdate(task.id, { title, description, dueDate, priority, category });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <motion.div
        className="modal-card"
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.97 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-modal-title"
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 22 }}>
          <div>
            <h2 id="edit-modal-title" style={{ fontSize: 22, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 3, letterSpacing: '-0.02em' }}>
              Edit task
            </h2>
            <p style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>Adjust details. Completion state is preserved.</p>
          </div>
          <button type="button" className="btn-ghost-icon" onClick={onClose} aria-label="Close"><X size={17} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 14 }}>
            <label htmlFor="e-title" className="field-label">Title <span style={{ color: 'var(--error-text)' }}>*</span></label>
            <input ref={titleRef} id="e-title" className="input-field" value={title} maxLength={120} onChange={(e) => { setTitle(e.target.value); if (titleError) setTitleError(''); }} autoComplete="off" />
            {titleError && <p className="field-error">{titleError}</p>}
          </div>

          <div style={{ marginBottom: 14 }}>
            <label htmlFor="e-desc" className="field-label">Description</label>
            <textarea id="e-desc" className="textarea-field" value={description} maxLength={700} onChange={(e) => setDescription(e.target.value)} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 22 }}>
            <div>
              <label htmlFor="e-due" className="field-label">Due date</label>
              <input id="e-due" type="date" className="input-field" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </div>
            <div>
              <label htmlFor="e-priority" className="field-label">Priority</label>
              <select id="e-priority" className="select-field" value={priority} onChange={(e) => setPriority(e.target.value as TaskFormValues['priority'])}>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div>
              <label htmlFor="e-category" className="field-label">Category</label>
              <input id="e-category" className="input-field" value={category} maxLength={50} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. Design" autoComplete="off" />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 9 }}>
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">Save changes</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
