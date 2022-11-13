import Header from "./header";

export default function ContentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="w-full min-h-screen bg-gray-100">
      <Header>{children}</Header>
    </section>
  );
}
