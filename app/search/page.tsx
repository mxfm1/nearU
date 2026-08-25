import { redirect } from 'next/navigation';

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const source = await searchParams;
  const params = new URLSearchParams();
  Object.entries(source).forEach(([key, value]) => {
    if (typeof value === 'string') params.set(key, value);
  });

  if (params.get('type') === 'proveedores') params.set('scope', 'services');
  if (params.get('type') === 'eventos') params.set('scope', 'events');
  params.delete('type');

  const query = params.toString();
  redirect(query ? `/explorar?${query}` : '/explorar');
}
