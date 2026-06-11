'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence, MotionConfig } from 'framer-motion';
import { Plus } from 'lucide-react';
import { BsFileTextFill } from 'react-icons/bs';
import { FaBell } from 'react-icons/fa6';
import { TbFileFilled } from 'react-icons/tb';
import { IoIosFolder } from 'react-icons/io';
import useMeasure from 'react-use-measure';
import type { IconType } from 'react-icons';

interface TooltipItem {
  id: string;
  title: string;
  description: string;
  icon: IconType;
}

interface FloatingDisclosureProps {
  items?: TooltipItem[];
  onAction?: (id: string) => void;
}

export const defaultItems: TooltipItem[] = [
  {
    id: 'task',
    title: 'Task',
    description: 'Create a new task',
    icon: BsFileTextFill,
  },
  {
    id: 'reminder',
    title: 'Reminder',
    description: 'Create reminders',
    icon: FaBell,
  },
  {
    id: 'note',
    title: 'Note',
    description: 'Capture ideas',
    icon: TbFileFilled,
  },
  {
    id: 'project',
    title: 'Project',
    description: 'Organise projects',
    icon: IoIosFolder,
  },
];

export const FloatingDisclosure = ({ items = defaultItems, onAction }: FloatingDisclosureProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [ref, bounds] = useMeasure({ offsetSize: true });

  const handleAction = (id: string) => {
    if (onAction) onAction(id);
    setIsOpen(false);
  };

  return (
    <MotionConfig
      transition={{
        type: 'spring',
        stiffness: 280,
        damping: 26,
      }}
    >
      <div style={{ position: 'fixed', bottom: 32, right: 32, zIndex: 40, display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
        <motion.div
          className="flex items-center justify-center overflow-hidden rounded-3xl shadow-xl transition-colors duration-400 ease-out"
          style={{
            background: isOpen ? 'var(--bg-card)' : 'var(--accent)',
            border: isOpen ? '1px solid var(--border)' : '1px solid transparent',
          }}
          animate={{
            width: bounds.width > 0 ? bounds.width : 'auto',
            height: bounds.height > 0 ? bounds.height : 'auto',
          }}
        >
          <AnimatePresence mode="popLayout">
            {isOpen && (
              <motion.div
                className="absolute z-10 flex cursor-pointer items-center gap-2 rounded-2xl border px-4 py-1.5"
                style={{ background: 'var(--bg-hover)', borderColor: 'var(--border)' }}
                initial={{
                  opacity: 0,
                  filter: 'blur(8px)',
                  y: 0,
                  top: '50%',
                  left: '50%',
                  x: '-50%',
                }}
                animate={{
                  opacity: 1,
                  filter: 'blur(0px)',
                  y: -170,
                  top: '50%',
                  left: '50%',
                  x: '-50%',
                  pointerEvents: 'auto',
                }}
                exit={{
                  opacity: 0,
                  filter: 'blur(8px)',
                  y: 0,
                }}
                transition={{
                  type: 'spring',
                  delay: 0.05,
                  duration: 0.6,
                  bounce: 0.3,
                }}
                onClick={() => setIsOpen(false)}
              >
                <Plus
                  className={`rotate-0 transition-transform duration-300 ease-in-out ${isOpen ? 'rotate-45' : ''}`}
                  style={{ color: 'var(--text-primary)' }}
                />
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={ref} className="p-2">
            <AnimatePresence mode="popLayout" initial={false}>
              {!isOpen ? (
                <motion.div
                  key="close"
                  className="shrink-0 cursor-pointer px-4 py-2 flex items-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 0.2,
                    ease: 'easeOut',
                  }}
                  onClick={() => setIsOpen(!isOpen)}
                >
                  <Plus className="h-6 w-6" style={{ color: '#fff' }} />
                  <span style={{ color: '#fff', fontWeight: 600 }}>New task</span>
                </motion.div>
              ) : (
                <motion.div key="open" className="flex shrink-0 flex-col gap-3 p-1">
                  {items.map((item) => (
                    <motion.div
                      key={item.title}
                      className="flex flex-1 shrink-0 cursor-pointer items-center gap-2 rounded-xl p-2 transition-colors hover:bg-[rgba(0,0,0,0.04)] dark:hover:bg-white/5"
                      initial={{
                        opacity: 0,
                        filter: 'blur(4px)',
                        y: 20,
                        scale: 1,
                      }}
                      animate={{
                        opacity: 1,
                        filter: 'blur(0px)',
                        y: 0,
                        scale: 1,
                      }}
                      exit={{
                        opacity: 0,
                        filter: 'blur(4px)',
                        transition: { duration: 0.2, ease: 'easeOut' },
                      }}
                      transition={{
                        delay: 0.15,
                        type: 'spring',
                        stiffness: 200,
                        damping: 20,
                      }}
                      onClick={() => handleAction(item.id)}
                    >
                      <div className="shrink-0 rounded-lg p-2" style={{ background: 'var(--bg-hover)' }}>
                        <item.icon className="h-5 w-5" style={{ color: 'var(--text-muted)' }} />
                      </div>

                      <div className="flex w-52 flex-col leading-none">
                        <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                          {item.title}
                        </p>
                        <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                          {item.description}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </MotionConfig>
  );
};
