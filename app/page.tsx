'use client';

import { useState } from 'react';
import { WorkRecord, RecordStatus } from './types';

const PROJECTS = ['AI Study Planner', 'E-commerce Platform', 'Mobile App'];

export default function Home() {
  const [records, setRecords] = useState<WorkRecord[]>([]);
  const [currentText, setCurrentText] = useState('');
  const [currentProject, setCurrentProject] = useState(PROJECTS[0]);
  const [error, setError] = useState('');
  const [selectedProjectForResume, setSelectedProjectForResume] = useState(PROJECTS[0]);
  const [resumeBullet, setResumeBullet] = useState('');
  const [showDetails, setShowDetails] = useState(false);

  // Feature 1: Record today's contribution
  const handleRecord = () => {
    if (!currentText.trim()) {
      setError('Please enter a contribution description');
      return;
    }

    setError('');
    const newRecord: WorkRecord = {
      id: Date.now().toString(),
      project: currentProject,
      text: currentText.trim(),
      createdAt: new Date(),
      status: 'pending',
    };

    setRecords([newRecord, ...records]);
    setCurrentText('');
  };

  // Feature 2: Verify flow (mock verification)
  const handleVerify = (recordId: string) => {
    setRecords(records.map(record => 
      record.id === recordId 
        ? { ...record, status: 'verified' as RecordStatus, verifiedAt: new Date() }
        : record
    ));
  };

  // Feature 4: Generate résumé bullet (mock AI)
  const generateResumeBullet = () => {
    const verifiedRecords = records.filter(
      r => r.status === 'verified' && r.project === selectedProjectForResume
    );

    if (verifiedRecords.length === 0) {
      setResumeBullet('No verified work logs found for this project.');
      return;
    }

    const sortedRecords = [...verifiedRecords].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
    const oldestDate = sortedRecords[sortedRecords.length - 1].createdAt;
    const newestDate = sortedRecords[0].createdAt;

    const dateRange = formatDateRange(oldestDate, newestDate);
    const count = verifiedRecords.length;

    const bullet = `Experience: ${selectedProjectForResume} – Product/Engineering\n\n- Contributed to the project by implementing core components (UI layout, login flow, performance improvements).\n\nBased on ${count} verified work log${count > 1 ? 's' : ''} between ${dateRange}.`;

    setResumeBullet(bullet);
    setShowDetails(false);
  };

  const formatDateRange = (start: Date, end: Date): string => {
    const formatDate = (date: Date) => {
      const month = date.toLocaleString('default', { month: 'short' });
      const day = date.getDate();
      return `${month} ${day}`;
    };
    return `${formatDate(start)}–${formatDate(end)}`;
  };

  const formatDateTime = (date: Date): string => {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Get records for selected project (for details view)
  const getProjectRecords = () => {
    return records
      .filter(r => r.project === selectedProjectForResume && r.status === 'verified')
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">RiseVault Prototype</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side: Record & Timeline */}
          <div className="space-y-8">
            {/* Feature 1: Record Contribution */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Record today's contribution</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project
                  </label>
                  <select
                    value={currentProject}
                    onChange={(e) => setCurrentProject(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {PROJECTS.map(project => (
                      <option key={project} value={project}>{project}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contribution Description
                  </label>
                  <textarea
                    value={currentText}
                    onChange={(e) => {
                      setCurrentText(e.target.value);
                      setError('');
                    }}
                    placeholder="Describe what you worked on today..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {error && (
                    <p className="mt-2 text-sm text-red-600">{error}</p>
                  )}
                </div>

                <button
                  onClick={handleRecord}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Record
                </button>
              </div>
            </div>

            {/* Feature 2: Pending/Verify State */}
            {records.length > 0 && records[0].status === 'pending' && (
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">🔵</span>
                  <span className="text-gray-700">Pending verification…</span>
                  <div className="group relative">
                    <span className="flex h-5 w-5 cursor-help items-center justify-center rounded-full border border-gray-300 bg-white text-xs font-medium text-gray-500 hover:border-gray-400 hover:text-gray-600">
                      ?
                    </span>
                    <div className="absolute left-0 top-6 z-10 hidden w-64 rounded-lg border border-gray-200 bg-white p-3 text-xs text-gray-700 shadow-lg group-hover:block">
                      &quot;Verify&quot; represents a lightweight confirmation of this entry (e.g., by a teammate, mentor, or manager). In this MVP, it is shown in a simplified, simulated form to illustrate the flow.
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleVerify(records[0].id)}
                  className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  Verify now
                </button>
                <div className="mt-4">
                  <a
                    href="/landing#trust-model"
                    className="text-sm text-gray-500 underline hover:text-gray-700"
                  >
                    How verification works →
                  </a>
                </div>
              </div>
            )}

            {/* Feature 2: Verified State */}
            {records.length > 0 && records[0].status === 'verified' && records[0].verifiedAt && (
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">✅</span>
                  <div>
                    <p className="text-gray-700 font-medium">
                      Verified by RiseVault — {formatDateTime(records[0].verifiedAt)}
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <a
                    href="/landing#trust-model"
                    className="text-sm text-gray-500 underline hover:text-gray-700"
                  >
                    How verification works →
                  </a>
                </div>
              </div>
            )}

            {/* Feature 3: Timeline List */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Timeline</h2>
              {records.length === 0 ? (
                <p className="text-gray-500 text-sm">No records yet. Record your first contribution above.</p>
              ) : (
                <div className="space-y-3">
                  {records.map(record => (
                    <div
                      key={record.id}
                      className="flex items-start gap-3 p-3 border border-gray-200 rounded-md hover:bg-gray-50"
                    >
                      <span className="text-xl mt-0.5">
                        {record.status === 'pending' ? '🔵' : '✅'}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-gray-500">
                            {formatTime(record.createdAt)}
                          </span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-600 font-medium">
                            {record.project}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 truncate">
                          {record.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Side: Résumé Section */}
          <div className="space-y-8">
            {/* Feature 4 & 5: Generate Résumé Bullet */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Generate résumé bullet</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Project
                  </label>
                  <select
                    value={selectedProjectForResume}
                    onChange={(e) => setSelectedProjectForResume(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {PROJECTS.map(project => (
                      <option key={project} value={project}>{project}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={generateResumeBullet}
                  className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                >
                  Generate résumé bullet
                </button>

                {resumeBullet && (
                  <div className="mt-4">
                    <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                      <pre className="whitespace-pre-wrap text-sm text-gray-800 font-sans">
                        {resumeBullet}
                      </pre>
                    </div>

                    {/* Feature 5: Expand to view underlying work logs */}
                    <details className="mt-4">
                      <summary className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-700">
                        View underlying work logs
                      </summary>
                      <ul className="mt-3 space-y-2 pl-4">
                        {getProjectRecords().map(record => (
                          <li key={record.id} className="text-sm text-gray-700">
                            [{formatTime(record.createdAt)}] {record.text}
                          </li>
                        ))}
                      </ul>
                    </details>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

