import { NextRequest, NextResponse } from 'next/server';
import { getUsersCollection } from '@/lib/mongodb';

export async function POST(request: NextRequest) {
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
    
    let migratedCount = 0;
    
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
        migratedCount++;
      }
    }
    
    return NextResponse.json({ 
      success: true,
      message: `Migration completed successfully! Migrated ${migratedCount} users.`,
      migratedCount 
    });
    
  } catch (error) {
    console.error('Migration failed:', error);
    return NextResponse.json(
      { error: 'Migration failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
