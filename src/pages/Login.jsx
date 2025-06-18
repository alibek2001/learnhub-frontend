import loginImg from "../assets/Images/login.png"
import Template from "../components/core/Auth/Template"

function Login() {
  return (
    <Template
      title="Добро пожаловать"
      description1="Развивайте навыки для сегодняшнего и завтрашнего дня."
      description2="Образование для обеспечения будущего вашей карьеры."
      image={loginImg}
      formType="login"
    />
  )
}

export default Login