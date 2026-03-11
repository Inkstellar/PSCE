# Book Product Page Implementation Plan

## Overview
This plan outlines the implementation of a detailed Amazon-style book product page with new fields, API endpoints, and similar books functionality.

## Current Architecture

```mermaid
graph TD
    A[User] --> B[Home Page /catalog]
    B --> C[Book Cards]
    C --> D[WishlistButton]
    E[Admin] --> F[BookManager]
    F --> G[/api/admin/books]
    G --> H[Prisma]
    H --> I[Supabase PostgreSQL]
```

## New Fields to Add to Book Model

| Field | Type | Description |
|-------|------|-------------|
| `publisher` | String | Publisher name |
| `characters` | String (JSON array) | Array of character names |
| `rating` | Float | Average rating (0-5) |
| `reviewCount` | Int | Number of reviews |
| `series` | String (optional) | Series name if book is part of a series |

## Implementation Steps

### Step 1: Update Prisma Schema
- Modify `prisma/schema.prisma` to add new fields
- Add `@db.Text` for characters JSON storage
- Add `@default(0)` for rating and reviewCount

### Step 2: Database Migration
- Generate migration: `npx prisma migrate dev --name add_book_fields`
- Push to Supabase: `npx prisma db push`

### Step 3: Update Admin BookManager
- Modify `src/components/admin/BookManager.tsx`
- Add new form fields for publisher, characters (textarea), rating, reviewCount, series
- Update TypeScript interfaces

### Step 4: Update Admin API Routes
- Modify `src/app/api/admin/books/route.ts` - POST
- Modify `src/app/api/admin/books/[id]/route.ts` - GET, PUT

### Step 5: Create Public API Endpoints

#### /api/books/[id]
- Create new file `src/app/api/books/[id]/route.ts`
- Returns single book with all fields
- Handle 404 for not found

#### /api/books/similar/[id]
- Create new file `src/app/api/books/similar/[id]/route.ts`
- Find books matching:
  - Same author
  - Same publisher
  - Any matching character from characters array
- Exclude current book from results
- Limit to 8 similar books

### Step 6: Create Book Product Page

#### Route: /book/[id]
- Create directory `src/app/book/[id]`
- Create page file `src/app/book/[id]/page.tsx`

**Page Components:**
1. **Header** - Full-size cover image with image gallery
2. **Product Info Section**
   - Title, author, publisher, publication date
   - Price display with original price if discounted
   - Rating stars (visual) + review count link
   - Series name (if part of series)
3. **Action Buttons**
   - Add to Cart (future)
   - Add to Wishlist button
4. **Stock Availability**
   - In Stock badge (green)
   - Low Stock warning (amber)
   - Out of Stock (red)
5. **Full Description** - Expandable section
6. **Book Details**
   - ISBN, Pages, Language, Publisher

#### Similar Books Section
- "More by Same Author"
- "More from Same Publisher"
- "More with Same Characters"

### Step 7: Link Books to Product Page

#### Home Page Updates
- Modify `src/app/page.tsx`
- Wrap book cards with Link to `/book/[id]`
- Add click handler or entire card as link

#### Catalog Page Updates
- Modify `src/app/catalog/page.tsx`
- Same Link wrapper for book cards in grid and list views

## File Changes Summary

| File | Action |
|------|--------|
| `prisma/schema.prisma` | Add new fields |
| `src/components/admin/BookManager.tsx` | Add new form fields |
| `src/app/api/admin/books/route.ts` | Handle new fields in POST |
| `src/app/api/admin/books/[id]/route.ts` | Handle new fields in GET/PUT |
| `src/app/api/books/[id]/route.ts` | **Create** - Single book endpoint |
| `src/app/api/books/similar/[id]/route.ts` | **Create** - Similar books endpoint |
| `src/app/book/[id]/page.tsx` | **Create** - Product page |
| `src/app/page.tsx` | Add Link to book cards |
| `src/app/catalog/page.tsx` | Add Link to book cards |

## API Response Schemas

### GET /api/books/[id]
```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "author": "string",
  "price": "number",
  "coverImage": "string | null",
  "publishedAt": "string (ISO)",
  "stock": "number",
  "isbn": "string | null",
  "pages": "number | null",
  "language": "string",
  "publisher": "string",
  "characters": "string[]",
  "rating": "number",
  "reviewCount": "number",
  "series": "string | null"
}
```

### GET /api/books/similar/[id]
```json
{
  "byAuthor": [...],
  "byPublisher": [...],
  "byCharacters": [...]
}
```

## Implementation Notes

1. **Characters Storage**: Store as JSON string in PostgreSQL text field
2. **Rating**: Default to 0, update when reviews are added
3. **Similar Books Algorithm**:
   - Prioritize author matches
   - Then publisher matches
   - Then character matches
4. **Image Gallery**: Can use existing carousel component
5. **Wishlist Integration**: Reuse existing WishlistButton component
