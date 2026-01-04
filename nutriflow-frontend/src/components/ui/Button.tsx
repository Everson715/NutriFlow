interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function Button({ children, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className="w-full rounded bg-green-600 py-2 text-white hover:bg-green-700 disabled:opacity-50"
    >
      {children}
    </button>
  );
}
