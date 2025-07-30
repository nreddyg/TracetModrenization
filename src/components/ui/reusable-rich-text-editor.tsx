
import React, { forwardRef, useCallback, useMemo, useRef, useEffect } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

// Register Quill formats for enterprise features
const Font = Quill.import('formats/font') as any;
if (Font) {
  Font.whitelist = ['arial', 'comic-sans', 'courier-new', 'georgia', 'helvetica', 'lucida'];
  Quill.register(Font, true);
}

const Size = Quill.import('formats/size') as any;
if (Size) {
  Size.whitelist = ['extra-small', 'small', 'medium', 'large', 'extra-large'];
  Quill.register(Size, true);
}

export interface ReusableRichTextEditorProps {
  label?: string;
  tooltip?: string;
  error?: string;
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  minHeight?: number;
  maxHeight?: number;
  showToolbar?: boolean;
  containerClassName?: string;
  className?: string;
  theme?: 'snow' | 'bubble';
  readOnly?: boolean;
  preserveWhitespace?: boolean;
  bounds?: string | HTMLElement;
  scrollingContainer?: string | HTMLElement;
  formats?: string[];
  modules?: any;
  onChange?: (value: string, delta?: any, source?: string, editor?: any) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onSelection?: (range: any, source: string, editor: any) => void;
}

