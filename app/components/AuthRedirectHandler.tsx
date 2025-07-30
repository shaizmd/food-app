"use client"
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthRedirectHandler() {
  const { isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) {
      const redirectUrl = sessionStorage.getItem('redirectAfterSignIn');
      if (redirectUrl) {
        sessionStorage.removeItem('redirectAfterSignIn');
        router.push(redirectUrl);
      }
    }
  }, [isSignedIn, router]);

  return null; // This component doesn't render anything
}
