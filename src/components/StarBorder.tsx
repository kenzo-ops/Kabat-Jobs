import React from 'react';
import './StarBorder.css';

type StarBorderProps<E extends React.ElementType = 'button'> = {
  as?: E;
  className?: string;
  color?: string;
  speed?: string;
  thickness?: number;
  children?: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<E>, 'as' | 'children' | 'className'>;

function StarBorder<E extends React.ElementType = 'button'>(props: StarBorderProps<E>) {
  const {
    as,
    className = '',
    color = 'white',
    speed = '6s',
    thickness = 1,
    children,
    ...rest
  } = props as StarBorderProps<E> & { style?: React.CSSProperties };

  const Component = (as || 'button') as React.ElementType;
  const { style, ...nativeProps } = rest as { style?: React.CSSProperties } & Record<string, unknown>;

  return (
    <Component
      className={`star-border-container ${className}`}
      style={{
        padding: `${thickness}px 0`,
        ...(style || {})
      }}
      {...nativeProps}
    >
      <div
        className="border-gradient-bottom"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed
        }}
      />
      <div
        className="border-gradient-top"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed
        }}
      />
      <div className="inner-content">{children}</div>
    </Component>
  );
}

export default StarBorder as <E extends React.ElementType = 'button'>(
  props: StarBorderProps<E>
) => React.ReactElement | null;
