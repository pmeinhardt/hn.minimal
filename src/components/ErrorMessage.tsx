export type Props = { error: Error };

function ErrorMessage({ error }: Props) {
  return (
    <>
      <h4 className="mb-1 text-xl font-bold">Oops! 💥</h4>
      <p>{error.message}</p>
    </>
  );
}

export default ErrorMessage;
