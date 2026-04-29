import { useEffect, useState } from "react";

/**
 * Mock of useRentalCountdown — in production this reads `userExpires(tokenId)`
 * from an ERC-4907 contract via wagmi's useReadContract.
 */
export function useRentalCountdown(expiresAtSec: number) {
  const [remaining, setRemaining] = useState(() =>
    Math.max(0, expiresAtSec - Math.floor(Date.now() / 1000))
  );

  useEffect(() => {
    const tick = () =>
      setRemaining(Math.max(0, expiresAtSec - Math.floor(Date.now() / 1000)));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [expiresAtSec]);

  const days = Math.floor(remaining / 86400);
  const hours = Math.floor((remaining % 86400) / 3600);
  const minutes = Math.floor((remaining % 3600) / 60);
  const seconds = remaining % 60;

  return { remaining, days, hours, minutes, seconds, expired: remaining === 0 };
}
