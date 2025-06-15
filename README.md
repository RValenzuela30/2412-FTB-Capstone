# 2412-FTB-Capstone
Frontend:
- React
- Bootstrap (for responsive design)

Backend:
- Express.js
- Prisma (ORM)
- bcrypt (password hashing)
- JSON Web Token (authentication)
- CORS (middleware)

Database:
- PostgreSQL (accessed via Prisma)

Features:
Authentication
- Users can sign up and log in
- Authenticated users can add items to their cart and complete purchases
- JWT used to manage sessions securely

Product Browsing
- All users can browse products (not including admin)
- Only logged-in users can add items to their cart

Cart Functionality
- Add/remove items
- Update item quantity
- Dynamic total cost calculation

Responsive Design
- Built with Bootstrap grid and card components
- Good for multiple screen sizes
