import OnboardingPageComponent from '@/app/components/onboarding/OnboardingPage';

export default function TestUserOnboardingPage() {
  return <OnboardingPageComponent params={Promise.resolve({ id: 'test-user' })} />;
}
