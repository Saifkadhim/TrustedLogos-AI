import React from 'react';
import { FlipbookModal } from './flipbook';
import type { FlipbookViewerProps } from './flipbook';

// FlipbookViewer component that provides a drop-in replacement
// for the existing basic implementation with advanced features
export default function FlipbookViewer(props: FlipbookViewerProps) {
  return <FlipbookModal {...props} />;
} 
