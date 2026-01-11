interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function Input(props: InputProps) {
  return (
    <input
      {...props}
      className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
    />
  );
}