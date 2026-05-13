import { NextRequest, NextResponse } from 'next/server';
import { getAuth, getFirestore } from '../lib/firebase-admin';

// Define the subscription plans and their features
export const SUBSCRIPTION_FEATURES = {
  'price_basic': {
    maxCommunities: 3,
    maxMembersPerCommunity: 500,
    features: ['basic_analytics', 'email_support']
  },
  'price_professional': {
    maxCommunities: 10,
    maxMembersPerCommunity: Infinity,
    features: ['advanced_analytics', 'priority_support', 'whatsapp_integration']
  },
  'price_enterprise': {
    maxCommunities: Infinity,
    maxMembersPerCommunity: Infinity,
    features: ['custom_analytics', 'dedicated_support', 'all_integrations', 'custom_branding']
  }
};

// Check if a user has access to a specific feature
export async function checkFeatureAccess(userId: string, feature: string): Promise<boolean> {
  try {
    // Get the user's subscription from Firestore
    const db = getFirestore();
    const userDoc = await db.collection('users').doc(userId).get();
    
    if (!userDoc.exists) {
      return false;
    }
    
    const userData = userDoc.data();
    const planId = userData.subscriptionPlanId;
    const status = userData.subscriptionStatus;
    
    // Check if the subscription is active
    if (status !== 'active' && status !== 'trialing') {
      return false;
    }
    
    // Check if the plan exists
    if (!planId || !SUBSCRIPTION_FEATURES[planId]) {
      return false;
    }
    
    // Check if the feature is included in the plan
    return SUBSCRIPTION_FEATURES[planId].features.includes(feature);
  } catch (error) {
    console.error('Error checking feature access:', error);
    return false;
  }
}

// Check if a user has reached their community limit
export async function checkCommunityLimit(userId: string): Promise<boolean> {
  try {
    // Get the user's subscription and communities from Firestore
    const db = getFirestore();
    const userDoc = await db.collection('users').doc(userId).get();
    
    if (!userDoc.exists) {
      return false;
    }
    
    const userData = userDoc.data();
    const planId = userData.subscriptionPlanId;
    const status = userData.subscriptionStatus;
    
    // Check if the subscription is active
    if (status !== 'active' && status !== 'trialing') {
      return false;
    }
    
    // Check if the plan exists
    if (!planId || !SUBSCRIPTION_FEATURES[planId]) {
      return false;
    }
    
    // Get the user's communities
    const communitiesRef = db.collection('users').doc(userId).collection('communities');
    const communitiesSnapshot = await communitiesRef.get();
    const communityCount = communitiesSnapshot.docs.length;
    
    // Check if the user has reached their community limit
    return communityCount < SUBSCRIPTION_FEATURES[planId].maxCommunities;
  } catch (error) {
    console.error('Error checking community limit:', error);
    return false;
  }
}

// Middleware to check subscription status
export async function withSubscription(
  req: NextRequest,
  handler: (req: NextRequest) => Promise<NextResponse>,
  requiredFeature?: string
): Promise<NextResponse> {
  try {
    // Get the authorization token from the request
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.split('Bearer ')[1];
    
    // Verify the token and get the user
    try {
      const decodedToken = await getAuth().verifyIdToken(token);
      const userId = decodedToken.uid;
      
      // If a specific feature is required, check if the user has access to it
      if (requiredFeature) {
        const hasAccess = await checkFeatureAccess(userId, requiredFeature);
        if (!hasAccess) {
          return NextResponse.json(
            { error: 'Subscription required', feature: requiredFeature },
            { status: 403 }
          );
        }
      }
      
      // Call the handler with the request
      return handler(req);
      
    } catch (error) {
      console.error('Error verifying token:', error);
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Error in subscription middleware:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
