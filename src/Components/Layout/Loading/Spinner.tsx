// src/Components/Products/LoadingSpinner.tsx
export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[color:var(--primary-color)]"></div>
      <span className="ml-3 text-slate-600">Yükleniyor...</span>
    </div>
  );
}
