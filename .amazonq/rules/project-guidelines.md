# Musakorneri Project Guidelines

## Framework & Libraries
- Next.js 16 with App Router
- React 19
- TypeScript/JSX
- Tailwind CSS for styling
- Redux Toolkit for state management
- Material-UI icons (@mui/icons-material)

## Component Structure
- Use named exports: `export const ComponentName`
- Keep components in separate files with matching names
- Use "use client" directive for client components
- Prefer functional components with hooks

## State Management
- Use Redux with @reduxjs/toolkit
- Access state via selectors from `store/*/selectors/*.selectors`
- Selectors pattern: `selectEntityById`, `selectAllEntities`
- Use `useSelector` hook for reading state

## Styling
- Use Tailwind CSS classes exclusively
- Color scheme: gray-800 (backgrounds), gray-700 (secondary), gray-300/400 (text)
- Hover states: hover:shadow-lg, hover:text-blue-400
- Consistent spacing: p-4, rounded-lg, border border-gray-700

## Icons & Images
- Use Material Design Icons (@mui/icons-material) instead of custom SVGs
- Use CameraAltIcon for missing album covers
- Next.js Image component for all images
- Handle image errors with fallback icons

## Date Formatting
- Use dayjs for date manipulation
- Format: DD.MM.YYYY
- Show "Today" and "Yesterday" for recent dates

## File Paths
- Use @ alias for app root: `@/app/...`, `@/types`
- Relative imports for same-level modules
- S3 bucket: `https://musakorneri-files.s3.amazonaws.com/`

## Code Style
- Minimal, clean implementations
- No unnecessary comments
- Consistent error handling with fallbacks
- Use optional chaining: `album?.name`
- Fallback values: `|| "Unknown Album"`
