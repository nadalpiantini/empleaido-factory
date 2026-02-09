import OnboardingPageComponent from '@/app/components/onboarding/OnboardingPage';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function OnboardingRoute({ params }: PageProps) {
  return <OnboardingPageComponent params={params} />;
}
