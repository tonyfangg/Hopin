export function NotificationSettings() {
  return (
    <div className="bg-white rounded-2xl p-8 border border-slate-100">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
          <span className="text-xl">🔔</span>
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900">Insurance Notifications</h3>
          <p className="text-slate-600">Get alerts about savings opportunities</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200">
          <div>
            <h4 className="font-medium text-slate-900">Email Notifications</h4>
            <p className="text-sm text-slate-600">Receive updates via email</p>
          </div>
          <input type="checkbox" defaultChecked className="h-4 w-4 text-blue-600" />
        </div>

        <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200">
          <div>
            <h4 className="font-medium text-slate-900">SMS Alerts</h4>
            <p className="text-sm text-slate-600">Get urgent alerts via text</p>
          </div>
          <input type="checkbox" defaultChecked className="h-4 w-4 text-blue-600" />
        </div>

        <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200">
          <div>
            <h4 className="font-medium text-slate-900">Insurance Updates</h4>
            <p className="text-sm text-slate-600">New savings opportunities</p>
          </div>
          <input type="checkbox" defaultChecked className="h-4 w-4 text-blue-600" />
        </div>
      </div>
    </div>
  )
} 