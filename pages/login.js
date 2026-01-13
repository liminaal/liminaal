import { supabase } from "../lib/supabase"

export default function Login() {
  async function login(e) {
    e.preventDefault()
    const email = e.target.email.value
    const password = e.target.password.value
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) alert("Error: " + error.message)
    else {
      alert("¡Login correcto!")
      window.location.href = "/"
    }
  }

  return (
    <div style={{ padding: "50px", maxWidth: "400px", margin: "auto" }}>
      <h1>Login</h1>
      <form onSubmit={login}>
        <input name="email" type="email" placeholder="Email" required style={{ display: "block", margin: "10px 0", padding: "10px", width: "100%" }} />
        <input name="password" type="password" placeholder="Contraseña" required style={{ display: "block", margin: "10px 0", padding: "10px", width: "100%" }} />
        <button type="submit" style={{ padding: "10px 20px", background: "#0070f3", color: "white", border: "none", borderRadius: "5px", width: "100%" }}>
          Entrar
        </button>
      </form>
      <p style={{ textAlign: "center", marginTop: "20px" }}>
        ¿No tienes cuenta? <a href="/register">Regístrate</a>
      </p>
    </div>
  )
}
