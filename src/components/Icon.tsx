import * as React from 'react';

type IconType =
  | 'caret-right'
  | 'chevron-down'
  | 'chevron-right'
  | 'circle'
  | 'close'
  | 'error-circle'
  | 'help-circle'
  | 'info-circle'
  | 'scene-items'
  | 'visibility-hidden'
  | 'visibility-shown';

interface Props {
  icon: IconType;
}

export function Icon({ icon }: Props): JSX.Element {
  return getIcon(icon);
}

function getIcon(type: string): JSX.Element {
  switch (type) {
    case 'caret-right':
      return caretRight;
    case 'chevron-down':
      return chevronDown;
    case 'chevron-right':
      return chevronRight;
    case 'circle':
      return circle;
    case 'close':
      return close;
    case 'error-circle':
      return errorCircle;
    case 'help-circle':
      return helpCircle;
    case 'info-circle':
      return infoCircle;
    case 'scene-items':
      return sceneItems;
    case 'visibility-hidden':
      return visibilityHidden;
    case 'visibility-shown':
      return visibilityShown;

    default:
      return <></>;
  }
}

const baseIcon = (icon: React.ReactNode, testId?: string): JSX.Element => (
  <svg
    data-testid={`icon-${testId}`}
    className="fill-current"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
  >
    {icon}
  </svg>
);

const caretRight = baseIcon(
  <path d="M10.83,7.63l-5-4.5a.5.5,0,0,0-.66.74L9.75,8,5.17,12.13a.5.5,0,1,0,.66.74l5-4.5a.49.49,0,0,0,0-.74Z" />,
  'caret-right'
);

const chevronDown = baseIcon(
  <path d="M12,6.29A.51.51,0,0,0,11.5,6h-7a.5.5,0,0,0-.38.83l3.5,4a.51.51,0,0,0,.76,0l3.5-4A.51.51,0,0,0,12,6.29Z" />,
  'chevron-down'
);

const chevronRight = baseIcon(
  <path d="M10.83,7.62l-4-3.5A.5.5,0,0,0,6,4.5v7a.5.5,0,0,0,.83.38l4-3.5a.51.51,0,0,0,0-.76Z" />,
  'chevron-right'
);

const circle = baseIcon(
  <path d="M8,1a7,7,0,1,0,7,7A7,7,0,0,0,8,1Zm4.24,11.24A6,6,0,1,1,3.76,3.76a6,6,0,1,1,8.48,8.48Z" />,
  'circle'
);

const close = baseIcon(
  <path d="M8.71,8l4.14-4.15a.49.49,0,0,0-.7-.7L8,7.29,3.85,3.15a.49.49,0,0,0-.7.7L7.29,8,3.15,12.15a.49.49,0,0,0,.7.7L8,8.71l4.15,4.14a.49.49,0,0,0,.7-.7Z" />,
  'close'
);

const errorCircle = baseIcon(
  <path d="M8,1a7,7,0,1,0,7,7A7,7,0,0,0,8,1Zm4.27,11.23A6,6,0,1,1,14,8,6,6,0,0,1,12.27,12.27ZM8,4a.5.5,0,0,0-.5.5v5a.5.5,0,0,0,1,0v-5A.5.5,0,0,0,8,4Zm0,7a.51.51,0,1,0,.35.15A.47.47,0,0,0,8,11Z" />,
  'error-circle'
);

const helpCircle = baseIcon(
  <path d="M7.5,11a.51.51,0,1,0,.35.15A.47.47,0,0,0,7.5,11Zm0-9.5A6.5,6.5,0,1,0,14,8,6.5,6.5,0,0,0,7.5,1.5Zm3.89,10.39A5.5,5.5,0,1,1,13,8,5.47,5.47,0,0,1,11.39,11.89Zm-1.1-6.21A2.73,2.73,0,0,0,8,3.65H8a2.89,2.89,0,0,0-.5,0,3,3,0,0,0-2,.72,2.41,2.41,0,0,0-.85,1.82.5.5,0,0,0,.5.5.5.5,0,0,0,.5-.5,1.38,1.38,0,0,1,.51-1.06A2,2,0,0,1,7.5,4.61l.35,0A1.73,1.73,0,0,1,9.31,5.88h0a2.65,2.65,0,0,1,0,.27,1.53,1.53,0,0,1-.92,1.34h0a2.71,2.71,0,0,0-1,.8A2.05,2.05,0,0,0,7,9.5H7a.5.5,0,0,0,1,0H8a1,1,0,0,1,.21-.61,1.79,1.79,0,0,1,.63-.5h0a2.5,2.5,0,0,0,1.49-2.24,2.56,2.56,0,0,0,0-.47Z" />,
  'help-circle'
);

