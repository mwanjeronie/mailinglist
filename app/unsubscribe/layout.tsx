import React from "react"
import { Suspense } from 'react';

export default function UnsubscribeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Suspense fallback={null}>{children}</Suspense>;
}
