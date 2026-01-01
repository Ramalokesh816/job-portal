import "./Auth.css";

function Register() {
  const submit = (e) => {
    e.preventDefault();
    window.location.href = "/login";
  };

  return (
    <form className="auth" onSubmit={submit}>
      <h2>Register</h2>
      <input placeholder="Name" required />
      <input placeholder="Email" required />
      <input type="password" placeholder="Password" required />
      <input placeholder="Mobile Number" required />
      <button>Register</button>
    </form>
  );
}

export default Register;
