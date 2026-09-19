import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  fullPage?: boolean;
}

export default function LoadingState({ message = 'Loading...', fullPage }: LoadingStateProps) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-3 py-16">
      <Loader2 className="w-7 h-7 text-accent-500 animate-spin" />
      <p className="text-sm text-ink-400">{message}</p>
    </div>
  );

  if (fullPage) {
    return <div className="min-h-screen bg-axis-950 flex items-center justify-center">{content}</div>;
  }
  return content;
}
