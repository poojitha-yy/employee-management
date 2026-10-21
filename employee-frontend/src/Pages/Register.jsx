import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Auth.css";
import businessRecruitment from "../assets/business-recruitment.png";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    employeeId: "",
    email: "",
    gender: "",
    age: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });

  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Request an activation OTP
  const handleSendOtp = async () => {
    const employeeId = formData.employeeId.trim().toUpperCase();
    const email = formData.email.trim().toLowerCase();

    if (!employeeId || !email) {
      alert("Please enter Employee ID and Company Email first.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/send-activation-otp",
        { employeeId, email },
      );

      alert(response.data.message || "OTP request successful.");
      setOtpSent(true);
    } catch (error) {
      console.error("Send OTP error:", error.response?.data || error.message);

      alert(
        error.response?.data?.message ||
          "Failed to send OTP. Check the backend terminal.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Activate the employee account
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otpSent) {
      alert("Please request an OTP first.");
      return;
    }

    if (!/^\d{6}$/.test(formData.otp.trim())) {
      alert("Please enter a valid 6-digit OTP.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (Number(formData.age) < 18 || Number(formData.age) > 65) {
      alert("Age must be between 18 and 65.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...formData,
        employeeId: formData.employeeId.trim().toUpperCase(),
        email: formData.email.trim().toLowerCase(),
        otp: formData.otp.trim(),
        age: Number(formData.age),
      };

      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        payload,
      );

      alert(response.data.message || "Account activated successfully.");
      navigate("/login");
    } catch (error) {
      console.error(
        "Account activation error:",
        error.response?.data || error.message,
      );

      alert(
        error.response?.data?.message ||
          "Account activation failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="auth-content">
        <div className="auth-image-section">
          <img src={businessRecruitment} alt="Business Recruitment" />
        </div>

        <div className="register-card">
          <h2>Activate Employee Account</h2>

          <p className="register-subtitle">
            Complete your account activation using your Employee ID and Company
            Email.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="employeeId">Employee ID</label>
                <input
                  id="employeeId"
                  type="text"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleChange}
                  placeholder="EMP001"
                  required
                  disabled={otpSent}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Company Email</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="employee@gprec.ac.in"
                  required
                  disabled={otpSent}
                />
              </div>
            </div>

            {!otpSent ? (
              <button
                type="button"
                className="register-btn"
                onClick={handleSendOtp}
                disabled={loading}
                style={{ marginTop: "16px" }}
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            ) : (
              <>
                <div className="form-row">
                  <div className="form-group" style={{ width: "100%" }}>
                    <label htmlFor="otp">Verification OTP</label>
                    <input
                      id="otp"
                      type="text"
                      name="otp"
                      value={formData.otp}
                      onChange={handleChange}
                      placeholder="Enter 6-digit OTP"
                      inputMode="numeric"
                      maxLength={6}
                      pattern="[0-9]{6}"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="gender">Gender</label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="age">Age</label>
                    <input
                      id="age"
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      placeholder="Enter Age"
                      min="18"
                      max="65"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                      id="password"
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter Password"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                      id="confirmPassword"
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm Password"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="register-btn"
                  disabled={loading}
                >
                  {loading ? "Activating..." : "Activate Account"}
                </button>

                <button
                  type="button"
                  className="register-btn"
                  disabled={loading}
                  onClick={() => {
                    setOtpSent(false);
                    setFormData((prev) => ({
                      ...prev,
                      otp: "",
                      gender: "",
                      age: "",
                      password: "",
                      confirmPassword: "",
                    }));
                  }}
                  style={{ marginTop: "10px" }}
                >
                  Change Employee Details
                </button>
              </>
            )}
          </form>

          <p className="login-link">
            Already activated your account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
