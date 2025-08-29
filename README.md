# 🚀 Real-time Chat App with Supabase & Next.js 15

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

> A simple, real-time chat application built with Next.js 15, Supabase real-time subscriptions, and TypeScript. Experience instant messaging with live user presence indicators! ⚡

## ✨ Features

- 🔥 **Real-time messaging** - Messages appear instantly across all connected clients
- 👥 **Live user presence** - See who's online in real-time with animated indicators
- 💨 **Lightning fast** - Built with Next.js 15 and optimized with PNPM
- 🔒 **Type-safe** - Full TypeScript implementation throughout
- 🎨 **Clean UI** - Designed with Tailwind CSS and smooth scroll animation

## 🎯 Live Demo

Check out the live application: [RealtimeChat.app](supabase-realtime-chat-app.vercel.app)

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router) + React 19
- **Backend**: Supabase (PostgreSQL + Real-time)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Package Manager**: PNPM
- **Real-time**: Supabase Subscriptions (WebSocket)

## 🏗️ Project Structure

```
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   └── chat-room.tsx
├── hooks/
│   └── useRealtime.ts
├── lib/
│   └── supabase/
│       └── client.ts
└── configs..
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PNPM (recommended) or npm
- A Supabase account ([free tier](https://supabase.com/))

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/realtime-chat-app.git
cd realtime-chat-app
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **Settings** → **API** and copy your project URL and anon key
3. In the SQL Editor, run this schema:

```sql
-- Enable real-time for public schema
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE profiles;

-- Messages table
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  user_name VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Profiles table for online status
CREATE TABLE profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  online BOOLEAN DEFAULT false,
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Allow all operations (adjust for production)
CREATE POLICY "Allow all operations" ON messages FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON profiles FOR ALL USING (true);
```

### 4. Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 5. Run the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) and start chatting! 🎉

## 🔧 Key Implementation Details

### Real-time Subscriptions

The app uses Supabase's real-time subscriptions to listen for database changes:

```typescript
// Listen for new messages
channel = supabase
  .channel("messages")
  .on(
    "postgres_changes",
    { event: "INSERT", schema: "public", table: "messages" },
    (payload) => setMessages((prev) => [...prev, payload.new as Message])
  )
  .subscribe();
```

### User Presence System

Online status is managed automatically:

- Users go "online" when they join the chat
- Status updates in real-time across all connected clients
- Automatic cleanup on tab close/refresh using `beforeunload` event

### Performance Optimizations

- **Connection rate limiting**: Limited to 10 events per second
- **Message limits**: Only loads last 50 messages initially
- **Automatic cleanup**: Proper subscription cleanup prevents memory leaks

## 📦 Available Scripts

```bash
# Development
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server

# Code Quality
pnpm lint         # Run ESLint
pnpm type-check   # Run TypeScript checks
```

## 🔒 Security Considerations

For production deployment, consider:

1. **Row Level Security (RLS)**: Implement proper RLS policies
2. **Authentication**: Add user authentication with Supabase Auth
3. **Rate Limiting**: Implement message rate limiting
4. **Content Moderation**: Add message filtering/moderation
5. **Environment Variables**: Secure your environment variables

## 🚀 Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/realtime-chat-app)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your environment variables in Vercel dashboard
4. Deploy! 🎉

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the project
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 🐛 Troubleshooting

### Common Issues

**Real-time not working?**

- Check if your Supabase project has real-time enabled
- Verify your environment variables are correct
- Make sure you've run the SQL schema

**Messages not appearing?**

- Check browser console for errors
- Verify database policies allow read/write operations
- Ensure your API keys are valid

**Connection issues?**

- Check your internet connection
- Verify Supabase service status
- Try refreshing the page

## 📚 Learn More

- [Blog Post: Building Real-time Apps with Supabase](https://dev.to/lra8dev/building-real-time-magic-supabase-subscriptions-in-nextjs-15-2kmp)
- [Supabase Real-time Documentation](https://supabase.com/docs/guides/realtime)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⭐ Star History

If you found this project helpful, please consider giving it a star! ⭐

---

**Built with ❤️ by [Laxman Rathod](https://github.com/lra8dev)**

[🐦 Twitter](https://twitter.com/luckyra8od) • [💼 LinkedIn](https://linkedin.com/in/laxmanrathod) • [📝 Dev.to](https://dev.to/lra8dev)

---

_Want to build something similar? Check out my [blog post](https://dev.to/lra8dev/building-real-time-magic-supabase-subscriptions-in-nextjs-15-2kmp) for a detailed step-by-step guide!_ 🚀
