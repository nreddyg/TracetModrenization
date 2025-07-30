
import { useEffect } from 'react';
import { useAppDispatch } from '@/store';
import { setBreadcrumb } from '@/store/slices/uiSlice';

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

export const useBreadcrumb = (breadcrumbs: BreadcrumbItem[]) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setBreadcrumb(breadcrumbs));
    
    // Cleanup on unmount
    return () => {
      dispatch(setBreadcrumb([]));
    };
  }, [dispatch, breadcrumbs]);
};
