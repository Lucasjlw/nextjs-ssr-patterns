import { useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { UserConfigItem } from "./api/users";

function SkeletonUserButton() {
  return (
    <div className="flex border gap-x-2 w-48 border-slate-500 bg-slate-900 items-center rounded-xl p-2 hover:bg-slate-700">
      <div className="w-[40px] h-[40px] bg-gray-400 rounded-3xl animate-pulse" />

      <div className="h-4 w-32 bg-gray-400 rounded-2xl animate-pulse" />
    </div>
  );
}

function UserButtonList({
  isLoading,
  userConfig,
}: {
  isLoading: boolean;
  userConfig: UserConfigItem[];
}) {
  const renderItemList = () => {
    if (isLoading)
      return [...Array(50)].map((_, i) => (
        <li key={`SkeletonUserButton-${i}`}>
          <SkeletonUserButton />
        </li>
      ));

    return userConfig.map(({ name, email, avatar }) => (
      <li key={email}>
        <Link
          href="#"
          className="flex border gap-x-2 w-48 border-slate-500 bg-slate-900 items-center rounded-xl p-2 hover:bg-slate-700"
        >
          <Image
            className="rounded-2xl"
            width="40"
            height="40"
            alt="User Logo"
            src={avatar}
          />

          <span>{name}</span>
        </Link>
      </li>
    ));
  };

  return (
    <ul className="grid gap-y-4 grid-cols-[repeat(7,_1fr)]">
      {renderItemList()}
    </ul>
  );
}

export default function SSR() {
  const [isLoading, setIsLoading] = useState(true);
  const [userConfig, setUserConfig] = useState<UserConfigItem[]>([]);

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then(({ userConfig }) => {
        setUserConfig(userConfig ?? []);
        setIsLoading(false);
      });
  }, []);

  return (
    <main className="w-full h-full">
      <h1>SSR Example</h1>

      <UserButtonList isLoading={isLoading} userConfig={userConfig} />
    </main>
  );
}
