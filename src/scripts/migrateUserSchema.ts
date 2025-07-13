import { getUsersCollection } from '@/lib/mongodb';

/**
 * Migration script to convert followers/following from numbers to arrays
 * Run this once to fix existing users in the database
 */
async function migrateUserSchema() {
  try {
    console.log('Starting user schema migration...');
    
    const usersCollection = await getUsersCollection();
    
    // Find all users where followers or following are numbers
    const usersToMigrate = await usersCollection.find({
      $or: [
        { followers: { $type: 'number' } },
        { following: { $type: 'number' } }
      ]
    }).toArray();
    
    console.log(`Found ${usersToMigrate.length} users to migrate`);
    
    for (const user of usersToMigrate) {
      const updates: any = {};
      
      if (typeof user.followers === 'number') {
        updates.followers = [];
      }
      
      if (typeof user.following === 'number') {
        updates.following = [];
      }
      
      if (Object.keys(updates).length > 0) {
        await usersCollection.updateOne(
          { _id: user._id },
          { $set: updates }
        );
        
        console.log(`Migrated user: ${user.username}`);
      }
    }
    
    console.log('Migration completed successfully!');
    
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  migrateUserSchema();
}

export default migrateUserSchema;
