export default function LoadingSpinner({ fullScreen = false, size = 'md' }) {
  const s = size === 'sm' ? 'w-5 h-5' : size === 'lg' ? 'w-12 h-12' : 'w-8 h-8';
  const spinner = (
    <div className={`${s} border-2 border-purple-500 border-t-transparent rounded-full animate-spin`} />
  );
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-dark-900 flex items-center justify-center z-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-3 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <p className="font-display text-purple-400 text-sm tracking-widest">LOADING</p>
        </div>
      </div>
    );
  }
  return spinner;
}
