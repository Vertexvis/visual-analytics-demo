import React from 'react';

export interface Props {
  readonly children: string;
  readonly slot: string;
}

export function Template({ children, ...attrs }: Props): JSX.Element {
  return <template {...attrs} dangerouslySetInnerHTML={{ __html: children }} />;
}
