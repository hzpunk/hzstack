# create-hzstack

CLI tool to bootstrap HzStack project with authentication, admin panel, and modern features.

## Usage

### Using npx (recommended)

```bash
npx create-hzstack my-app
```

### Install globally

```bash
npm install -g create-hzstack
create-hzstack my-app
```

## Features

- 🚀 **Next.js 15** with App Router
- 🔐 **Authentication** with JWT tokens
- 🛡️ **Admin Panel** with role-based access control
- 📊 **Audit Dashboard** with animated charts
- 🎨 **Tailwind CSS** for styling
- 🗄️ **Prisma** with PostgreSQL
- 📱 **Responsive Design**
- 🖼️ **Avatar Upload**
- 🔔 **Notifications System**
- 🎯 **TypeScript** with strict mode

## Options

```bash
create-hzstack [project-name] [options]
```

### Options

- `-t, --template <template>` - Template to use (default: "default")
- `--no-install` - Skip installing dependencies
- `--use-yarn` - Use yarn instead of npm

### Examples

```bash
# Basic usage
npx create-hzstack my-app

# Skip dependency installation
npx create-hzstack my-app --no-install

# Use yarn for dependencies
npx create-hzstack my-app --use-yarn

# Interactive mode (will ask for project name)
npx create-hzstack
```

## What's included?

- **Authentication**: Login, registration, password change, JWT tokens
- **Admin Panel**: User management, role-based permissions, audit dashboard
- **Profile Management**: Edit profile, upload avatar, manage interests
- **Notifications**: System notifications with real-time updates
- **Security**: Rate limiting, input validation, SQL injection protection
- **UI/UX**: Animated counters, interactive charts, responsive design

## Quick Start

After creating your project:

```bash
cd my-app
cp .env.example .env
# Configure your database in .env
npx prisma migrate dev
npm run dev
```

## Role Hierarchy

- **CEO**: Full access to all features
- **Admin**: Can manage users (assign manager role only)
- **Manager**: Read-only access to admin panel
- **User**: Basic profile management

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"

# JWT
JWT_SECRET="your-secret-key"

# Next.js
NEXTAUTH_URL="http://localhost:3000"
```

## Project Structure

```
my-app/
├── src/
│   ├── app/
│   │   ├── (auth)/          # Authentication pages
│   │   ├── (admin)/         # Admin panel
│   │   ├── (main)/          # Main application
│   │   └── api/             # API routes
│   ├── components/          # React components
│   ├── lib/                 # Utilities
│   ├── store/               # State management
│   └── middleware.ts        # Next.js middleware
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── migrations/          # Database migrations
├── public/
│   └── avatars/             # User avatars
└── package.json
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT © [HzCompany](https://github.com/hzcompany)

---

Built with ❤️ by [HzCompany](https://github.com/hzcompany)
