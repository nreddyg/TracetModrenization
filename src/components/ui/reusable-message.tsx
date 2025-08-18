import React, { useState, useEffect, useRef, createContext, useContext, useCallback } from 'react';
import { AlertCircle, CheckCircle, Info, XCircle, X, Loader2 } from 'lucide-react';
 
// Utility function for class names
function cn(...classes: (string | undefined | null | boolean)[]): string {
  return classes.filter(Boolean).join(' ');
}
 
// Types
export type MessageType = 'success' | 'error' | 'warning' | 'info' | 'loading';
 
export interface MessageConfig {
  type?: MessageType;
  content: React.ReactNode;
  duration?: number;
  key?: string | number;
  className?: string;
  style?: React.CSSProperties;
  onClose?: () => void;
  icon?: React.ReactNode;
  closable?: boolean;
  onClick?: () => void;
}
 
export interface MessageInstance {
  id: string;
  config: MessageConfig;
  visible: boolean;
  timer?: NodeJS.Timeout;
  createdAt: number;
}
 
export interface MessageMethodReturn {
  (): void;
}
 
// Global Configuration Interface
interface MessageGlobalConfig {
  top?: number;
  duration?: number;
  maxCount?: number;
  rtl?: boolean;
  prefixCls?: string;
  getContainer?: () => HTMLElement;
}
 
// Message Item Component
interface MessageItemProps {
  instance: MessageInstance;
  onRemove: (id: string) => void;
  position: 'top' | 'bottom';
}
 
