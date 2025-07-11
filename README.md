# Vind 🎬

**A modern remake of Vine for OSDHACK 2025**

Vind brings back the classic short-form video sharing experience with a modern twist. Built with Next.js, TypeScript, and Tailwind CSS, it features a TikTok-style interface with smooth animations and responsive design.

## ✨ Features

### 🎥 **Video Platform**
- **Mux Integration**: Professional video hosting and streaming
- **Smart Upload**: Drag & drop with file validation and progress tracking
- **Enhanced Player**: Custom video player with controls and analytics
- **Short-Form Focus**: Optimized for 6-15 second videos (Vine-style)

### 🎨 **Modern UI/UX**
- **Custom Gradient Theme**: Beautiful green-to-cyan gradient throughout
- **Dark Theme**: Sleek black interface with gradient accents
- **Smooth Animations**: CSS transitions and hover effects
- **Mobile-First**: Responsive design optimized for all devices
- **Glassmorphism**: Backdrop blur effects on overlays

### 🔍 **Discovery & Search**
- **Advanced Search**: Real-time search with trending hashtags
- **Trending Tags**: Discover popular content categories
- **Recent Searches**: Quick access to previous searches
- **Smart Filtering**: Search by username, description, or hashtags

### 👥 **Social Features**
- **User Profiles**: Complete profile pages with stats and video grids
- **Follow System**: Follow/unfollow users with follower counts
- **Engagement**: Like, comment, save, and share videos
- **Comments System**: Real-time commenting with threaded replies
- **Verified Badges**: Special badges for verified creators

### 📱 **Interactive Experience**
- **Infinite Scroll**: TikTok-style vertical video feed
- **Snap Scrolling**: Smooth snap-to-video experience
- **Auto-play**: Videos play automatically when in view
- **Touch Controls**: Tap to play/pause, swipe for volume
- **Background Processing**: Upload videos while browsing

### 🚀 **Performance & Tech**
- **Server-Side Rendering**: Fast initial page loads with Next.js
- **API Integration**: RESTful API for all data operations
- **Real-time Updates**: Live like counts and engagement metrics
- **Error Handling**: Graceful error handling and loading states
- **TypeScript**: Full type safety throughout the application

## 🚀 Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Animations**: CSS transitions and custom animations

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun
- Mux account (for video hosting) - [Sign up here](https://dashboard.mux.com/)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/vind.git
cd vind
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```
Edit `.env.local` and add your Mux credentials:
```
MUX_TOKEN_ID=your_mux_token_id
MUX_TOKEN_SECRET=your_mux_token_secret
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📱 App Structure

```
src/
├── app/
│   ├── api/
│   │   ├── upload/          # Mux upload endpoints
│   │   ├── video/           # Video asset management
│   │   └── videos/          # Video CRUD operations
│   ├── globals.css          # Global styles and gradients
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Main feed page
├── components/
│   ├── VideoCard.tsx        # Individual video component (legacy)
│   ├── EnhancedVideoPlayer.tsx  # Advanced video player with Mux
│   ├── VideoUpload.tsx      # File upload with progress
│   ├── SearchModal.tsx      # Search interface
│   ├── CommentsModal.tsx    # Comments system
│   ├── UserProfile.tsx      # User profile pages
│   ├── Header.tsx           # App header with branding
│   └── BottomNavigation.tsx # Bottom navigation bar
```

## 🎯 Key Components

### VideoCard
- Individual video display with gradient backgrounds
- Interactive like, comment, and share buttons
- User information overlay
- Smooth hover animations

### Header
- Vind branding with gradient text
- Search and profile access
- Responsive design

### BottomNavigation
- Tab-based navigation
- Special create button with gradient styling
- Active state indicators

## 🎨 Design Features

- **Dark Theme**: Modern black background with colorful accents
- **Gradient Animations**: Smooth color transitions on video cards
- **Glassmorphism**: Backdrop blur effects on overlays
- **Smooth Transitions**: CSS animations for better UX
- **Mobile-First**: Optimized for mobile viewing

## 🚧 Current Status (Enhanced Prototype)

This is a fully-featured prototype with:
- ✅ **Complete UI/UX**: Modern interface with custom gradient theme
- ✅ **Mux Integration**: Professional video hosting and streaming
- ✅ **Upload System**: File upload with progress tracking and validation
- ✅ **Search & Discovery**: Advanced search with trending content
- ✅ **Social Features**: Likes, comments, saves, shares, user profiles
- ✅ **Enhanced Video Player**: Custom player with controls and analytics
- ✅ **Responsive Design**: Mobile-first with desktop support
- ✅ **API Architecture**: RESTful APIs for all operations
- ✅ **Real-time Features**: Live engagement metrics and updates
- ⏳ **User Authentication**: Coming soon with NextAuth.js
- ⏳ **Database Integration**: Upgrade from mock data to PostgreSQL/MongoDB
- ⏳ **Push Notifications**: Real-time engagement notifications
- ⏳ **Advanced Analytics**: Creator dashboard and video insights

## 🎪 OSDHACK 2025 Theme: "Blast from the Past"

Vind perfectly embodies the hackathon theme by:
- **Bringing Back Vine**: Reviving the beloved 6-second video format
- **Modern Technology**: Using latest web technologies (Next.js 14, TypeScript)
- **Enhanced UX**: Improving on the original with smooth animations and better mobile experience
- **Social Features**: Maintaining the social aspect that made Vine special

## 🎯 Future Enhancements

- Real video upload and playback
- User authentication system
- Comments and messaging
- Video recording with camera
- Push notifications
- Advanced search and discovery
- User profiles and following system

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Built with ❤️ for OSDHACK 2025
