import SyllabusDetailContent from "./_components/SyllabusDetailContent";

export default async function SyllabusDetailPage({ params }) {
  const { slug } = await params;
  return <SyllabusDetailContent slug={slug} />;
}
