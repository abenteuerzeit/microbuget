import Link from 'next/link';

export default function RootPage({ children }: { children: React.ReactNode }) {
  return (
      <p>
        Go to <Link href="/transactions">Transactions</Link>
      </p>
  );
}
