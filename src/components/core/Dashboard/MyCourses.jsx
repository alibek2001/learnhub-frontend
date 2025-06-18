import { useEffect, useState } from "react"
import { VscAdd } from "react-icons/vsc"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

// Импортируем функцию из mockCourseAPI вместо courseDetailsAPI
import { fetchInstructorCourses } from "../../../services/operations/mockCourseAPI"
import IconBtn from "../../common/IconBtn"
import CoursesTable from "./InstructorCourses/CoursesTable"


export default function MyCourses() {
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(false)

  // Загружаем курсы только один раз при монтировании компонента
  // или при изменении токена
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      const result = await fetchInstructorCourses(token)
      console.log('Курсы инструктора:', result);
      setLoading(false);
      if (result) {
        setCourses(result)
      }
    }
    fetchCourses()
  }, [token])


  // Scroll to the top of the page when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [])

  return (
    <div>
      <div className="mb-14 flex justify-between">
        {/* <div className="mb-14 flex items-center justify-between"> */}
        <h1 className="text-4xl font-medium text-richblack-5 font-boogaloo text-center lg:text-left">Мои курсы</h1>
        <IconBtn
          text="Добавить курс"
          onclick={() => navigate("/dashboard/add-course")}
        >
          <VscAdd />
        </IconBtn>
      </div>

      {/* Таблица курсов */}
      {loading ? (
        <div className="flex justify-center items-center h-48">
          <p className="text-xl text-richblack-100">Загрузка курсов...</p>
        </div>
      ) : courses && courses.length > 0 ? (
        <CoursesTable courses={courses} setCourses={setCourses} loading={loading} setLoading={setLoading} />
      ) : (
        <div className="flex flex-col justify-center items-center h-48">
          <p className="text-xl text-richblack-100">У вас пока нет курсов</p>
          <p className="mt-2 text-richblack-300">Создайте свой первый курс, нажав на кнопку "Добавить курс"</p>
        </div>
      )}
    </div>
  )
}