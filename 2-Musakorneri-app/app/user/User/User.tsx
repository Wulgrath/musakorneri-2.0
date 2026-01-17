"use client";

import { useSearchParams } from "next/navigation";
import { useGetUserPageDataQuery } from "../../store/api/users.api";

export const User = () => {
  const searchParams = useSearchParams();
  const userId = searchParams.get("id");

  const { data, isLoading, isError } = useGetUserPageDataQuery(
    userId as string,
    { skip: !userId },
  );

  return <div>USER PAGE</div>;
};
