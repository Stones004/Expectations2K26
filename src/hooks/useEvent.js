/**
 * Custom Hook: useEvent
 * Fetches event data by slug
 */

import { useMemo } from 'react';
import { findEvent } from '../data/events';

export const useEvent = (slug) => {
  return useMemo(() => {
    if (!slug) return null;
    return findEvent(slug);
  }, [slug]);
};
