'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MemorizationTrackerRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/memorization');
  }, [router]);
  return (
    <div className="container-page py-16 text-center text-sm text-cream-200/65">
      Redirecting to memorization tracker…
    </div>
  );
}
