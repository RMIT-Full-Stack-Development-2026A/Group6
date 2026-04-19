"use client";

import React from 'react';
import ProfilePage from '../page';

interface PlayerProfilePageProps {
  params: {
    userId: string;
  };
}

export default function PlayerProfilePage({ params }: PlayerProfilePageProps) {
  return <ProfilePage userId={params.userId} />;
}