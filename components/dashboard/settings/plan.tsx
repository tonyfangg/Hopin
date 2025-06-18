import Button from '@/components/ui/button'

export function PlanSettings() {
 return (
   <div className="space-y-6">
     {/* Current Plan */}
     <div className="bg-white rounded-2xl p-6 border border-slate-100">
       <h3 className="text-lg font-bold text-slate-900 mb-4">Current Plan</h3>
       <div className="text-center">
         <div className="text-2xl font-bold text-blue-600 mb-2">Professional</div>
         <div className="text-slate-600">£29/month</div>
         <div className="mt-4 p-3 bg-blue-50 rounded-lg">
           <p className="text-sm text-blue-800">✓ Up to 10 properties</p>
           <p className="text-sm text-blue-800">✓ Insurance insights</p>
           <p className="text-sm text-blue-800">✓ Priority support</p>
         </div>
       </div>
     </div>

     {/* Upgrade Option */}
     <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-200">
       <h3 className="text-lg font-bold text-slate-900 mb-2">Switch to Premium</h3>
       <p className="text-sm text-slate-600 mb-4">Get advanced features and unlimited properties</p>
       <Button className="w-full bg-purple-600 hover:bg-purple-700">
         Upgrade Now (Demo)
       </Button>
     </div>

     {/* Support */}
     <div className="bg-white rounded-2xl p-6 border border-slate-100">
       <div className="flex items-center gap-3 mb-4">
         <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
           <span className="text-lg">⚙️</span>
         </div>
         <h3 className="text-lg font-bold text-slate-900">Support & FAQ</h3>
       </div>
       <p className="text-sm text-slate-600 mb-4">Get help and assistance</p>
       <Button variant="outline" className="w-full">
         Contact Support
       </Button>
     </div>

     {/* Data & Privacy */}
     <div className="bg-white rounded-2xl p-6 border border-slate-100">
       <div className="flex items-center gap-3 mb-4">
         <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
           <span className="text-lg">📄</span>
         </div>
         <h3 className="text-lg font-bold text-slate-900">Data & Privacy</h3>
       </div>
       <p className="text-sm text-slate-600 mb-4">Control your data sharing</p>
       <div className="space-y-2">
         <button className="w-full text-left text-sm text-slate-600 hover:text-slate-900 py-2">
           Privacy Policy
         </button>
         <button className="w-full text-left text-sm text-slate-600 hover:text-slate-900 py-2">
           Data Export
         </button>
         <button className="w-full text-left text-sm text-red-600 hover:text-red-700 py-2">
           Delete Account
         </button>
       </div>
     </div>

     {/* Logout */}
     <div className="bg-white rounded-2xl p-6 border border-slate-100">
       <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50">
         Log out
       </Button>
     </div>
   </div>
 )
} 