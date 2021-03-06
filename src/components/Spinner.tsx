export type Props = never;

function Spinner(/* _: Props */) {
  return (
    <div className="flex gap-1" role="status">
      <span className="sr-only">Loading…</span>
      <div className="h-2 w-2 animate-bounce rounded-full bg-stone-300" />
      <div className="animate-delay-200 h-2 w-2 animate-bounce rounded-full bg-stone-300" />
      <div className="animate-delay-400 h-2 w-2 animate-bounce rounded-full bg-stone-300" />
    </div>
  );
}

export default Spinner;