export const ReusableRichTextEditor = forwardRef<ReactQuill, ReusableRichTextEditorProps>(
  ({ 
    label, 
    tooltip, 
    error, 
    value = '',
    placeholder = "Start typing...",
    disabled = false,
    readOnly = false,
    minHeight = 120,
    maxHeight = 400,
    showToolbar = true,
    containerClassName,
    className,
    theme = 'snow',
    preserveWhitespace = false,
    bounds,
    scrollingContainer,
    formats,
    modules: customModules,
    onChange,
    onFocus,
    onBlur,
    onSelection,
    ...props
  }, ref) => {
    
    const quillRef = useRef<ReactQuill>(null);
    const editorRef = ref || quillRef;

    // Enterprise-grade toolbar configuration
    const defaultModules = useMemo(() => ({
      toolbar: showToolbar ? {
        container: [
          [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
          [{ 'font': Font?.whitelist || [] }],
          [{ 'size': Size?.whitelist || [] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ 'color': [] }, { 'background': [] }],
          [{ 'script': 'sub'}, { 'script': 'super' }],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
          [{ 'indent': '-1'}, { 'indent': '+1' }],
          [{ 'direction': 'rtl' }],
          [{ 'align': [] }],
          ['blockquote', 'code-block'],
          ['link', 'image', 'video', 'formula'],
          ['clean']
        ],
        handlers: {
          'image': function() {
            const input = document.createElement('input');
            input.setAttribute('type', 'file');
            input.setAttribute('accept', 'image/*');
            input.click();
            
            input.onchange = () => {
              const file = input.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                  const range = this.quill.getSelection();
                  this.quill.insertEmbed(range.index, 'image', e.target?.result);
                };
                reader.readAsDataURL(file);
              }
            };
          }
        }
      } : false,
      clipboard: {
        matchVisual: false,
      },
      history: {
        delay: 2000,
        maxStack: 500,
        userOnly: true
      },
      keyboard: {
        bindings: {
          tab: {
            key: 9,
            handler: function(range: any, context: any) {
              this.quill.history.cutoff();
              const delta = new (Quill.import('delta'))()
                .retain(range.index)
                .delete(range.length)
                .insert('\t');
              this.quill.updateContents(delta, 'user');
              this.quill.history.cutoff();
              this.quill.setSelection(range.index + 1, 'silent');
            }
          }
        }
      }
    }), [showToolbar]);

    // Merge custom modules with defaults
    const modules = useMemo(() => ({
      ...defaultModules,
      ...customModules
    }), [defaultModules, customModules]);

    // Enterprise formats support
    const defaultFormats = [
      'header', 'font', 'size',
      'bold', 'italic', 'underline', 'strike',
      'color', 'background', 'script',
      'list', 'bullet', 'indent', 'align', 'direction',
      'blockquote', 'code', 'code-block',
      'link', 'image', 'video', 'formula'
    ];

    const quillFormats = formats || defaultFormats;

    // Handle change with validation
    const handleChange = useCallback((content: string, delta: any, source: string, editor: any) => {
      if (onChange) {
        onChange(content, delta, source, editor);
      }
    }, [onChange]);

    // Custom styles injection
    useEffect(() => {
      const style = document.createElement('style');
      style.textContent = `
        .ql-editor {
          min-height: ${minHeight}px;
          max-height: ${maxHeight}px;
          overflow-y: auto;
          font-family: inherit;
          font-size: 14px;
          line-height: 1.42;
        }
        
        .ql-editor.ql-blank::before {
          color: hsl(var(--muted-foreground));
          content: attr(data-placeholder);
          font-style: italic;
          left: 15px;
          pointer-events: none;
          position: absolute;
          right: 15px;
        }
        
        .ql-toolbar {
          border-top: 1px solid hsl(var(--border));
          border-left: 1px solid hsl(var(--border));
          border-right: 1px solid hsl(var(--border));
          border-bottom: none;
          border-radius: calc(var(--radius) - 2px) calc(var(--radius) - 2px) 0 0;
        }
        
        .ql-container {
          border-bottom: 1px solid hsl(var(--border));
          border-left: 1px solid hsl(var(--border));
          border-right: 1px solid hsl(var(--border));
          border-top: none;
          border-radius: 0 0 calc(var(--radius) - 2px) calc(var(--radius) - 2px);
          font-family: inherit;
        }
        
        .ql-toolbar.ql-snow {
          background: hsl(var(--background));
          border-color: hsl(var(--border));
        }
        
        .ql-container.ql-snow {
          border-color: hsl(var(--border));
        }
        
        .ql-editor.ql-snow {
          background: hsl(var(--background));
          color: hsl(var(--foreground));
        }
        
        .ql-snow .ql-tooltip {
          background: hsl(var(--popover));
          border: 1px solid hsl(var(--border));
          border-radius: calc(var(--radius) - 2px);
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
          color: hsl(var(--popover-foreground));
        }
        
        .ql-snow .ql-tooltip input[type=text] {
          background: hsl(var(--background));
          border: 1px solid hsl(var(--border));
          color: hsl(var(--foreground));
          border-radius: calc(var(--radius) - 2px);
          padding: 8px 12px;
        }
        
        .ql-snow .ql-tooltip a.ql-action,
        .ql-snow .ql-tooltip a.ql-remove {
          color: hsl(var(--primary));
        }
        
        .ql-snow .ql-tooltip a.ql-action:hover,
        .ql-snow .ql-tooltip a.ql-remove:hover {
          color: hsl(var(--primary)/0.8);
        }
        
        .ql-snow .ql-picker-options {
          background: hsl(var(--popover));
          border: 1px solid hsl(var(--border));
          border-radius: calc(var(--radius) - 2px);
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        }
        
        .ql-snow .ql-picker-item:hover {
          background: hsl(var(--accent));
          color: hsl(var(--accent-foreground));
        }
        
        ${error ? `
          .ql-toolbar,
          .ql-container {
            border-color: hsl(var(--destructive)) !important;
          }
        ` : ''}
        
        ${disabled ? `
          .ql-toolbar,
          .ql-editor {
            opacity: 0.5;
            pointer-events: none;
          }
        ` : ''}
      `;
      
      document.head.appendChild(style);
      
      return () => {
        document.head.removeChild(style);
      };
    }, [minHeight, maxHeight, error, disabled]);

    // Label rendering helper
    const renderLabel = () => {
      if (!label) return null;
      
      return (
        <div className="flex items-center gap-2 mb-2">
          <Label className="text-sm font-medium">{label}</Label>
          {tooltip && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">{tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      );
    };

    return (
      <div className={cn("space-y-2", containerClassName)}>
        {renderLabel()}
        
        <div className={cn(
          "relative",
          error && "ring-2 ring-destructive ring-offset-2 rounded-md",
          className
        )}>
          <ReactQuill
            ref={editorRef}
            theme={theme}
            value={value}
            onChange={handleChange}
            onFocus={onFocus}
            onBlur={onBlur}
            onChangeSelection={onSelection}
            readOnly={readOnly || disabled}
            placeholder={placeholder}
            modules={modules}
            formats={quillFormats}
            bounds={bounds}
            scrollingContainer={scrollingContainer}
            preserveWhitespace={preserveWhitespace}
            {...props}
          />
        </div>
        
        {error && (
          <p className="text-sm text-destructive font-medium">{error}</p>
        )}
      </div>
    );
  }
);

ReusableRichTextEditor.displayName = "ReusableRichTextEditor";
