'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  motion,
  AnimatePresence,
  LayoutGroup,
  type Transition,
} from 'motion/react';
import { X, Trash2 } from 'lucide-react';

export interface DeleteConfirmComponentProps {
  taskId: string;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
}

const springTransition: Transition = {
  type: 'spring',
  bounce: 0,
  duration: 0.4,
};

export const DeleteConfirmComponent: React.FC<DeleteConfirmComponentProps> = ({
  taskId,
  title = 'Delete Task',
  description = 'Are you sure you want to delete this task? This action cannot be undone.',
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  onConfirm,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <LayoutGroup>
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              key="trigger"
              layoutId={`action-button-${taskId}`}
              onClick={() => setIsOpen(true)}
              className="btn-ghost-icon"
              style={{ color: 'var(--error-text)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              whileTap={{ scale: 0.95 }}
              transition={springTransition}
              aria-label="Delete"
            >
              <Trash2 size={13} />
            </motion.button>
          )}
        </AnimatePresence>

        {mounted && createPortal(
          <AnimatePresence>
            {isOpen && (
              <motion.div
                key="overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center px-4 backdrop-blur-sm"
                style={{ background: 'rgba(0,0,0,0.2)' }}
              >
                <motion.div
                  initial={{ y: 100, opacity: 0, scale: 0.98 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: 100, opacity: 0, scale: 0.98 }}
                  transition={springTransition}
                  className="relative w-[280px] max-w-full overflow-hidden rounded-[24px] border border-zinc-200 bg-white p-5 text-zinc-900 shadow-2xl md:w-[400px] md:rounded-[32px] md:p-6 dark:border-white/5 dark:bg-[#080808] dark:text-white"
                >
                  <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-5 right-5 text-zinc-400 transition-colors hover:text-zinc-950 dark:text-zinc-500 dark:hover:text-white cursor-pointer"
                  >
                    <X size={24} />
                  </button>

                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-red-100 md:h-10 md:w-10 dark:bg-red-900/30">
                      <Trash2 size={24} className="text-red-500 dark:text-red-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-zinc-900 md:text-2xl dark:text-white">
                      {title}
                    </h2>
                  </div>

                  <p className="my-4 max-w-xs text-sm font-medium text-zinc-500 md:my-6 md:text-base dark:text-[#727373]">
                    {description}
                  </p>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setIsOpen(false)}
                      className="h-11 flex-1 rounded-full bg-zinc-100 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-200 md:h-13 md:text-lg dark:bg-[#121212] dark:text-gray-300 dark:hover:bg-[#1a1a1a] cursor-pointer"
                    >
                      {cancelLabel}
                    </button>

                    <motion.button
                      layoutId={`action-button-${taskId}`}
                      onClick={() => {
                        onConfirm?.();
                        setIsOpen(false);
                      }}
                      className="h-11 flex-1 cursor-pointer rounded-full bg-red-500 text-sm font-medium text-white hover:bg-red-600 md:h-13 md:text-lg transition-colors"
                      transition={springTransition}
                    >
                      {confirmLabel}
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
      </LayoutGroup>
    </>
  );
};
