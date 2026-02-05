import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const services = [
    { name: "Doctor", type: "DOCTOR" },
    { name: "Saloon", type: "SALOON" },
    { name: "Car Rental", type: "CAR_RENTAL" },
  ];

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6">Select Service</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {services.map((s) => (
          <div
            key={s.type}
            className="border p-6 rounded shadow hover:shadow-lg cursor-pointer"
            onClick={() => navigate(`/providers/${s.type}`)}
          >
            <h3 className="text-xl font-semibold">{s.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