const MessageItem: React.FC<MessageItemProps> = ({ instance, onRemove, position }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
 
  const { config } = instance;
  const {
    type = 'info',
    content,
    duration = 3,
    onClose,
    onClick,
    icon,
    closable = true,
    className,
    style
  } = config;
 
  const icons = {
    success: <CheckCircle className="h-4 w-4" />,
    error: <XCircle className="h-4 w-4" />,
    warning: <AlertCircle className="h-4 w-4" />,
    info: <Info className="h-4 w-4" />,
    loading: <Loader2 className="h-4 w-4 animate-spin" />
  };
 
  const typeClasses = {
    success: 'bg-white border-green-200 text-green-800 shadow-lg',
    error: 'bg-white border-red-200 text-red-800 shadow-lg',
    warning: 'bg-white border-yellow-200 text-yellow-800 shadow-lg',
    info: 'bg-white border-blue-200 text-blue-800 shadow-lg',
    loading: 'bg-white border-blue-200 text-blue-800 shadow-lg'
  };
 
  const iconClasses = {
    success: 'text-green-500',
    error: 'text-red-500',
    warning: 'text-yellow-500',
    info: 'text-blue-500',
    loading: 'text-blue-500'
  };
 
  useEffect(() => {
    const enterTimer = setTimeout(() => setIsVisible(true), 10);
 
    if (duration > 0) {
      timeoutRef.current = setTimeout(() => {
        handleClose();
      }, duration * 1000);
    }
 
    return () => {
      clearTimeout(enterTimer);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [duration]);
 
  const handleClose = useCallback(() => {
    setIsLeaving(true);
    onClose?.();
   
    setTimeout(() => {
      onRemove(instance.id);
    }, 300);
  }, [instance.id, onClose, onRemove]);
 
  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };
 
  const handleMouseLeave = () => {
    if (duration > 0) {
      timeoutRef.current = setTimeout(() => {
        handleClose();
      }, duration * 1000);
    }
  };
 
  const handleClick = () => {
    onClick?.();
  };
 
  return (
    <div
      className={cn(
        "transition-all duration-300 ease-in-out transform",
        "mb-2 max-w-md mx-auto",
        isVisible && !isLeaving ? "translate-y-0 opacity-100 scale-100" :
        position === 'top' ? "-translate-y-2 opacity-0 scale-95" : "translate-y-2 opacity-0 scale-95",
        isLeaving && (position === 'top' ? "-translate-y-2 opacity-0 scale-95" : "translate-y-2 opacity-0 scale-95")
      )}
      style={style}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={cn(
          "rounded-lg border px-4 py-3 flex items-center gap-3 min-w-0",
          typeClasses[type],
          onClick && "cursor-pointer hover:shadow-md",
          className
        )}
        onClick={handleClick}
      >
        <div className={cn("flex-shrink-0", iconClasses[type])}>
          {icon || icons[type]}
        </div>
       
        <div className="flex-1 min-w-0 text-sm font-medium">
          {content}
        </div>
       
        {closable && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
            }}
            className={cn(
              "flex-shrink-0 p-1 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors",
              iconClasses[type]
            )}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};
 
// Message Container Component
interface MessageContainerProps {
  instances: MessageInstance[];
  onRemove: (id: string) => void;
  position?: 'top' | 'bottom';
  offset?: number;
  maxCount?: number;
}
 
const MessageContainer: React.FC<MessageContainerProps> = ({
  instances,
  onRemove,
  position = 'top',
  offset = 24,
  maxCount = 5
}) => {
  const visibleInstances = instances.slice(0, maxCount);
 
  if (visibleInstances.length === 0) return null;
 
  return (
    <div
      className={cn(
        "fixed left-0 right-0 z-50 pointer-events-none",
        position === 'top' ? 'top-0' : 'bottom-0'
      )}
      style={{
        [position]: `${offset}px`
      }}
    >
      <div className="pointer-events-auto px-4">
        {visibleInstances.map((instance) => (
          <MessageItem
            key={instance.id}
            instance={instance}
            onRemove={onRemove}
            position={position}
          />
        ))}
      </div>
    </div>
  );
};
 
// Message Context
interface MessageContextType {
  instances: MessageInstance[];
  add: (config: MessageConfig) => MessageMethodReturn;
  remove: (id: string) => void;
  clear: () => void;
  config: MessageGlobalConfig;
  updateConfig: (config: Partial<MessageGlobalConfig>) => void;
}
 
const MessageContext = createContext<MessageContextType | null>(null);
 
// Message Provider Component - EXACT same props as your original
interface MessageProviderProps {
  children: React.ReactNode;
  position?: 'top' | 'bottom';
  offset?: number;
  duration?: number;
  maxCount?: number;
}
 
export const MessageProvider: React.FC<MessageProviderProps> = ({
  children,
  position = 'top',
  offset = 24,
  duration = 3,
  maxCount = 5
}) => {
  const [instances, setInstances] = useState<MessageInstance[]>([]);
  const [globalConfig, setGlobalConfig] = useState<MessageGlobalConfig>({
    top: offset,
    duration,
    maxCount
  });
 
  const add = useCallback((config: MessageConfig): MessageMethodReturn => {
    const id = config.key?.toString() || `message-${Date.now()}-${Math.random()}`;
   
    const newInstance: MessageInstance = {
      id,
      config: {
        duration: globalConfig.duration,
        ...config
      },
      visible: true,
      createdAt: Date.now()
    };
 
    setInstances(prev => {
      // If key exists, replace the existing message
      if (config.key) {
        const existingIndex = prev.findIndex(instance => instance.config.key === config.key);
        if (existingIndex !== -1) {
          const updated = [...prev];
          updated[existingIndex] = newInstance;
          return updated;
        }
      }
     
      // Add new message, respecting maxCount
      const updated = [...prev, newInstance];
      return updated.slice(-globalConfig.maxCount!);
    });
 
    // Return a function to close this specific message (Ant Design feature)
    return () => {
      setInstances(prev => prev.filter(instance => instance.id !== id));
    };
  }, [globalConfig]);
 
  const remove = useCallback((id: string) => {
    setInstances(prev => prev.filter(instance => instance.id !== id));
  }, []);
 
  const clear = useCallback(() => {
    setInstances([]);
  }, []);
 
  const updateConfig = useCallback((config: Partial<MessageGlobalConfig>) => {
    setGlobalConfig(prev => ({ ...prev, ...config }));
  }, []);
 
  const contextValue: MessageContextType = {
    instances,
    add,
    remove,
    clear,
    config: globalConfig,
    updateConfig
  };
 
  return (
    <MessageContext.Provider value={contextValue}>
      {children}
      <MessageContainer
        instances={instances}
        onRemove={remove}
        position={position}
        offset={offset}
        maxCount={maxCount}
      />
    </MessageContext.Provider>
  );
};
 
// Hook to use messages - Enhanced with Ant Design features
export const useMessage = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessage must be used within a MessageProvider');
  }
 
  const { add, remove, clear, updateConfig } = context;
 
  return {
    // Original API - unchanged
    success: (content: React.ReactNode, config?: Omit<MessageConfig, 'type' | 'content'>): MessageMethodReturn =>
      add({ ...config, type: 'success', content }),
   
    error: (content: React.ReactNode, config?: Omit<MessageConfig, 'type' | 'content'>): MessageMethodReturn =>
      add({ ...config, type: 'error', content }),
   
    warning: (content: React.ReactNode, config?: Omit<MessageConfig, 'type' | 'content'>): MessageMethodReturn =>
      add({ ...config, type: 'warning', content }),
   
    info: (content: React.ReactNode, config?: Omit<MessageConfig, 'type' | 'content'>): MessageMethodReturn =>
      add({ ...config, type: 'info', content }),
   
    loading: (content: React.ReactNode, config?: Omit<MessageConfig, 'type' | 'content'>): MessageMethodReturn =>
      add({ ...config, type: 'loading', content, duration: 0 }),
   
    open: (config: MessageConfig): MessageMethodReturn => add(config),
   
    destroy: (key?: string | number) => {
      if (key) {
        const instance = context.instances.find(i => i.config.key === key);
        if (instance) {
          remove(instance.id);
        }
      } else {
        clear();
      }
    },
 
    // New Ant Design features
    config: updateConfig
  };
};
 
