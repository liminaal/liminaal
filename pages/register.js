import { supabase } from "../lib/supabase"

export default function Register() {
  async function register(e) {
    e.preventDefault()
    const email = e.target.email.value
    const password = e.target.password.value
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })
    
    if (error) alert("Error: " + error.message)
    else alert("¡Revisa tu email para confirmar!")
  }

  return (
    <div style={{ padding: "50px", maxWidth: "400px", margin: "auto" }}>
      <h1>Registro</h1>
      <form onSubmit={register}>
        <input 
          name="email" 
          type="email" 
          placeholder="Email" 
          required 
          style={{ display: "block", margin: "10px 0", padding: "10px", width: "100%" }} 
        />
        <input 
          name="password" 
          type="password" 
          placeholder="Contraseña" 
          minLength={6}
          required 
          style={{ display: "block", margin: "10px 0", padding: "10px", width: "100%" }} 
        />
        <button 
          type="submit" 
          style={{
            padding: "10px 20px",
            background: "#10b981",
            color: "white",
            border: "none",
            borderRadius: "5px",
            width: "100%"
          }}
        >
          Crear cuenta
        </button>
      </form>
      <p style={{ textAlign: "center", marginTop: "20px" }}>
        ¿Ya tienes cuenta? <a href="/login">Inicia sesión</a>
      </p>
    </div>
  )
}
