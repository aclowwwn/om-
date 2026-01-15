
import React from 'react';
import { VehicleStatus, DueState, AlertSeverity, AlertStatus } from '../types';

export const VehicleStatusChip: React.FC<{ status: VehicleStatus }> = ({ status }) => {
  const styles = {
    active: 'bg-green-100 text-green-700',
    idle: 'bg-amber-100 text-amber-700',
    offline: 'bg-gray-100 text-gray-700'
  };
  return (
    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${styles[status]}`}>
      {status}
    </span>
  );
};

export const HealthScoreBadge: React.FC<{ score: number }> = ({ score }) => {
  let color = 'text-green-600 bg-green-50 border-green-200';
  if (score < 40) color = 'text-red-600 bg-red-50 border-red-200';
  else if (score < 70) color = 'text-amber-600 bg-amber-50 border-amber-200';

  return (
    <span className={`px-2 py-1 rounded border text-sm font-bold ${color}`}>
      {score}%
    </span>
  );
};

export const MaintenanceDueBadge: React.FC<{ state: DueState }> = ({ state }) => {
  const labels = {
    ok: 'On Track',
    due_soon: 'Due Soon',
    overdue: 'Overdue'
  };
  const styles = {
    ok: 'bg-amber-50 text-amber-700 border-amber-100',
    due_soon: 'bg-orange-50 text-orange-700 border-orange-200',
    overdue: 'bg-red-100 text-red-700 border-red-300 animate-pulse'
  };
  return (
    <span className={`px-2 py-0.5 rounded border text-[10px] font-bold uppercase tracking-wider ${styles[state]}`}>
      {labels[state]}
    </span>
  );
};

export const SeverityBadge: React.FC<{ severity: AlertSeverity }> = ({ severity }) => {
  const styles = {
    low: 'text-amber-600',
    med: 'text-orange-600',
    high: 'text-red-600 font-bold'
  };
  return (
    <span className={`text-[10px] uppercase font-bold tracking-widest ${styles[severity]}`}>
      {severity}
    </span>
  );
};

export const AlertStatusBadge: React.FC<{ status: AlertStatus }> = ({ status }) => {
  const styles = {
    open: 'bg-red-50 text-red-700 border-red-200',
    acked: 'bg-amber-50 text-amber-700 border-amber-200',
    closed: 'bg-gray-50 text-gray-500 border-gray-200'
  };
  return (
    <span className={`px-2 py-0.5 rounded border text-[10px] font-bold uppercase ${styles[status]}`}>
      {status}
    </span>
  );
};
