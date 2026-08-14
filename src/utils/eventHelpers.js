/**
 * Utility Functions for Event Operations
 * Reusable helper functions for event data manipulation
 */

/**
 * Format event info array into readable key-value pairs
 * @param {Array} info - Array of [label, value] pairs
 * @returns {Array} Formatted info array
 */
export const formatEventInfo = (info) => {
  if (!Array.isArray(info)) return [];
  return info.map(([label, value]) => ({ label, value }));
};

/**
 * Format organizer data for display
 * @param {Array} organizers - Array of organizer objects
 * @returns {Array} Organizers with formatted data
 */
export const formatOrganizers = (organizers) => {
  if (!Array.isArray(organizers)) return [];
  return organizers.map((org) => ({
    name: org.name,
    role: org.role,
    image: org.image,
    email: org.email,
    phone: org.phone,
    linkedin: org.linkedin,
  }));
};

/**
 * Format event rounds into structured data
 * @param {Array} rounds - Array of [roundName, description] pairs
 * @returns {Array} Structured rounds
 */
export const formatRounds = (rounds) => {
  if (!Array.isArray(rounds)) return [];
  return rounds.map(([name, description], index) => ({
    index: index + 1,
    name,
    description,
  }));
};

/**
 * Format evaluation criteria
 * @param {Array} evaluation - Array of [criterion, weight] pairs
 * @returns {Array} Structured evaluation criteria
 */
export const formatEvaluation = (evaluation) => {
  if (!Array.isArray(evaluation)) return [];
  return evaluation.map(([criterion, weight]) => ({ criterion, weight }));
};

/**
 * Validate event object has required fields
 * @param {Object} event - Event object to validate
 * @returns {Boolean} True if event is valid
 */
export const isValidEvent = (event) => {
  return (
    event &&
    typeof event === 'object' &&
    event.slug &&
    event.title &&
    event.image
  );
};

/**
 * Get event by slug
 * @param {Array} events - Array of event objects
 * @param {String} slug - Event slug identifier
 * @returns {Object|null} Event object or null if not found
 */
export const getEventBySlug = (events, slug) => {
  if (!Array.isArray(events) || !slug) return null;
  return events.find((event) => event.slug === slug) || null;
};
