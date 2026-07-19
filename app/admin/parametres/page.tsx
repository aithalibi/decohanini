import React from 'react';
import AdminLayoutClient from '@/components/admin/AdminLayoutClient';
import SettingsForm from '@/components/admin/SettingsForm';
import { getSettings, updateSettings } from '@/actions/settings';

export default async function SettingsPage() {
  const settings = await getSettings();

  return (
    <AdminLayoutClient title="Paramètres" titleAr="الإعدادات" subtitle="Configuration globale de la boutique" subtitleAr="الإعدادات العامة للمتجر">
      <div className="max-w-4xl mx-auto">
        <SettingsForm action={updateSettings} settings={settings} />
      </div>
    </AdminLayoutClient>
  );
}
