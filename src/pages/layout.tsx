export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex flex-col gap-3 max-w-[100ch] m-auto py-10">{children}</main>
  );
}
