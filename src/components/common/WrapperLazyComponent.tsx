import { ComponentType, lazy, Suspense } from "react";
import { ReusableLoader } from "../ui/reusable-loader";
 
function WrapperLazyComponent<P>(
  childComponent: () => Promise<{ default: ComponentType<P> }>): React.FC<P> {
  const WrapperComponent = lazy(childComponent) as React.FC<P>;
 
  return (props: P) => (
    <Suspense fallback={<ReusableLoader spinning={true}/>}>
      <WrapperComponent {...props} />
    </Suspense>
  );
}
 
export default WrapperLazyComponent