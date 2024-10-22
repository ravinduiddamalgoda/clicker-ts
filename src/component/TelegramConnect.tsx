// import React, { useEffect, useState } from "react";

// // Define the type for Telegram WebApp User
// interface TelegramUser {
//   id: number;
//   first_name: string;
//   last_name?: string;
//   username?: string;
//   photo_url?: string;
//   auth_date: number;
//   hash: string;
// }

// const TelegramConnect: React.FC = () => {
//   const [user, setUser] = useState<TelegramUser | null>(null);

//   // Fetch user data from Telegram WebApp when component mounts
//   useEffect(() => {
//     // Ensure the Telegram WebApp SDK is ready
//     window.Telegram.WebApp.ready();

//     // Get user data from Telegram
//     const userData = window.Telegram.WebApp.initDataUnsafe?.user as TelegramUser;

//     if (userData) {
//       setUser(userData);
//     }
//   }, []);

//   return (
//     <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
//       {user ? (
//         <div className="bg-white p-6 rounded shadow-md text-center">
//           <h1 className="text-xl font-bold">Hello, {user.first_name}</h1>
//           {user.last_name && <p className="text-gray-700">{user.last_name}</p>}
//           {user.username && <p className="text-gray-700">@{user.username}</p>}
//           {user.photo_url && (
//             <img
//               src={user.photo_url}
//               alt={`${user.first_name}'s profile`}
//               className="rounded-full w-24 h-24 mt-4"
//             />
//           )}
//         </div>
//       ) : (
//         <p>Loading user data...</p>
//       )}
//     </div>
//   );
// };

// export default TelegramConnect;
export {};