// Static Message API
let messageApi: ReturnType<typeof useMessage> | null = null;
 
export const setMessageApi = (api: ReturnType<typeof useMessage>) => {
  messageApi = api;
};
 
// Global message instance - Enhanced with Ant Design API
export const message = {
  success: (content: React.ReactNode, duration?: number, onClose?: () => void): MessageMethodReturn | undefined => {
    if (!messageApi) return undefined;
    return messageApi.success(content, { duration, onClose });
  },
 
  error: (content: React.ReactNode, duration?: number, onClose?: () => void): MessageMethodReturn | undefined => {
    if (!messageApi) return undefined;
    return messageApi.error(content, { duration, onClose });
  },
 
  warning: (content: React.ReactNode, duration?: number, onClose?: () => void): MessageMethodReturn | undefined => {
    if (!messageApi) return undefined;
    return messageApi.warning(content, { duration, onClose });
  },
 
  info: (content: React.ReactNode, duration?: number, onClose?: () => void): MessageMethodReturn | undefined => {
    if (!messageApi) return undefined;
    return messageApi.info(content, { duration, onClose });
  },
 
  loading: (content: React.ReactNode, duration = 0): MessageMethodReturn | undefined => {
    if (!messageApi) return undefined;
    return messageApi.loading(content, { duration });
  },
 
  open: (config: MessageConfig): MessageMethodReturn | undefined => messageApi?.open(config),
 
  destroy: (key?: string | number) => messageApi?.destroy(key),
 
  config: (config: MessageGlobalConfig) => messageApi?.config(config)
};
 
// Original ReusableMessage component - EXACT same interface
export interface ReusableMessageProps {
  type?: MessageType;
  title?: string;
  description?: string;
  closable?: boolean;
  showIcon?: boolean;
  className?: string;
  onClose?: () => void;
  duration?: number;
  visible?: boolean;
}
 
export const ReusableMessage: React.FC<ReusableMessageProps> = ({
  type = 'info',
  title,
  description,
  closable = false,
  showIcon = true,
  className,
  onClose,
  duration = 0,
  visible = true
}) => {
  const [isVisible, setIsVisible] = useState(visible);
  const timeoutRef = useRef<NodeJS.Timeout>();
 
  const icons = {
    success: <CheckCircle className="h-5 w-5" />,
    error: <XCircle className="h-5 w-5" />,
    warning: <AlertCircle className="h-5 w-5" />,
    info: <Info className="h-5 w-5" />,
    loading: <Loader2 className="h-5 w-5 animate-spin" />
  };
 
  const typeClasses = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    loading: 'bg-blue-50 border-blue-200 text-blue-800'
  };
 
  const iconClasses = {
    success: 'text-green-400',
    error: 'text-red-400',
    warning: 'text-yellow-400',
    info: 'text-blue-400',
    loading: 'text-blue-400'
  };
 
  useEffect(() => {
    setIsVisible(visible);
  }, [visible]);
 
  useEffect(() => {
    if (duration > 0 && isVisible) {
      timeoutRef.current = setTimeout(() => {
        handleClose();
      }, duration * 1000);
    }
 
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [duration, isVisible]);
 
  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };
 
  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };
 
  const handleMouseLeave = () => {
    if (duration > 0 && isVisible) {
      timeoutRef.current = setTimeout(() => {
        handleClose();
      }, duration * 1000);
    }
  };
 
  if (!isVisible) return null;
 
  return (
    <div
      className={cn(
        "rounded-md border p-4 transition-opacity duration-300",
        typeClasses[type],
        className
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex">
        {showIcon && (
          <div className={cn("flex-shrink-0", iconClasses[type])}>
            {icons[type]}
          </div>
        )}
        <div className={cn("ml-3", !showIcon && "ml-0")}>
          {title && (
            <h3 className="text-sm font-medium">{title}</h3>
          )}
          {description && (
            <div className={cn("text-sm", title && "mt-2")}>
              {description}
            </div>
          )}
        </div>
        {closable && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                onClick={handleClose}
                className={cn(
                  "inline-flex rounded-md p-1.5 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2",
                  iconClasses[type]
                )}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
 