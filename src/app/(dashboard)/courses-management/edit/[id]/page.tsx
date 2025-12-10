// src/app/(dashboard)/courses-management/edit/[id]/page.tsx

import EditCoursePage from "@/components/Dashboard/CoursesManagement/EditCoursePage";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return <EditCoursePage id={id} />;
}
