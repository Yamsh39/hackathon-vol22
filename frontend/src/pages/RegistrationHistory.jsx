import React, { useEffect, useState } from 'react';
import axios from 'axios';

const RegistrationHistory = () => {
  const [registrations, setRegistrations] = useState([]);

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const response = await axios.get('http://localhost:5000/db/registrations');
        const data = Array.isArray(response.data) ? response.data : [];
        setRegistrations(data);
      } catch (error) {
        console.error('Error fetching registration history:', error);
      }
    };

    fetchRegistrations();
  }, []);

  return (
    <div>
      <h1>Registration History</h1>
      <ul>
        {registrations.map((registration) => (
          <li key={registration.receipt_id}>
            <p>{registration.detail}</p> {/* detail プロパティを表示 */}
            <ul>
              {registration.items.map((item) => (
                <li key={item.item_id}>
                  {item.name} - {item.price}円 - {item.quantity}個
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RegistrationHistory;
