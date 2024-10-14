// layout.tsx
import RootProvider from './RootProvider';

export default function Layout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  return (
    <RootProvider params={params}>
      {children}
    </RootProvider>
  );
}