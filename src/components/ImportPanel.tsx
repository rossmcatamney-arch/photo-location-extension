interface Props {
  onLoaded: (
    content: string
  ) => void;
}

export function ImportPanel({
  onLoaded,
}: Props) {
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    const text =
      await file.text();

    onLoaded(text);
  };

  return (
    <input
      type="file"
      accept=".csv,.txt"
      onChange={handleFileChange}
    />
  );
}