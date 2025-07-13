# Vind 🎬

Vind brings back the magic of short-form video content with a sleek, modern interface. Built with cutting-edge web technologies, it features TikTok-style infinite scrolling, real-time interactions, and a beautiful gradient-themed design that makes every video pop.

## 🌟 Overview

Vind is a next-generation social video platform that captures the essence of the original Vine while incorporating modern UX patterns and features. Create, share, and discover short videos (6-15 seconds) in an immersive, mobile-first environment.

# Team Details
**Solo Member:** Shiv Shakti Rai   
**Institute:** Graphic Era   
**Role:** Developing the full application


### 🚀 **Technical Excellence**
- **Full-Stack TypeScript**: Type-safe development from frontend to API
- **Database Integration**: MongoDB for persistent data storage
- **REST API Architecture**: Clean, scalable backend with proper error handling
- **Server-Side Rendering**: Fast initial loads with Next.js App Router
- **Real-time Updates**: Live synchronization of likes, saves, and comments

## 🛠️ Tech Stack

```
Frontend          Backend           
├─ Next.js 14+    ├─ Next.js API     
├─ TypeScript     ├─ MongoDB         
├─ Tailwind CSS   ├─ Mongoose ODM    
├─ Lucide Icons   └─ RESTful APIs   
└─ CSS Animations                   
```

**Core Technologies:**
- **Framework:** Next.js 14+ with App Router
- **Language:** TypeScript for full-stack type safety
- **Styling:** Tailwind CSS with custom gradient themes
- **Database:** MongoDB with Mongoose ODM
- **Video:** Mux for professional video hosting and streaming
- **Icons:** Lucide React for consistent iconography


## 🚀 Quick Start

### Prerequisites
- [Node.js 18+](https://nodejs.org/) and npm/yarn/pnpm
- [Mux Account](https://dashboard.mux.com/) for video hosting
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

### Installation

```bash
# 1. Clone the repository
git clone <github-url>
cd vind

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# 4. Start development server
npm run dev
```

### Environment Variables
Create `.env.local` with:
```env
# Mux Video API (Required)
MUX_TOKEN_ID=your_mux_token_id
MUX_TOKEN_SECRET=your_mux_token_secret

# MongoDB (Required)
MONGODB_URI=mongodb://localhost:27017/vind

# NextAuth (Optional - for authentication)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_key
```

Open [http://localhost:3000](http://localhost:3000) to see the app! 🎉


### Key Features
- 🎯 **Infinite Feed** - Scroll through videos with auto-play
- 🔍 **Smart Search** - Find content by tags, users, or descriptions  
- 💾 **Save Collections** - Build your personal video library
- 👥 **Social Interactions** - Like, comment, and share with the community

## 🏆 OSDHACK 2025: "Blast from the Past"

Vind perfectly embodies the hackathon theme by bringing back Vine with modern technology:
- **Nostalgic Concept** - Reviving the beloved 6-second video format
- **Modern Stack** - Built with Next.js 14, TypeScript, and Tailwind CSS
- **Enhanced UX** - Improved mobile experience with smooth animations
- **Social Features** - Maintaining the community aspect that made Vine special

## 🤝 Contributing

Contributions are welcome! 

**Guidelines:**
- Follow TypeScript best practices
- Use Tailwind CSS for styling  
- Write meaningful commit messages
- Test changes thoroughly
- Update documentation if needed

## 📄 License

This project is licensed under the MIT License.

**Built with ❤️ for OSDHACK 2025**

*Bringing back the golden age of short-form video* 🎬✨

