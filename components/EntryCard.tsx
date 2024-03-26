const EntryCard = ({ entry }) => {
  return (
    <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow">
      <div className="px-4 py-4 sm:px-6">{entry.text}</div>
    </div>
  );
};

export default EntryCard;
