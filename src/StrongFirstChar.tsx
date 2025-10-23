import type { FC } from 'react';

export type StrongFirstCharProps = {
  children: string;
};

export const StrongFirstChar: FC<StrongFirstCharProps> = ({
  children,
}) => (
  <>
    <strong>{children.charAt(0)}</strong>
    <span>{children.substring(1)}</span>
  </>
);
