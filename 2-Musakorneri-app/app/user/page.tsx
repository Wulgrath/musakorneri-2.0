import { Suspense } from "react";
import { User } from "./User/User";

export default function UserPage() {
  return (
    <Suspense fallback={<div className="p-4">Loading...</div>}>
      <User />
    </Suspense>
  );
}
