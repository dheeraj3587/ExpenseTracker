'use client';

import { useState, useId, type FC } from 'react';
import { motion, AnimatePresence, MotionConfig, type Transition } from 'framer-motion';
import { AlignLeft, Calendar, Check, Flag, Tag, Type, X, Pencil, Plus } from 'lucide-react';
import useMeasure from 'react-use-measure';
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
}

const spring: Transition = {
  type: 'spring',
  stiffness: 420,
  damping: 28,
  mass: 0.6,
};

const EditableRow: FC<EditableRowProps> = ({ icon: Icon, label, value, onSave, type = 'text', multiline = false, options, initialEditing = false }) => {
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
    <motion.div layout transition={spring} className={`relative flex w-full ${multiline ? 'flex-col items-start gap-3' : 'flex-col gap-2 sm:flex-row sm:items-center sm:gap-4'}`}>
      <div className={`flex shrink-0 items-center gap-3 ${multiline ? 'w-full' : 'w-full sm:w-[100px]'}`}>
        <Icon size={18} style={{ color: 'var(--text-muted)' }} strokeWidth={1.5} />
        <label htmlFor={inputId} style={{ color: 'var(--text-muted)', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
          {label}
        </label>
      </div>

      <div className="relative w-full transition-colors" style={{ background: 'transparent' }}>
        <motion.div layout className="group/content w-full rounded-lg px-2 hover:bg-[rgba(0,0,0,0.02)] dark:hover:bg-white/5">
          <motion.div layout transition={spring} className={`relative flex min-h-[36px] w-full gap-2 overflow-hidden ${multiline ? 'flex-col py-2' : 'items-center'}`}>
            {options ? (
              <select
                id={inputId}
                disabled={!editing}
                value={editing ? tempValue : value}
                onChange={(e) => handleChange(e.target.value)}
                style={{ height: 36, width: '100%', borderRadius: 8, border: '1px solid transparent', background: 'transparent', fontSize: 14, fontWeight: 500, color: 'var(--text-primary)', outline: 'none', appearance: editing ? 'auto' : 'none', cursor: editing ? 'pointer' : 'default' }}
              >
                {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            ) : type === 'date' ? (
              <input
                id={inputId}
                type={editing ? "date" : "text"}
                readOnly={!editing}
                value={editing ? tempValue : (value || 'No date')}
                onChange={(e) => handleChange(e.target.value)}
                style={{ height: 36, width: '100%', borderRadius: 8, border: '1px solid transparent', background: 'transparent', fontSize: 14, fontWeight: 500, color: 'var(--text-primary)', outline: 'none' }}
              />
            ) : multiline ? (
              <textarea
                id={inputId}
                autoFocus
                readOnly={!editing}
                rows={2}
                value={editing ? tempValue : value}
                onChange={(e) => handleChange(e.target.value)}
                placeholder="Add description..."
                style={{ width: '100%', resize: 'none', borderRadius: 8, background: 'transparent', padding: '6px 0', fontSize: 14, fontWeight: 500, color: 'var(--text-primary)', outline: 'none', border: 'none' }}
              />
            ) : (
              <input
                id={inputId}
                autoFocus
                type="text"
                readOnly={!editing}
                value={editing ? tempValue : value}
                onChange={(e) => handleChange(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                placeholder={`Enter ${label.toLowerCase()}...`}
                style={{ height: 36, width: '100%', borderRadius: 8, background: 'transparent', border: 'none', fontSize: 14, fontWeight: 500, color: 'var(--text-primary)', outline: 'none' }}
              />
            )}

            <div className="mr-0.5 flex shrink-0 items-center justify-end">
              <AnimatePresence mode="popLayout" initial={false}>
                {editing ? (
                  <motion.div key="edit" style={{ display: 'flex', gap: 4 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.3 }}>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleSave} style={{ background: 'var(--accent)', color: '#fff', width: 24, height: 24, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}>
                      <Check size={14} />
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleCancel} style={{ background: 'var(--bg-hover)', color: 'var(--text-primary)', width: 24, height: 24, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}>
                      <X size={14} />
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.div exit={{ opacity: 1 }} key="view" className={`flex items-center justify-center rounded-lg border opacity-0 shadow-sm group-hover/content:opacity-100 ${multiline ? 'mt-1 self-end' : ''}`} onClick={() => { setTempValue(value); setEditing(true); }} style={{ width: 24, height: 24, background: 'var(--bg-card)', borderColor: 'var(--border)', cursor: 'pointer' }}>
                    <Pencil size={12} style={{ color: 'var(--text-muted)' }} />
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

interface MorphingCreateTaskProps {
  onCreate: (values: TaskFormValues) => void;
}

export function MorphingCreateTask({ onCreate }: MorphingCreateTaskProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [ref, bounds] = useMeasure({ offsetSize: true });
  const [data, setData] = useState<TaskFormValues>({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    category: '',
  });

  const handleClose = () => {
    setData({
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium',
      category: '',
    });
    setIsOpen(false);
  };

  return (
    <MotionConfig transition={{ type: 'spring', stiffness: 280, damping: 26 }}>
      <div className="fixed-fab-container">
        <motion.div
          className="overflow-hidden shadow-xl transition-colors duration-400 ease-out"
          style={{
            background: isOpen ? 'var(--bg-card)' : 'var(--accent)',
            border: isOpen ? '1px solid var(--border)' : '1px solid transparent',
            borderRadius: isOpen ? 16 : 9999,
          }}
          animate={{
            width: bounds.width > 0 ? bounds.width : (isOpen ? 420 : 56),
            height: bounds.height > 0 ? bounds.height : (isOpen ? 350 : 56),
          }}
        >
          <div ref={ref} className={isOpen ? "w-[90vw] sm:w-[420px]" : "w-14 h-14 flex items-center justify-center"}>
            <AnimatePresence mode="popLayout" initial={false}>
              {!isOpen ? (
                <motion.div
                  key="close"
                  className="cursor-pointer flex items-center justify-center shrink-0"
                  style={{ width: 56, height: 56 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  onClick={() => setIsOpen(true)}
                >
                  <Plus size={24} style={{ color: '#fff', flexShrink: 0 }} />
                </motion.div>
              ) : (
                <motion.div
                  key="open"
                  className="flex flex-col"
                  initial={{ opacity: 0, filter: 'blur(4px)', scale: 0.96 }}
                  animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
                  exit={{ opacity: 0, filter: 'blur(4px)', scale: 0.96 }}
                  transition={{ delay: 0.05, type: 'spring', stiffness: 300, damping: 25 }}
                >
                  <div className="px-5 py-4 border-b flex justify-between items-center" style={{ borderColor: 'var(--border)', background: 'var(--bg-hover)' }}>
                    <h4 style={{ color: 'var(--text-muted)', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Create New Task
                    </h4>
                    <button type="button" className="btn-ghost-icon" onClick={handleClose}>
                      <X size={16} />
                    </button>
                  </div>

                  <div className="px-3 py-3 space-y-1">
                    <EditableRow icon={Type} label="Title" value={data.title} onSave={(v) => setData({ ...data, title: v })} initialEditing={true} />
                    {!data.title.trim() && (
                      <p style={{ color: 'var(--error-text)', fontSize: 11, paddingLeft: 40, marginTop: -2, marginBottom: 4 }}>
                        * Task name is required
                      </p>
                    )}
                    <EditableRow icon={Calendar} label="Due Date" type="date" value={data.dueDate} onSave={(v) => setData({ ...data, dueDate: v })} />
                    <EditableRow icon={Flag} label="Priority" value={data.priority} options={[{ value: 'critical', label: 'Critical' }, { value: 'high', label: 'High' }, { value: 'medium', label: 'Medium' }, { value: 'low', label: 'Low' }]} onSave={(v) => setData({ ...data, priority: v as any })} />
                    <EditableRow icon={Tag} label="Category" value={data.category} onSave={(v) => setData({ ...data, category: v })} />
                    <div className="mt-1 border-t pt-2" style={{ borderColor: 'var(--border)' }}>
                      <EditableRow icon={AlignLeft} label="Description" multiline value={data.description} onSave={(v) => setData({ ...data, description: v })} />
                    </div>
                  </div>

                  <div className="px-5 py-3 border-t flex justify-end gap-3" style={{ borderColor: 'var(--border)', background: 'var(--bg-hover)' }}>
                    <button type="button" className="btn-secondary" onClick={handleClose} style={{ fontSize: 13, padding: '6px 12px' }}>Cancel</button>
                    <button type="button" className="btn-primary disabled:opacity-50 disabled:pointer-events-none" disabled={!data.title.trim()} onClick={() => {
                      onCreate(data);
                      setData({
                        title: '',
                        description: '',
                        dueDate: '',
                        priority: 'medium',
                        category: '',
                      });
                      setIsOpen(false);
                    }} style={{ fontSize: 13, padding: '6px 14px' }}>Create task</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </MotionConfig>
  );
}
