import React from 'react';

interface Props {
  children: React.ReactNode | React.ReactNode[];
}

export function ViewerLayout({ children }: Props): JSX.Element {
  return (
    <main className="h-screen w-screen">
      <div className="h-full w-full grid grid-cols-sidebar-16 grid-rows-header-6">
        <div className="flex w-full row-span-full col-span-full">
          {children}
        </div>
      </div>
    </main>
  );
}
