import { NextPage } from 'next';

const PropertiesPage: NextPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Properties</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Add Property
        </button>
      </div>
      
      <div className="bg-white rounded-xl p-6 border border-slate-200">
        <p className="text-slate-600">Properties management coming soon...</p>
      </div>
    </div>
  );
};

export default PropertiesPage;
  