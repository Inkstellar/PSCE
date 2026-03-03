# Purple Skull Comics - Admin Panel Plan

## Overview
A comprehensive admin panel for managing the Purple Skull Comics web application, including book management, banner images, user management, and wishlist features.

---

## 1. Database Schema Updates

### 1.1 New Models to Add

```prisma
// User model - for authentication and user management
model User {
  id            String     @id @default(cuid())
  email         String     @unique
  name          String?
  password      String     // Hashed password
  role          Role       @default(USER)
  avatar        String?
  phone         String?
  address       String?
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt
  wishlist      Wishlist[]
  orders        Order[]
}

// Role enum for user permissions
enum Role {
  USER
  ADMIN
}

// Banner model - for managing carousel slides
model Banner {
  id          String   @id @default(cuid())
  title       String
  subtitle    String
  imageUrl    String
  linkUrl     String?  // Optional link when clicked
  order       Int      @default(0)  // Display order
  active      Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

// Wishlist model - for user wishlists
model Wishlist {
  id        String   @id @default(cuid())
  userId    String
  bookId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  book      Book     @relation(fields: [bookId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  
  @@unique([userId, bookId])  // Prevent duplicate wishlist items
}

// Order model - for order management (future enhancement)
model Order {
  id          String       @id @default(cuid())
  userId      String
  user        User         @relation(fields: [userId], references: [id])
  status      OrderStatus  @default(PENDING)
  total       Float
  items       OrderItem[]
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
}

model OrderItem {
  id        String  @id @default(cuid())
  orderId   String
  order     Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)
  bookId    String
  book      Book    @relation(fields: [bookId], references: [id])
  quantity  Int
  price     Float   // Price at time of order
}

enum OrderStatus {
  PENDING
  CONFIRMED
  SHIPPED
  DELIVERED
  CANCELLED
}

// Update Book model to add relations
model Book {
  id           String       @id @default(cuid())
  name         String       @unique
  description  String
  author       String
  price        Float
  coverImage   String?
  publishedAt  DateTime
  stock        Int          @default(0)
  isbn         String?
  pages        Int?
  language     String       @default("English")
  createdAt    DateTime     @default(now())
  updatedAt    DateTime     @updatedAt
  wishlist     Wishlist[]
  orderItems   OrderItem[]
}
```

---

## 2. Authentication System

### 2.1 Features
- Email/password login for admins
- Session management with NextAuth.js v4
- Role-based access control (RBAC)
- Protected admin routes

### 2.2 Implementation
- Use NextAuth.js v4 (already available in project)
- Credentials provider for admin login
- Middleware for route protection
- Admin-only API routes

---

## 3. Admin Panel Sections

### 3.1 Dashboard (Home)
**Route:** `/admin` (will be integrated into main page with admin mode toggle)

**Features:**
- Overview statistics (total books, users, wishlists, orders)
- Recent orders
- Low stock alerts
- Quick actions

**UI Components:**
- Stats cards with icons
- Recent activity table
- Quick action buttons

---

### 3.2 Book Management
**Route:** Integrated into main page with modal/sidebar

**Features:**
- View all books in a table/grid
- Add new book
- Edit existing book
- Delete book (with confirmation)
- Search and filter books
- Stock management
- Bulk actions

**Add/Edit Book Form Fields:**
- Book Name (required)
- Author (required)
- Description (required, textarea)
- Price (required, number)
- Cover Image (file upload or URL)
- Published Date (date picker)
- Stock Quantity (number)
- ISBN (optional)
- Pages (optional)
- Language (dropdown)

**UI Components:**
- Data table with sorting/filtering
- Modal form for add/edit
- Image upload with preview
- Confirmation dialogs

---

### 3.3 Banner Management
**Route:** Integrated into main page

**Features:**
- View all banners in order
- Add new banner
- Edit banner (title, subtitle, image, link)
- Delete banner
- Reorder banners (drag and drop)
- Toggle active/inactive
- Image upload with preview

**Banner Form Fields:**
- Title (required)
- Subtitle (required)
- Banner Image (file upload)
- Link URL (optional)
- Active toggle

**UI Components:**
- Sortable list/card view
- Image upload with crop/preview
- Drag handles for reordering

---

### 3.4 User Management
**Route:** Admin panel section

**Features:**
- View all registered users
- User details view
- Edit user (name, email, role)
- Delete user (with confirmation)
- Change user role (USER/ADMIN)
- View user's wishlist
- View user's orders
- Search and filter users

**User Details View:**
- Profile information
- Wishlist items
- Order history
- Account activity

**UI Components:**
- User data table
- User detail modal/drawer
- Role badge indicators

---

### 3.5 Wishlist Management
**Route:** Admin panel section

**Features:**
- View all wishlist items across users
- Filter by book
- Filter by user
- Most wishlisted books (analytics)
- Export wishlist data

**UI Components:**
- Wishlist analytics cards
- Wishlist items table
- Filter controls

---

## 4. API Routes Structure