const infoCircle = baseIcon(
  <path d="M8,15A7,7,0,1,0,1,8,7,7,0,0,0,8,15ZM3.73,3.77A6,6,0,1,1,2,8,6,6,0,0,1,3.73,3.77ZM8,12a.5.5,0,0,0,.5-.5v-5a.5.5,0,0,0-1,0v5A.5.5,0,0,0,8,12ZM8,5a.51.51,0,1,0-.35-.15A.47.47,0,0,0,8,5Z" />,
  'info-circle'
);

const sceneItems = baseIcon(
  <path d="M14,3.5a.5.5,0,0,0-.5-.5H2.5a.5.5,0,0,0,0,1h11A.5.5,0,0,0,14,3.5ZM13.5,12h-9a.5.5,0,0,0,0,1h9a.5.5,0,0,0,0-1Zm0-6h-9a.5.5,0,0,0,0,1h9a.5.5,0,0,0,0-1Zm0,3h-9a.5.5,0,0,0,0,1h9a.5.5,0,0,0,0-1Z" />,
  'scene-items'
);

const visibilityHidden = baseIcon(
  <path d="M13.35,2.65a.48.48,0,0,0-.7,0l-.78.77a8.71,8.71,0,0,0-8.52.41A6.57,6.57,0,0,0,.51,7.89v.22a6.58,6.58,0,0,0,2.71,4l-.57.58a.49.49,0,0,0,.7.7l10-10A.48.48,0,0,0,13.35,2.65ZM9.73,5.56A3,3,0,0,0,5.56,9.73L3.94,11.35l0,0A5.49,5.49,0,0,1,1.53,8,5.49,5.49,0,0,1,3.9,4.67,7.52,7.52,0,0,1,8,3.5a7.67,7.67,0,0,1,3.12.67Zm3.61-1.2-.72.72A5.45,5.45,0,0,1,14.47,8a5.49,5.49,0,0,1-2.37,3.33A7.52,7.52,0,0,1,8,12.5a8.15,8.15,0,0,1-2.41-.38l-.78.78A8.9,8.9,0,0,0,8,13.5a8.53,8.53,0,0,0,4.65-1.33,6.57,6.57,0,0,0,2.84-4.06V7.89A6.56,6.56,0,0,0,13.34,4.36Z" />,
  'visibility-hidden'
);

const visibilityShown = baseIcon(
  <path d="M8,5a3,3,0,1,0,3,3A3,3,0,0,0,8,5Zm4.65-1.17A8.53,8.53,0,0,0,8,2.5,8.53,8.53,0,0,0,3.35,3.83,6.57,6.57,0,0,0,.51,7.89v.22a6.57,6.57,0,0,0,2.84,4.06A8.53,8.53,0,0,0,8,13.5a8.53,8.53,0,0,0,4.65-1.33,6.57,6.57,0,0,0,2.84-4.06V7.89A6.57,6.57,0,0,0,12.65,3.83Zm-.55,7.5A7.52,7.52,0,0,1,8,12.5a7.52,7.52,0,0,1-4.1-1.17A5.49,5.49,0,0,1,1.53,8,5.49,5.49,0,0,1,3.9,4.67,7.52,7.52,0,0,1,8,3.5a7.52,7.52,0,0,1,4.1,1.17A5.49,5.49,0,0,1,14.47,8,5.49,5.49,0,0,1,12.1,11.33Z" />,
  'visibility-shown'
);
