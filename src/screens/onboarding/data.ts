import React from 'react';
import { FamilyIllustration, MaintenanceIllustration, PaymentIllustration } from './illustrations';

export interface OnboardingSlide {
    id: number;
    title: string;
    description: string;
    Illustration: React.FC<{ width?: number; height?: number }>;
}

export const onboardingSlides: OnboardingSlide[] = [
    {
        id: 1,
        title: 'Sakane-Where living gets easier',
        description: 'Sakane makes community living easier. Enjoy a simpler, smarter way to live in your community.',
        Illustration: FamilyIllustration,
    },
    {
        id: 2,
        title: 'One tap to fix anything',
        description: 'Report any home issue in seconds with a quick maintenance request. Sakane connects you to fast and reliable support, keeping your home running smoothly.',
        Illustration: MaintenanceIllustration,
    },
    {
        id: 3,
        title: 'Your bills, paid in seconds',
        description: 'Pay all your bills easily with flexible options. Use your wallet balance, your bank card, or Fawry—whatever works best for you. Fast, secure, and convenient every time.',
        Illustration: PaymentIllustration,
    },
];
