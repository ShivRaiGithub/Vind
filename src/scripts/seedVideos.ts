/**
 * Real video entries using actual Mux assets uploaded from our video files
 * These are real Mux playback IDs from uploaded videos
 */

interface VideoEntry {
  id: string;
  username: string;
  description: string;
  likes: number;
  comments: number;
  shares: number;
  playback_id: string;
  asset_id: string;
  created_at: string;
  user_avatar: string | null;
  verified: boolean;
  duration: number; // in seconds
}

// Real video entries using actual Mux assets
const sampleVideos: VideoEntry[] = [
  {
    "id": "mux-qJMJOMf5ZwC2PmSBY4BbhGYaNqhz02sIGj2s801uAOkCI-nature_lover",
    "username": "nature_lover",
    "description": "Evening vibes in the rice fields 🌾 Nothing beats the peaceful sound of rain on green fields #nature #peaceful #rain #countryside",
    "likes": 1355,
    "comments": 262,
    "shares": 108,
    "playback_id": "95Gunf59b7ifAl6cK21rPYjHDeZxMuyAGfIG9jImta8",
    "asset_id": "qJMJOMf5ZwC2PmSBY4BbhGYaNqhz02sIGj2s801uAOkCI",
    "created_at": "2025-07-09T09:13:25.403Z",
    "user_avatar": null,
    "verified": true,
    "duration": 14.6
  },
  {
    "id": "mux-qJMJOMf5ZwC2PmSBY4BbhGYaNqhz02sIGj2s801uAOkCI-wanderlust_diary",
    "username": "wanderlust_diary",
    "description": "Found this hidden gem during my evening walk 🌅 The way the light hits the water is just magical ✨ #travel #goldenhour #hiddengems",
    "likes": 4230,
    "comments": 154,
    "shares": 209,
    "playback_id": "95Gunf59b7ifAl6cK21rPYjHDeZxMuyAGfIG9jImta8",
    "asset_id": "qJMJOMf5ZwC2PmSBY4BbhGYaNqhz02sIGj2s801uAOkCI",
    "created_at": "2025-07-13T09:59:27.360Z",
    "user_avatar": null,
    "verified": true,
    "duration": 14.6
  },
  {
    "id": "mux-qJMJOMf5ZwC2PmSBY4BbhGYaNqhz02sIGj2s801uAOkCI-earth_explorer",
    "username": "earth_explorer",
    "description": "This is why I love rainy season 💚 Pure tranquility in nature #monsoon #greenery #meditation #mindfulness",
    "likes": 3708,
    "comments": 490,
    "shares": 161,
    "playback_id": "95Gunf59b7ifAl6cK21rPYjHDeZxMuyAGfIG9jImta8",
    "asset_id": "qJMJOMf5ZwC2PmSBY4BbhGYaNqhz02sIGj2s801uAOkCI",
    "created_at": "2025-07-07T11:01:25.418Z",
    "user_avatar": null,
    "verified": true,
    "duration": 14.6
  },
  {
    "id": "mux-qJMJOMf5ZwC2PmSBY4BbhGYaNqhz02sIGj2s801uAOkCI-zen_moments",
    "username": "zen_moments",
    "description": "Sometimes you need to pause and appreciate the simple beauty around us 🧘‍♀️ #zen #naturetherapy #mindfulliving",
    "likes": 5086,
    "comments": 82,
    "shares": 136,
    "playback_id": "95Gunf59b7ifAl6cK21rPYjHDeZxMuyAGfIG9jImta8",
    "asset_id": "qJMJOMf5ZwC2PmSBY4BbhGYaNqhz02sIGj2s801uAOkCI",
    "created_at": "2025-07-07T06:52:48.326Z",
    "user_avatar": null,
    "verified": true,
    "duration": 14.6
  },
  {
    "id": "mux-Bo4gQZCFilb01DgKWxBrbvlaNkYdrbjjMq600ilSwodMk-cinematic_vibes",
    "username": "cinematic_vibes",
    "description": "When the lighting is just perfect 🎬 Shot this in 4K and the quality is insane! #cinematography #4k #filmmaker",
    "likes": 1010,
    "comments": 400,
    "shares": 41,
    "playback_id": "bOP6PoNDB4tEIctIigSVn00VOeQgowmMf1irNudZRq7s",
    "asset_id": "Bo4gQZCFilb01DgKWxBrbvlaNkYdrbjjMq600ilSwodMk",
    "created_at": "2025-07-11T02:05:34.073Z",
    "user_avatar": null,
    "verified": true,
    "duration": 30.113422
  },
  {
    "id": "mux-Bo4gQZCFilb01DgKWxBrbvlaNkYdrbjjMq600ilSwodMk-visual_artist",
    "username": "visual_artist",
    "description": "Experimenting with different angles and compositions 📐 What do you think of this shot? #art #visual #composition #creative",
    "likes": 4676,
    "comments": 225,
    "shares": 186,
    "playback_id": "bOP6PoNDB4tEIctIigSVn00VOeQgowmMf1irNudZRq7s",
    "asset_id": "Bo4gQZCFilb01DgKWxBrbvlaNkYdrbjjMq600ilSwodMk",
    "created_at": "2025-07-12T03:38:03.917Z",
    "user_avatar": null,
    "verified": false,
    "duration": 30.113422
  },
  {
    "id": "mux-Bo4gQZCFilb01DgKWxBrbvlaNkYdrbjjMq600ilSwodMk-content_creator",
    "username": "content_creator",
    "description": "Behind the scenes of my latest project 🎥 The quality difference in 4K is mind-blowing! #bts #content #creatorlife",
    "likes": 3885,
    "comments": 272,
    "shares": 167,
    "playback_id": "bOP6PoNDB4tEIctIigSVn00VOeQgowmMf1irNudZRq7s",
    "asset_id": "Bo4gQZCFilb01DgKWxBrbvlaNkYdrbjjMq600ilSwodMk",
    "created_at": "2025-07-07T14:19:58.298Z",
    "user_avatar": null,
    "verified": true,
    "duration": 30.113422
  },
  {
    "id": "mux-Bo4gQZCFilb01DgKWxBrbvlaNkYdrbjjMq600ilSwodMk-tech_reviewer",
    "username": "tech_reviewer",
    "description": "Testing out this new camera setup 📱 The results speak for themselves! #tech #camera #quality #review",
    "likes": 2672,
    "comments": 485,
    "shares": 137,
    "playback_id": "bOP6PoNDB4tEIctIigSVn00VOeQgowmMf1irNudZRq7s",
    "asset_id": "Bo4gQZCFilb01DgKWxBrbvlaNkYdrbjjMq600ilSwodMk",
    "created_at": "2025-07-08T23:31:54.149Z",
    "user_avatar": null,
    "verified": true,
    "duration": 30.113422
  }
];

// Function to add these videos to the mock database
export async function seedRealVideos() {
  try {
    // In a real app, this would connect to your actual database
    console.log('Seeding database with real video entries...');
    
    for (const video of sampleVideos) {
      console.log(`Adding video: ${video.id} by @${video.username}`);
      // Here you would insert into your actual database
      // For now, we'll just log the video data
    }
    
    console.log(`Successfully seeded ${sampleVideos.length} videos!`);
    return sampleVideos;
  } catch (error) {
    console.error('Error seeding videos:', error);
    throw error;
  }
}

// Export the sample videos for use in the API
export { sampleVideos };
