'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ReadingTrackerRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/progress');
  }, [router]);
  return (
    <div className="container-page py-16 text-center text-sm text-cream-200/65">
      Redirecting to progress dashboard…
    </div>
  );
}
