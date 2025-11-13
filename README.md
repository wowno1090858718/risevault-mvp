# RiseVault Prototype

A minimal, front-end-only web prototype demonstrating the RiseVault flow: Record → Pending → Verify → Trusted Résumé → Timeline → Expand Details.

## Features

✅ **Record Contribution** - Input text and select project to create a work record  
✅ **Verify Flow** - Mock verification that changes status from pending to verified  
✅ **Timeline** - Reverse chronological list of all records with status indicators  
✅ **Generate Résumé Bullet** - Mock AI synthesis of verified work logs into résumé format  
✅ **Expand Details** - Collapsible view showing underlying work logs for selected project

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS

## Project Structure

```
app/
  ├── page.tsx       # Main page with all features
  ├── layout.tsx     # Root layout
  ├── globals.css    # Global styles
  └── types.ts       # TypeScript types
```

## Usage Flow

1. **Record**: Enter a contribution description, select a project, and click "Record"
2. **Verify**: Click "Verify now" on pending records to mark them as verified
3. **Timeline**: View all records in reverse chronological order
4. **Generate Résumé**: Select a project and click "Generate résumé bullet" to see synthesized output
5. **View Details**: Expand the details section to see all underlying work logs for the selected project

## Notes

- All data is stored in front-end state only (no persistence)
- No backend, database, or authentication required
- Everything is mocked for demonstration purposes
- Refresh the page to reset all data

