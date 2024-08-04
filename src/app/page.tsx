import Link from 'next/link';

export default function Home() {
  return (
      <p>
        Go to <Link href="transactions">Transactions</Link>
      </p>
  );
}
