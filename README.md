#  FoodHub - Modern Food Delivery App

A full-stack food delivery application built with **Next.js 15**, **React 19**, **Prisma**, **PostgreSQL**, and **Stripe** for seamless online food ordering and payment processing.

![FoodHub Banner](https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?q=80&w=1200&auto=format&fit=crop)

##  Features

###  Core Functionality
- ** Landing Page** - Beautiful hero section with restaurant stats and customer reviews
- ** Menu Browsing** - Interactive menu with categorized food items and search functionality  
- ** Shopping Cart** - Add/remove items with real-time cart updates using Zustand state management
- ** Secure Checkout** - Stripe-powered payment processing with test card support
- ** Order Management** - View order history with detailed order tracking
- ** User Authentication** - Clerk integration for secure sign-in/sign-up

###  Admin Features
- ** Menu Management** - Full CRUD operations for menu items
- ** Image Upload** - ImageKit integration for optimized food images
- ** Order Processing** - Webhook-based order creation after successful payments

###  UI/UX Features  
- ** Responsive Design** - Mobile-first approach with Tailwind CSS
- ** Modern Interface** - Clean, elegant design with smooth animations
- ** Search & Filter** - Easy menu navigation and item discovery
- ** Real-time Updates** - Live cart updates and order status

##  Tech Stack

### Frontend
- **[Next.js 15](https://nextjs.org/)** - React framework with App Router and Turbopack
- **[React 19](https://react.dev/)** - Latest React with concurrent features
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Lucide React](https://lucide.dev/)** - Beautiful icon library

### Backend & Database  
- **[Prisma](https://www.prisma.io/)** - Next-generation ORM with type safety
- **[PostgreSQL](https://www.postgresql.org/)** - Robust relational database
- **[Neon Database](https://neon.tech/)** - Serverless PostgreSQL platform

### Authentication & Payments
- **[Clerk](https://clerk.com/)** - Complete authentication solution
- **[Stripe](https://stripe.com/)** - Secure payment processing with webhooks

### State Management & Storage
- **[Zustand](https://zustand.surge.sh/)** - Lightweight state management
- **[ImageKit](https://imagekit.io/)** - Image optimization and CDN

##  Getting Started

### Prerequisites
- **Node.js 18+** installed on your machine
- **PostgreSQL** database (or Neon account)
- **Stripe** account for payments
- **Clerk** account for authentication  
- **ImageKit** account for image storage

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/foodhub.git
   cd foodhub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@host:port/database"

   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
   CLERK_SECRET_KEY=sk_test_xxxxx

   # Stripe Payments
   STRIPE_PUBLIC_KEY=pk_test_xxxxx
   STRIPE_SECRET_KEY=sk_test_xxxxx
   STRIPE_WEBHOOK_SECRET=whsec_xxxxx

   # ImageKit
   IMAGEKIT_PUBLIC_KEY=public_xxxxx
   IMAGEKIT_PRIVATE_KEY=private_xxxxx
   IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/xxxxx

   # App URL (for webhooks)
   NEXT_PUBLIC_URL=http://localhost:3000
   ```

4. **Database Setup**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Push database schema
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

##  Project Structure

```
foodhub/
├── app/                    # Next.js App Router
│   ├── (routes)/
│   │   ├── menu/          # Menu browsing page
│   │   ├── cart/          # Shopping cart page
│   │   ├── orders/        # Order history page
│   │   └── success/       # Payment success page
│   ├── admin/             # Admin panel
│   │   └── menu/          # Menu management
│   ├── api/               # API routes
│   │   ├── checkout/      # Stripe checkout session
│   │   ├── webhook/       # Stripe webhooks
│   │   └── menu-items/    # Menu CRUD operations
│   ├── components/        # Reusable components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── LoadingSkeleton.tsx
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing page
├── actions/               # Server actions
├── lib/                   # Utilities
├── prisma/                # Database schema
├── store/                 # Zustand store
└── public/               # Static assets
```

##  User Flow

### 1. **Browse & Discover** 
- Land on hero page with restaurant information
- Browse menu with categorized food items
- Search for specific dishes or categories
- View detailed item descriptions and prices

### 2. **Add to Cart** 🛒  
- Add desired items to cart with quantity selection
- Real-time cart updates with item count display
- Review cart contents before checkout

### 3. **Secure Checkout** 
- Sign in with Clerk authentication
- Stripe checkout with multiple payment options
- Test with card: `4242 4242 4242 4242`

### 4. **Order Confirmation** 
- Webhook processes successful payment
- Order automatically created in database
- Redirect to success page with order details

### 5. **Track Orders** 
- View order history in clean, organized layout
- See order details, items, and total amount
- Track order status and timestamps

##  Design Features

- ** Modern UI** - Clean, minimalist design with subtle shadows and rounded corners
- ** Mobile Responsive** - Optimized for all device sizes
- ** Consistent Branding** - Green accent color (#10B981) throughout the app
- ** Smooth Animations** - Hover effects and loading states
- ** Image Optimization** - ImageKit integration for fast loading

##  Testing

### Payment Testing
Use Stripe test cards for payment testing:
- **Success:** `4242 4242 4242 4242`
- **Declined:** `4000 0000 0000 0002`
- Use any future expiry date and any 3-digit CVC

### Development Testing
```bash
# Run linting
npm run lint

# Build for production
npm run build

# Start production server
npm start
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy with automatic CI/CD

### Environment Variables for Production
- Update `NEXT_PUBLIC_URL` to your production domain
- Configure Stripe webhook endpoint in Stripe Dashboard
- Update CORS settings for ImageKit

## 🔧 Configuration

### Stripe Webhooks
1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhook`
3. Select events: `checkout.session.completed`
4. Copy webhook secret to environment variables

### Database Schema
```prisma
model MenuItem {
  id          String      @id @default(cuid())
  name        String      
  description String?
  price       Float
  category    String
  image       String?
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  orderItems  OrderItem[]
}

model Order {
  id              String      @id @default(cuid())
  userId          String
  amount          Float
  paymentIntentId String
  createdAt       DateTime    @default(now())
  items           OrderItem[]
}

model OrderItem {
  id         String   @id @default(cuid())
  orderId    String
  menuItemId String
  quantity   Int
  order      Order    @relation(fields: [orderId], references: [id])
  menuItem   MenuItem @relation(fields: [menuItemId], references: [id])
}
```

##  Performance Features

- ** Turbopack** - Lightning-fast development builds
- ** Image Optimization** - ImageKit CDN with automatic optimization
- ** Code Splitting** - Automatic route-based code splitting
- ** Server Components** - React Server Components for better performance
- ** Caching** - Optimal caching strategies for API routes

##  Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

##  License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

##  Developer

Created with ❤️ by Mohammed Shaiz

##  Acknowledgments

- **Next.js Team** - For the amazing framework
- **Vercel** - For the deployment platform
- **Stripe** - For secure payment processing
- **Clerk** - For authentication services
- **Prisma** - For the excellent ORM

---

### 🔗 Links

- **Live Demo:** [https://foodhub-demo.vercel.app](https://foodhub-demo.vercel.app)
- **Documentation:** [https://docs.foodhub.com](https://docs.foodhub.com)
- **API Reference:** [https://api.foodhub.com](https://api.foodhub.com)

###  Support

For support, email support@foodhub.com or join our Discord server.

---

**⭐ If you like this project, please give it a star on GitHub!**
