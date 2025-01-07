// import React, { useState, useContext } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import styles from "../styles/login.module.css";
// import { AuthContext } from "../context/AuthContext";
// import Loginimg from "../images/Loginimg.png";

// const Login = () => {
//   const { login ,user} = useContext(AuthContext);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");
//   const [showPopup, setShowPopup] = useState(false);
//   const navigate = useNavigate();

//   const handleLogin = async (event) => {
//     event.preventDefault();
//     setErrorMessage("");

//     if (!email || !password) {
//       setErrorMessage("Both email and password are required.");
//       return;
//     }

//     try {
//       const response = await fetch("http://127.0.0.1:8000/api/login/", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await response.json();
//       console.log("data")
//       console.log(data)

//       if (response.ok) {
//         // Assume the API returns user data and a token
//         login({ email: data.data });
//         console.log("login");
//         console.log(user);
//         localStorage.setItem("authToken", data.authToken); // Save token for future requests
//         setShowPopup(true);
//         setTimeout(() => {
//           setShowPopup(false);
//           navigate("/");
//         }, 3000);
//       } else {
//         // Handle error message from API response
//         setErrorMessage(data.message || "Login failed. Please try again.");
//       }
//     } catch (error) {
//       console.error("Error during login:", error);
//       setErrorMessage("An error occurred. Please try again later.");
//     }
//   };

//   return (
//     <div className={styles.login}>
//       <div className={styles["login-box"]}>
//         <div className={styles["left-side"]}>
//           <h2>Welcome Back!</h2>
//           <p>Log in to continue accessing your account and Schemes.</p>
//           <img src={Loginimg} alt="Login" style={{ maxWidth: "300px", marginBottom: "20px" }} />
//         </div>
//         <div className={styles["right-side"]}>
//           <h2>Sign In</h2>
//           <form onSubmit={handleLogin}>
//             <div className={styles["input-group"]}>
//               <label htmlFor="email">Email</label>
//               <input
//                 type="email"
//                 id="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//               />
//             </div>
//             <div className={styles["input-group"]}>
//               <label htmlFor="password">Password</label>
//               <input
//                 type="password"
//                 id="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//             </div>
//             <button type="submit" className={styles["login-button"]}>
//               Sign In
//             </button>
//           </form>
//           {errorMessage && <p className={styles["error-message"]}>{errorMessage}</p>}
//           <div className={styles["signup-link"]}>
//             <p>
//               New user? <Link to="/signup">Sign up</Link>
//             </p>
//           </div>
//         </div>
//       </div>
//       {showPopup && (
//         <div className={styles["popup"]}>
//           <h2>Login Successful!</h2>
//           <p>Redirecting...</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Login;





import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../styles/login.module.css";
import { AuthContext } from "../context/AuthContext";
import Loginimg from "../images/Loginimg.png";

const Login = () => {
  const { login, user } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("User"); // Default role is 'User'
  const [errorMessage, setErrorMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("Both email and password are required.");
      return;
    }

    // Determine API endpoint based on role
    const endpoint = role === "Admin" 
      ? "http://127.0.0.1:8000/api/admin/login/" 
      : "http://127.0.0.1:8000/api/login/";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("data:", data);

      if (response.ok) {
        // Assume the API returns user data and a token
        login({ email: data.data });
        localStorage.setItem("authToken", data.authToken); // Save token for future requests
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
          // Navigate based on role
          if (role === "Admin") {
            navigate("/adminhome");
          } else {
            navigate("/");
          }
        }, 3000);
      } else {
        // Handle error message from API response
        setErrorMessage(data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setErrorMessage("An error occurred. Please try again later.");
    }
  };

  return (
    <div className={styles.login}>
      <div className={styles["login-box"]}>
        <div className={styles["left-side"]}>
          <h2>Welcome Back!</h2>
          <p>Log in to continue accessing your account and Schemes.</p>
          <img src={Loginimg} alt="Login" style={{ maxWidth: "300px", marginBottom: "20px" }} />
        </div>
        <div className={styles["right-side"]}>
          <h2>Sign In</h2>
          <form onSubmit={handleLogin}>
            <div className={styles["input-group"]}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className={styles["input-group"]}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className={styles["input-group"]}>
              <label htmlFor="role">Role</label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <option value="User">User</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
            <button type="submit" className={styles["login-button"]}>
              Sign In
            </button>
          </form>
          {errorMessage && <p className={styles["error-message"]}>{errorMessage}</p>}
          <div className={styles["signup-link"]}>
            <p>
              New user? <Link to="/signup">Sign up</Link>
            </p>
          </div>
        </div>
      </div>
      {showPopup && (
        <div className={styles["popup"]}>
          <h2>Login Successful!</h2>
          <p>Redirecting...</p>
        </div>
      )}
    </div>
  );
};

export default Login;
