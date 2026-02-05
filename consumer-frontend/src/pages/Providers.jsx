import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

const Providers = () => {
    const { serviceType } = useParams();
    const navigate = useNavigate();
    const [providers, setProviders] = useState([]);

    useEffect(() => {
        const fetchProviders = async () => {
            try {
                const res = await api.get(
                    `/providers?serviceType=${serviceType}`
                );
                setProviders(res.data?.data || []);
            } catch (error) {
                console.error("Error fetching providers:", error);
            }
        };

        if (serviceType) fetchProviders();
    }, [serviceType]);

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">
                Available {serviceType} Providers
            </h2>

            {providers.length === 0 ? (
                <p className="text-gray-500">No providers available</p>
            ) : (
                <div className="grid gap-6">
                    {providers.map((p) => (
                        <div
                            key={p._id}
                            className="border rounded-lg p-6 shadow bg-white"
                        >
                            {/* HEADER */}
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-semibold">{p.name}</h3>
                                    <p className="text-sm text-gray-500">
                                        Service: {p.serviceType}
                                    </p>
                                </div>

                                <button
                                    onClick={() => navigate(`/slots/${p._id}`)}
                                    className="bg-blue-600 text-white px-4 py-2 rounded"
                                >
                                    View Slots
                                </button>
                            </div>

                            {/* DETAILS */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                {/* Doctor */}
                                {p.serviceType === "DOCTOR" && (
                                    <>
                                        <p>
                                            <strong>Specialization:</strong>{" "}
                                            {p.specialization}
                                        </p>
                                        <p>
                                            <strong>Experience:</strong>{" "}
                                            {p.experienceYears} years
                                        </p>
                                    </>
                                )}

                                {p.serviceType === "SALOON" && (
                                    <>
                                        <p>
                                            <strong>Location:</strong> {p.location}
                                        </p>
                                        <p>
                                            <strong>Phone:</strong> {p.phoneNumber}
                                        </p>
                                    </>
                                )}


                                {/* Car Rental */}
                                {p.serviceType === "CAR_RENTAL" && (
                                    <p>
                                        <strong>Car Types:</strong>{" "}
                                        {(p.carTypes || []).join(", ")}
                                    </p>
                                )}

                                {/* Common */}
                                {p.email && (
                                    <p>
                                        <strong>Contact:</strong> {p.email}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Providers;
