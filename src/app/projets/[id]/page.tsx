import { redirect } from 'next/navigation';

export default function ProjetRedirect({ params }: { params: { id: string } }) {
  redirect(`/account/projects/${params.id}`);
}
