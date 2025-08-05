export function PropertySettings() {
  return (
    <div className="bg-white rounded-2xl p-8 border border-slate-100">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
          <span className="text-xl">🏢</span>
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900">Property Portfolio</h3>
          <p className="text-slate-600">Manage all your properties</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-slate-900">Shop #1 - City Centre</h4>
              <p className="text-sm text-slate-600">123 High Street, City Centre</p>
            </div>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Edit
            </button>
          </div>
        </div>

        <div className="p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-slate-900">Shop #2 - Shopping Centre</h4>
              <p className="text-sm text-slate-600">456 Shopping Centre, Mall District</p>
            </div>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Edit
            </button>
          </div>
        </div>

        <button className="w-full p-4 border-2 border-dashed border-slate-300 rounded-lg text-slate-600 hover:border-blue-500 hover:text-blue-600 transition-colors">
          + Add New Property
        </button>
      </div>
    </div>
  )
} 