```
/api/
├── auth/
│   └── [...nextauth]/     # NextAuth.js routes
├── admin/
│   ├── books/
│   │   ├── route.ts       # GET all, POST new
│   │   └── [id]/
│   │       └── route.ts   # GET, PUT, DELETE by ID
│   ├── banners/
│   │   ├── route.ts       # GET all, POST new
│   │   └── [id]/
│   │       └── route.ts   # GET, PUT, DELETE by ID
│   ├── users/
│   │   ├── route.ts       # GET all
│   │   └── [id]/
│   │       └── route.ts   # GET, PUT, DELETE by ID
│   ├── wishlists/
│   │   └── route.ts       # GET all with filters
│   └── stats/
│       └── route.ts       # GET dashboard stats
├── books/
│   └── route.ts           # Public: GET current month books
├── banners/
│   └── route.ts           # Public: GET active banners
└── wishlist/
    ├── route.ts           # User: GET own wishlist, POST/DELETE items
    └── [bookId]/
        └── route.ts       # User: toggle wishlist item
```

---

## 5. UI/UX Design

### 5.1 Admin Panel Layout
Since we can only use the `/` route, the admin panel will be:
1. **Toggle Mode:** Admin button in header to switch between "Customer View" and "Admin View"
2. **Admin Mode:** Shows admin sidebar/drawer with management options
3. **Modal-based Forms:** All CRUD operations in modals for seamless UX

### 5.2 Color Scheme (Purple Theme)
- Primary actions: Deep purple (#6B21A8)
- Secondary actions: Light purple (#A855F7)
- Success: Green (#22C55E)
- Warning: Amber (#F59E0B)
- Danger: Red (#EF4444)
- Background: Dark purple-gray

### 5.3 Responsive Design
- Mobile: Drawer navigation
- Tablet/Desktop: Sidebar navigation
- All forms: Responsive modals

---

## 6. Implementation Phases

### Phase 1: Foundation
1. Update Prisma schema
2. Set up NextAuth.js authentication
3. Create admin middleware/protection
4. Create base admin layout component

### Phase 2: Book Management
1. Book CRUD API routes
2. Book list view with table
3. Add/Edit book modal form
4. Image upload functionality
5. Delete confirmation

### Phase 3: Banner Management
1. Banner CRUD API routes
2. Banner management UI
3. Image upload for banners
4. Drag-and-drop reordering

### Phase 4: User Management
1. User management API routes
2. User list view
3. User detail view
4. Role management

### Phase 5: Wishlist Features
1. Wishlist API routes
2. User wishlist functionality
3. Wishlist analytics for admin

### Phase 6: Polish & Security
1. Form validation
2. Error handling
3. Loading states
4. Success/error toasts
5. Admin audit logging

---

## 7. Security Considerations

1. **Authentication:** Only authenticated admins can access admin features
2. **Authorization:** Role-based checks on all admin API routes
3. **Input Validation:** Zod schemas for all forms
4. **File Upload:** Validate file types and sizes
5. **CSRF Protection:** Built into NextAuth.js
6. **Rate Limiting:** Consider for production

---

## 8. File Upload Strategy

Since we're in a sandbox environment:
- Store images in `/public/uploads/` directory
- Generate unique filenames with timestamps
- Support formats: JPG, PNG, WebP
- Max file size: 5MB for covers, 10MB for banners
- Image optimization with Next.js Image component

---

## 9. Component Structure

```
src/
├── components/
│   ├── admin/
│   │   ├── AdminLayout.tsx
│   │   ├── AdminSidebar.tsx
│   │   ├── DashboardStats.tsx
│   │   ├── BookTable.tsx
│   │   ├── BookForm.tsx
│   │   ├── BannerManager.tsx
│   │   ├── BannerForm.tsx
│   │   ├── UserTable.tsx
│   │   ├── UserForm.tsx
│   │   ├── WishlistTable.tsx
│   │   └── ImageUpload.tsx
│   └── ui/ (existing)
├── lib/
│   ├── auth.ts           # Auth utilities
│   ├── validations.ts    # Zod schemas
│   └── upload.ts         # File upload utilities
└── hooks/
    ├── useAuth.ts
    └── useAdmin.ts
```

---

## 10. Estimated Timeline

| Phase | Tasks | Estimated Time |
|-------|-------|----------------|
| Phase 1 | Foundation | 1-2 hours |
| Phase 2 | Book Management | 2-3 hours |
| Phase 3 | Banner Management | 1-2 hours |
| Phase 4 | User Management | 1-2 hours |
| Phase 5 | Wishlist Features | 1-2 hours |
| Phase 6 | Polish & Security | 1 hour |
| **Total** | | **7-12 hours** |

---

## Questions for Clarification

1. **Authentication:** Should we use a simple hardcoded admin account for demo, or implement full user registration?
2. **Image Storage:** Should we use local file storage (simpler) or integrate with a cloud storage service?
3. **Order Management:** Should we include full e-commerce features (cart, checkout) or just wishlist for now?
4. **Email Features:** Any email notifications needed (order confirmation, wishlist alerts)?
5. **Admin Access:** Single admin or multiple admin accounts needed?

---

## Ready to Proceed?

Once you approve this plan, I can start implementing Phase 1 (Foundation) which includes:
- Database schema updates
- Authentication setup
- Admin layout component
- Basic dashboard with stats

Let me know if you'd like any modifications to this plan!
