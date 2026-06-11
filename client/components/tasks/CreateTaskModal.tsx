import { useEffect, useState, useId, type FC } from 'react';
import { motion, AnimatePresence, type Transition } from 'framer-motion';
import {
  AlignLeft,
  Calendar,
  Check,
  Flag,
  Tag,
  Type,
  X,
  Pencil
} from 'lucide-react';
import type { TaskFormValues } from '@/types/task';

interface EditableRowProps {
  icon: any;
  label: string;
  value: string;
  onSave?: (value: string) => void;
  type?: 'text' | 'date';
  multiline?: boolean;
  options?: { value: string; label: string }[];
  initialEditing?: boolean;
  maxLength?: number;
}

const spring: Transition = {
  type: 'spring',
  stiffness: 420,
  damping: 28,
  mass: 0.6,
};

const EditableRow: FC<EditableRowProps> = ({
  icon: Icon,
  label,
  value,
  onSave,
  type = 'text',
  multiline = false,
  options,
  initialEditing = false,
  maxLength,
}) => {
  const [editing, setEditing] = useState(initialEditing);
  const [tempValue, setTempValue] = useState(value);
  const inputId = useId();

  const handleChange = (newValue: string) => {
    setTempValue(newValue);
    if (onSave) onSave(newValue);
  };

  const handleSave = () => {
    if (onSave) onSave(tempValue);
    setEditing(false);
  };

  const handleCancel = () => {
    setTempValue(value);
    if (onSave) onSave(value);
    setEditing(false);
  };

  return (
    <motion.div
      layout
      transition={spring}
      className={`relative flex w-full ${multiline ? 'flex-col items-start gap-4' : 'flex-col gap-2 sm:flex-row sm:items-center sm:gap-4'}`}
    >
      <div className={`flex shrink-0 items-center gap-3 ${multiline ? 'w-full' : 'w-full sm:w-[130px]'}`}>
        <Icon size={20} style={{ color: 'var(--text-muted)' }} strokeWidth={1.5} />
        <label htmlFor={inputId} style={{ color: 'var(--text-muted)', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>
          {label}
        </label>
      </div>

      <div className="relative w-full transition-colors" style={{ background: 'transparent' }}>
        <motion.div layout className="group/content w-full rounded-lg px-2 sm:px-3 hover:bg-[rgba(0,0,0,0.02)] dark:hover:bg-white/5">
          <motion.div layout transition={spring} className={`relative flex min-h-[40px] w-full gap-2 overflow-hidden ${multiline ? 'flex-col py-2.5' : 'items-center'}`}>
            
            {options ? (
              <select
                id={inputId}
                disabled={!editing}
                value={editing ? tempValue : value}
                onChange={(e) => handleChange(e.target.value)}
                style={{
                  height: 40, width: '100%', borderRadius: 8, border: '1px solid transparent',
                  background: 'transparent', fontSize: 15, fontWeight: 500, color: 'var(--text-primary)',
                  outline: 'none', appearance: editing ? 'auto' : 'none', cursor: editing ? 'pointer' : 'default'
                }}
              >
                {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            ) : type === 'date' ? (
              <input
                id={inputId}
                type={editing ? "date" : "text"}
                readOnly={!editing}
                value={editing ? tempValue : (value || 'No due date')}
                onChange={(e) => handleChange(e.target.value)}
                style={{
                  height: 40, width: '100%', borderRadius: 8, border: '1px solid transparent',
                  background: 'transparent', fontSize: 15, fontWeight: 500, color: 'var(--text-primary)',
                  outline: 'none'
                }}
              />
            ) : multiline ? (
              <textarea
                id={inputId}
                autoFocus
                readOnly={!editing}
                rows={3}
                maxLength={maxLength}
                value={editing ? tempValue : value}
                onChange={(e) => handleChange(e.target.value)}
                placeholder="Add description..."
                style={{
                  width: '100%', resize: 'none', borderRadius: 8, background: 'transparent',
                  padding: '8px 0', fontSize: 15, fontWeight: 500, color: 'var(--text-primary)', outline: 'none', border: 'none'
                }}
              />
            ) : (
              <input
                id={inputId}
                autoFocus
                type="text"
                readOnly={!editing}
                maxLength={maxLength}
                value={editing ? tempValue : value}
                onChange={(e) => handleChange(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                placeholder={`Enter ${label.toLowerCase()}...`}
                style={{
                  height: 40, width: '100%', borderRadius: 8, background: 'transparent', border: 'none',
                  fontSize: 15, fontWeight: 500, color: 'var(--text-primary)', outline: 'none'
                }}
              />
            )}

            <div className="mr-0.5 flex shrink-0 items-center justify-end">
              <AnimatePresence mode="popLayout" initial={false}>
                {editing ? (
                  <motion.div
                    key="edit"
                    style={{ display: 'flex', gap: 4 }}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 40 }}
                    transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
                  >
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSave}
                      style={{ background: 'var(--accent)', color: '#fff', width: 28, height: 28, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}
                    >
                      <Check size={16} />
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleCancel}
                      style={{ background: 'var(--bg-hover)', color: 'var(--text-primary)', width: 28, height: 28, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}
                    >
                      <X size={16} />
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.div
                    exit={{ opacity: 1 }}
                    key="view"
                    className={`flex items-center justify-center rounded-lg border opacity-0 shadow-sm group-hover/content:opacity-100 ${multiline ? 'mt-1 self-end' : ''}`}
                    onClick={() => { setTempValue(value); setEditing(true); }}
                    style={{ width: 28, height: 28, background: 'var(--bg-card)', borderColor: 'var(--border)', cursor: 'pointer' }}
                  >
                    <Pencil size={14} style={{ color: 'var(--text-muted)' }} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

interface CreateTaskModalProps {
  onClose: () => void;
  onCreate: (values: TaskFormValues) => void;
}

export function CreateTaskModal({ onClose, onCreate }: CreateTaskModalProps) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const [data, setData] = useState<TaskFormValues>({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    category: '',
  });

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <motion.div
        layout
        className="mx-auto h-fit w-[92vw] max-w-xs rounded-lg border p-1.5 shadow-sm sm:mx-0 sm:w-[460px] sm:max-w-none"
        style={{ background: 'var(--bg-hover)', borderColor: 'var(--border)' }}
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.97 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        role="dialog"
        aria-modal="true"
      >
        <div className="w-full overflow-hidden rounded-lg border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
          <div className="rounded-t-lg border-b px-6 py-4" style={{ background: 'var(--bg-hover)', borderColor: 'var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ color: 'var(--text-muted)', fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Create New Task
            </h4>
            <button type="button" className="btn-ghost-icon" onClick={onClose} aria-label="Close">
              <X size={16} />
            </button>
          </div>

          <div className="space-y-4 px-4 py-3 sm:space-y-1">
            <EditableRow
              icon={Type}
              label="Title"
              value={data.title}
              maxLength={120}
              onSave={(v) => setData({ ...data, title: v })}
              initialEditing={true}
            />
            {!data.title.trim() && (
              <p style={{ color: 'var(--error-text)', fontSize: 11, paddingLeft: 40, marginTop: -2, marginBottom: 4 }}>
                * Task name is required
              </p>
            )}
            <EditableRow
              icon={Calendar}
              label="Due Date"
              type="date"
              value={data.dueDate}
              onSave={(v) => setData({ ...data, dueDate: v })}
            />
            <EditableRow
              icon={Flag}
              label="Priority"
              value={data.priority}
              options={[
                { value: 'critical', label: 'Critical' },
                { value: 'high', label: 'High' },
                { value: 'medium', label: 'Medium' },
                { value: 'low', label: 'Low' }
              ]}
              onSave={(v) => setData({ ...data, priority: v as any })}
            />
            <EditableRow
              icon={Tag}
              label="Category"
              value={data.category}
              maxLength={50}
              onSave={(v) => setData({ ...data, category: v })}
            />
            <div className="mt-2 border-t pt-4" style={{ borderColor: 'var(--border)' }}>
              <EditableRow
                icon={AlignLeft}
                label="Description"
                multiline
                value={data.description}
                maxLength={700}
                onSave={(v) => setData({ ...data, description: v })}
              />
            </div>
          </div>

          <div className="px-6 py-4 border-t flex justify-end gap-3" style={{ background: 'var(--bg-hover)', borderColor: 'var(--border)' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="button" className="btn-primary disabled:opacity-50 disabled:pointer-events-none" disabled={!data.title.trim()} onClick={() => onCreate(data)}>Create task</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
