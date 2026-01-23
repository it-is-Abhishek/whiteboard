// "use client";

// import { EmptyOrg } from "./_components/empty-org";
// import { useOrganization } from "@clerk/nextjs";
// import { BoardList } from "./_components/board-list";

// interface DashboardPageProps {
//     searchParams: {
//         search? : string;
//         favorites? : string;
//     };
// };

// const DashboardPage = ({searchParams}: DashboardPageProps) => {
//     const {organization} = useOrganization();

// ;    return (
//         <div className="flex-1 h-[calc(100%-80px)] p-6">
//             {!organization ? (
//                 <EmptyOrg />
//             ) : (
//                 <BoardList
//                     orgId = {organization.id}
//                     query = {searchParams}
//                 />
//             )}
//             <EmptyOrg/>
//         </div>
//     );
// };

// export default DashboardPage;

"use client";

import { EmptyOrg } from "./_components/empty-org";
import { useOrganization } from "@clerk/nextjs";
import { BoardList } from "./_components/board-list";
import { useSearchParams } from "next/navigation";

const DashboardPage = () => {
  const { organization } = useOrganization();
  const searchParams = useSearchParams();

  const query = {
    search: searchParams.get("search") ?? undefined,
    favorites: searchParams.get("favorites") ?? undefined,
  };

  return (
    <div className="flex-1 h-[calc(100%-80px)] p-6">
      {!organization ? (
        <EmptyOrg />
      ) : (
        <BoardList orgId={organization.id} query={query} />
      )}
    </div>
  );
};

export default DashboardPage;
