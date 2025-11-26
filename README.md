# HzStack

Full-stack Next.js application with authentication, admin panel, and modern features.

## 🚀 Quick Start

### Using CLI (recommended)

```bash
npx create-hzstack my-app
cd my-app
npm run dev
```

### Manual setup

```bash
git clone https://github.com/hzpunk/hzstack.git my-app
cd my-app
npm install
cp .env.example .env
# Configure your database in .env
npx prisma migrate dev
npm run dev
```

## ✨ Features

- 🔐 **Authentication** with JWT tokens
- 🛡️ **Admin Panel** with role-based access control
- 📊 **Audit Dashboard** with animated charts
- 🎨 **Tailwind CSS** for styling
- 🗄️ **Prisma** with PostgreSQL
- 📱 **Responsive Design**
- 🖼️ **Avatar Upload**
- 🔔 **Notifications System**
- 🎯 **TypeScript** with strict mode

## 🏗️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with bcrypt
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Validation**: Zod
- **UI Components**: Custom components with Lucide icons

## 📋 Project Structure

```
src/
├── app/
│   ├── (auth)/          # Authentication pages
│   ├── (admin)/         # Admin panel
│   ├── (main)/          # Main application
│   └── api/             # API routes
├── components/          # React components
├── lib/                 # Utilities
├── store/               # State management
└── middleware.ts        # Next.js middleware
```

## 🔐 Role Hierarchy

- **CEO**: Full access to all features
- **Admin**: Can manage users (assign manager role only)
- **Manager**: Read-only access to admin panel
- **User**: Basic profile management

## 🛡️ Security Features

- JWT token authentication
- Rate limiting (3 attempts per minute)
- Input validation with Zod
- SQL injection protection (Prisma ORM)
- Password hashing with bcrypt (12 rounds)
- CORS protection
- Secure HTTP-only cookies

## 📊 Admin Panel Features

- User management with search
- Role-based permissions
- Animated statistics dashboard
- Interactive charts with hover effects
- User deletion (CEO only)
- Real-time online status

## 👤 Profile Features

- Edit profile information
- Upload and change avatar
- Change password
- Manage interests
- Notifications system

## 🔧 Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"

# JWT
JWT_SECRET="your-secret-key"

# Next.js
NEXTAUTH_URL="http://localhost:3000"
```

## 📱 Responsive Design

- Mobile-first approach
- Adaptive layouts
- Touch-friendly interface
- Optimized for all screen sizes

## 🚀 Deployment

### Vercel (recommended)

1. Connect your repository to Vercel
2. Configure environment variables
3. Deploy automatically

### Docker

```bash
docker build -t hzstack .
docker run -p 3000:3000 hzstack
```

## 📚 Documentation

- [API Documentation](./docs/api.md)
- [Database Schema](./docs/database.md)
- [Security Guide](./docs/security.md)
- [Deployment Guide](./docs/deployment.md)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT © [HzCompany](https://github.com/hzcompany)

## 🆘 Support

- Create an issue on GitHub
- Join our Discord community
- Check the documentation

---

Built with ❤️ by [HzCompany](https://github.com/hzcompany)
