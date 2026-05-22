import React from 'react';
import ProfilePage from '../page';

interface PlayerProfilePageProps {
  params: Promise<{
    userId: string;
  }>;
}

export default async function PlayerProfilePage({ params }: PlayerProfilePageProps) {
  const { userId } = await params;
  return <ProfilePage userId={userId} />;
}