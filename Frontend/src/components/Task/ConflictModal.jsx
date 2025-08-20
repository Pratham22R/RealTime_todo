import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';

const ConflictModal = ({ localTask, serverTask, onResolve, onCancel }) => {
  const [resolution, setResolution] = useState('overwrite');
  const [mergedData, setMergedData] = useState({
    title: localTask.title,
    description: localTask.description,
    priority: localTask.priority,
    assignedUser: localTask.assignedUser?._id || '',
  });

  const handleMergeChange = (field, value) => {
    setMergedData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleResolve = () => {
    if (resolution === 'merge') {
      onResolve('merge', mergedData);
    } else {
      onResolve('overwrite', localTask);
    }
  };

  const getFieldDiff = (localValue, serverValue, fieldName) => {
    if (localValue === serverValue) return null;
    return { field: fieldName, local: localValue, server: serverValue };
  };

  const differences = [
    getFieldDiff(localTask.title, serverTask.title, 'Title'),
    getFieldDiff(localTask.description, serverTask.description, 'Description'),
    getFieldDiff(localTask.priority, serverTask.priority, 'Priority'),
    getFieldDiff(
      localTask.assignedUser?._id,
      serverTask.assignedUser?._id,
      'Assigned User'
    ),
  ].filter(Boolean);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 px-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 p-5 border-b">
          <AlertTriangle className="text-yellow-500" size={28} />
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Conflict Detected</h2>
            <p className="text-sm text-gray-500">
              This task was modified by another user while you were editing it.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Version Info */}
          <div className="flex flex-wrap gap-3">
            <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
              Your Version (v{localTask.version})
            </span>
            <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
              Server Version (v{serverTask.version})
            </span>
          </div>

          {/* Differences */}
          {differences.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-xl border">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">
                Changes detected:
              </h4>
              <ul className="space-y-3">
                {differences.map((diff, index) => (
                  <li
                    key={index}
                    className="p-3 bg-white rounded-lg border shadow-sm"
                  >
                    <strong className="block text-gray-800 mb-1">
                      {diff.field}
                    </strong>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm">
                      <span className="text-blue-600">
                        Your: {diff.local || 'empty'}
                      </span>
                      <span className="text-gray-600">
                        Server: {diff.server || 'empty'}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Resolution Options */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3">
              Choose how to resolve:
            </h4>

            <div className="space-y-3">
              {/* Overwrite */}
              <label className="flex items-start gap-3 p-3 rounded-lg border cursor-pointer hover:bg-gray-50 transition">
                <input
                  type="radio"
                  name="resolution"
                  value="overwrite"
                  checked={resolution === 'overwrite'}
                  onChange={(e) => setResolution(e.target.value)}
                  className="mt-1"
                />
                <div>
                  <span className="font-medium text-gray-800 block">
                    Overwrite server version
                  </span>
                  <small className="text-gray-500">
                    Replace the server version with your changes
                  </small>
                </div>
              </label>

              {/* Merge */}
              <label className="flex items-start gap-3 p-3 rounded-lg border cursor-pointer hover:bg-gray-50 transition">
                <input
                  type="radio"
                  name="resolution"
                  value="merge"
                  checked={resolution === 'merge'}
                  onChange={(e) => setResolution(e.target.value)}
                  className="mt-1"
                />
                <div>
                  <span className="font-medium text-gray-800 block">
                    Merge changes
                  </span>
                  <small className="text-gray-500">
                    Combine both versions (you can edit the result)
                  </small>
                </div>
              </label>
            </div>

            {/* Merge Form */}
            {resolution === 'merge' && (
              <div className="mt-5 space-y-4">
                <h5 className="text-sm font-semibold text-gray-700">
                  Merge Result:
                </h5>
                <div className="space-y-3">
                  {/* Title */}
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={mergedData.title}
                      onChange={(e) =>
                        handleMergeChange('title', e.target.value)
                      }
                      className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter merged title"
                    />
                  </div>
                  {/* Description */}
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Description
                    </label>
                    <textarea
                      value={mergedData.description}
                      onChange={(e) =>
                        handleMergeChange('description', e.target.value)
                      }
                      className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter merged description"
                      rows={3}
                    />
                  </div>
                  {/* Priority */}
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Priority
                    </label>
                    <select
                      value={mergedData.priority}
                      onChange={(e) =>
                        handleMergeChange('priority', e.target.value)
                      }
                      className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 p-5 border-t bg-gray-50">
          <button
            type="button"
            className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100 transition"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-5 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
            onClick={handleResolve}
          >
            {resolution === 'merge' ? 'Merge & Save' : 'Overwrite'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConflictModal;
