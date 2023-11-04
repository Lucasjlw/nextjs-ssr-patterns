import { useEffect, useState } from "react";

import { GetServerSideProps } from "next";
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

function ClientUserButtonList() {
  const [isLoading, setIsLoading] = useState(true);
  const [baseUserConfig, setBaseUserConfig] = useState<UserConfigItem[]>([]);

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then(({ userConfig }) => {
        setBaseUserConfig(userConfig ?? []);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="mt-8">
      <h2>Users</h2>

      <UserButtonList isLoading={isLoading} userConfig={baseUserConfig} />
    </div>
  );
}

export default function SSR({
  adminsUserConfig,
}: {
  adminsUserConfig: UserConfigItem[];
}) {
  return (
    <main className="w-full h-full">
      <h1>SSR Example</h1>

      <h2 className="mt-8">Admins</h2>
      <UserButtonList isLoading={false} userConfig={adminsUserConfig} />

      <ClientUserButtonList />
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const serverURL = "http://localhost:3001/api/users?admins=true";

  // prettier-ignore
  const { userConfig } = await (fetch(serverURL).then(res => res.json()));

  return {
    props: {
      adminsUserConfig: userConfig ?? [],
    },
  };
};
