# Cursor Instructions for DeepBase Auto-Build

## When User Says: "Build the complete site from designs in the design folder"

### Step 1: Analyze Design Files
1. **Scan the design folder** for all files (HTML, CSS, images, etc.)
2. **Identify page structure** from HTML files
3. **Extract component patterns** from repeated elements
4. **Analyze styling** and color schemes
5. **Identify assets** (images, icons, logos)

### Step 2: Generate React Components
1. **Convert HTML to React components**:
   - Create TypeScript interfaces for props
   - Use shadcn/ui components where possible
   - Maintain responsive design
   - Add proper TypeScript types

2. **Create page components** in `frontend/src/pages/`:
   - Replace placeholder pages
   - Add proper routing
   - Integrate with existing CMS

3. **Create reusable components** in `frontend/src/components/`:
   - Extract common patterns
   - Make them configurable via props
   - Connect to backend APIs

### Step 3: Integrate with DeepBase Backend
1. **Use existing API endpoints** from the backend
2. **Create new endpoints** only if absolutely necessary
3. **Connect forms** to contact submission system
4. **Integrate content** with CMS system
5. **Use existing authentication** system

### Step 4: Styling and Assets
1. **Convert CSS to Tailwind classes**
2. **Optimize images** and move to public folder
3. **Ensure responsive design**
4. **Maintain design consistency**

### Step 5: Update App Structure
1. **Update App.tsx** with new routes
2. **Add navigation** if needed
3. **Update placeholder page** with actual content
4. **Ensure CMS integration** works

## Key Principles

### ✅ DO:
- Use existing DeepBase foundation (backend, CMS, auth)
- Convert designs to React + TypeScript
- Use shadcn/ui components
- Maintain responsive design
- Connect to existing APIs
- Keep code clean and maintainable

### ❌ DON'T:
- Rebuild existing backend functionality
- Create unnecessary API endpoints
- Ignore the existing CMS system
- Break the authentication system
- Duplicate existing components

## File Structure to Create

```
frontend/src/
├── pages/
│   ├── Home.tsx          # Main landing page
│   ├── About.tsx         # About page
│   ├── Services.tsx      # Services page
│   └── Contact.tsx       # Contact page
├── components/
│   ├── Header.tsx        # Site header
│   ├── Footer.tsx        # Site footer
│   ├── Hero.tsx          # Hero section
│   └── [other components]
└── types/
    └── index.ts          # TypeScript interfaces
```

## Backend Integration Points

### Use Existing APIs:
- `/api/site-management/*` - Site content
- `/api/blog-posts/*` - Blog content
- `/api/contact-submissions/*` - Contact forms
- `/api/auth/*` - Authentication
- `/api/users/*` - User management

### Create New APIs Only If:
- Absolutely necessary for specific functionality
- Not covered by existing endpoints
- Business-specific requirements

## Example Workflow

1. **Analyze** `design/index.html` → Create `pages/Home.tsx`
2. **Extract** header/footer → Create `components/Header.tsx`, `components/Footer.tsx`
3. **Convert** CSS → Tailwind classes
4. **Connect** contact form → `/api/contact-submissions`
5. **Update** routing in `App.tsx`
6. **Test** integration with CMS

## Success Criteria

- ✅ All design files converted to React components
- ✅ Site is fully functional and responsive
- ✅ Backend integration working
- ✅ CMS accessible and functional
- ✅ No broken links or missing assets
- ✅ TypeScript types properly defined
- ✅ Code is clean and maintainable

## Quick Commands

```bash
# Start development
./rapid-dev.sh

# Check design files
./auto-build.sh

# Build for production
docker-compose -f docker-compose.prod.yml build
```

Remember: DeepBase provides the foundation - you just need to build the frontend that connects to it!
