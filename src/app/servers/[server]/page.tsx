import ClientPage from './ClientPage';

export default async function ServerPage({ params }: { params: Promise<{ server: string }> }) {
  return <ClientPage serverId={(await params).server} />;
}
