// Data type definitions and interfaces

/**
 * Operative - A team member working on missions
 */
export const OperativeSchema = {
  id: 'string (uuid)',
  name: 'string',
  role: 'string',
  skills: 'string[]',
  status: 'active | inactive | retired',
  created_at: 'timestamp'
};

/**
 * Mission - A project or task
 */
export const MissionSchema = {
  id: 'string (uuid)',
  title: 'string',
  description: 'string | null',
  start_date: 'date | null',
  end_date: 'date | null',
  status: 'planned | ongoing | completed',
  created_at: 'timestamp'
};

/**
 * Archive - Historical mission records
 */
export const ArchiveSchema = {
  id: 'string (uuid)',
  mission_id: 'string (uuid)',
  summary: 'string',
  date_recorded: 'timestamp'
};

/**
 * Portfolio - Version releases
 */
export const PortfolioSchema = {
  id: 'string (uuid)',
  version: 'string',
  release_date: 'date',
  features: 'object',
  created_at: 'timestamp'
};

/**
 * Student - Team members from Squad_139
 */
export const StudentSchema = {
  id: 'number',
  name: 'string',
  linkedin: 'string',
  github: 'string',
  term: 'string',
  created_at: 'timestamp'
};
