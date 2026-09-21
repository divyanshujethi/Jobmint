import { Metadata } from 'next';
import { AdminAlligatorsClient } from './client-component';

export const metadata: Metadata = {
  title: "Alligator Intelligence Center | JobMint",
  description: "Live status, crawl controls, and company verification queue for JobMint Alligator Engines.",
};

export default function AdminAlligatorsPage() {
  return <AdminAlligatorsClient />;
}
