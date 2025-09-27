export default function AppointmentList({ appointments }) {
    if (!appointments.length)
      return <p className="text-gray-400">No appointments yet</p>;
  
    return (
      <ul className="bg-gray-900 rounded-lg p-4 space-y-2">
        {appointments.map((a) => (
          <li key={a.id} className="flex justify-between border-b border-gray-700 pb-2">
            <span>{a.title}</span>
            <span>{a.date}</span>
          </li>
        ))}
      </ul>
    );
  }
  