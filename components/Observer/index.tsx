import React from 'react';
import { useObserver } from "../../hooks";

interface ObserverProps extends IntersectionObserverInit {
  children: JSX.Element
  onIntersection: IntersectionObserverCallback
}
export function Observer({
  children,
  onIntersection,
  ...options
}: ObserverProps) {
  const ref = useObserver<HTMLDivElement>(onIntersection, options);

  if (children !== undefined) {
    return React.cloneElement(children, { ref });
  }

  return <div ref={ref}></div>;
}