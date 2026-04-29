export default function Placeholder({ title }: { title: string }) {
  return (
    <div className="px-6 md:px-10 py-20 text-center">
      <h1 className="font-display text-4xl font-black">{title}</h1>
      <p className="text-muted-foreground mt-3">Coming soon — wire this up to your Laravel API & contract.</p>
    </div>
  );
}
