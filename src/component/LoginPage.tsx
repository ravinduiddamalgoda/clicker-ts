// import React, { useState } from "react";
// import { signInWithEmailAndPassword } from "firebase/auth";
// import { auth } from "../firebase_config";

// const LoginPage: React.FC = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");

//     try {
//       await signInWithEmailAndPassword(auth, email, password);
//       alert("Login Successful!");
//     } catch (error: any) {
//       setError(error.message);
//     }
//   };

//   return (
//     <div className="flex items-center justify-center h-screen bg-gray-900">
//       <div className="bg-gray-800 text-white p-8 rounded-xl shadow-lg w-96">
//         <h2 className="text-3xl font-bold mb-6 text-center">Login</h2>
//         <form onSubmit={handleLogin}>
//           <div className="mb-4">
//             <label htmlFor="email" className="block text-gray-300 mb-1">
//               Email
//             </label>
//             <input
//               type="email"
//               id="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none"
//               required
//             />
//           </div>
//           <div className="mb-4">
//             <label htmlFor="password" className="block text-gray-300 mb-1">
//               Password
//             </label>
//             <input
//               type="password"
//               id="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none"
//               required
//             />
//           </div>
//           {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
//           <button
//             type="submit"
//             className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-bold"
//           >
//             Login
//           </button>
//         </form>
//         <p className="mt-4 text-gray-400 text-center">
//           Don't have an account?{" "}
//           <a href="/register" className="text-blue-400 underline">
//             Register here
//           </a>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;
export {};