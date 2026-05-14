import type { ComponentType, ReactNode } from 'react';
import { Platform } from 'react-native';

declare const require: (name: string) => {
  FullWindowOverlay?: ComponentType<{ children?: ReactNode }>;
};

let NativeFullWindowOverlay:
  | ComponentType<{ children?: ReactNode }>
  | undefined;

try {
  NativeFullWindowOverlay = require('react-native-screens').FullWindowOverlay;
} catch {
  NativeFullWindowOverlay = undefined;
}

export interface FullWindowOverlayProps {
  disableFullWindowOverlay: boolean;
  children: ReactNode;
}

export function FullWindowOverlay({
  disableFullWindowOverlay,
  children,
}: FullWindowOverlayProps) {
  if (
    Platform.OS !== 'ios' ||
    disableFullWindowOverlay ||
    !NativeFullWindowOverlay
  ) {
    return <>{children}</>;
  }

  return <NativeFullWindowOverlay>{children}</NativeFullWindowOverlay>;
}
