import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast"

import { apiConnector } from "../../../services/apiConnector"
import { courseEndpoints } from "../../../services/apis"
import Img from '../../common/Img';

export default function AllCourses() {
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()

  const [courses, setCourses] = useState(null)

  // Получение всех курсов
  const getAllCourses = async () => {
    try {
      const response = await apiConnector("GET", courseEndpoints.GET_ALL_COURSE_API)
      if (response.data.success) {
        setCourses(response.data.data)
      }
    } catch (error) {
      console.log("Не удалось получить список курсов.", error)
      toast.error("Не удалось загрузить курсы")
    }
  }

  useEffect(() => {
    getAllCourses()
  }, [])

  // Скелетон загрузки
  const sklItem = () => {
    return (
      <div className="flex border border-richblack-700 px-5 py-3 w-full">
        <div className="flex flex-1 gap-x-4 ">
          <div className='h-14 w-14 rounded-lg skeleton '></div>

          <div className="flex flex-col w-[40%] ">
            <p className="h-2 w-[50%] rounded-xl skeleton"></p>
            <p className="h-2 w-[70%] rounded-xl mt-3 skeleton"></p>
          </div>
        </div>

        <div className="flex flex-[0.4] flex-col ">
          <p className="h-2 w-[20%] rounded-xl skeleton mt-2"></p>
          <p className="h-2 w-[40%] rounded-xl skeleton mt-3"></p>
        </div>
      </div>
    )
  }

  // Если нет курсов
  if (courses?.length === 0) {
    return (
      <p className="grid h-[50vh] w-full place-content-center text-center text-richblack-5 text-3xl">
        Пока нет доступных курсов.
      </p>)
  }

  return (
    <>
      <div className="text-4xl text-richblack-5 font-boogaloo text-center sm:text-left">Все курсы</div>
      {
        <div className="my-8 text-richblack-5">
          {/* Заголовки */}
          <div className="flex rounded-t-2xl bg-richblack-800 ">
            <p className="w-[45%] px-5 py-3">Название курса</p>
            <p className="w-1/4 px-2 py-3">Инструктор</p>
            <p className="flex-1 px-2 py-3">Категория</p>
          </div>

          {/* Скелетон загрузки */}
          {!courses && <div >
            {sklItem()}
            {sklItem()}
            {sklItem()}
            {sklItem()}
            {sklItem()}
          </div>}

          {/* Список курсов */}
          {
            courses?.map((course, i, arr) => (
              <div
                className={`flex flex-col sm:flex-row sm:items-center border border-richblack-700 ${i === arr.length - 1 ? "rounded-b-2xl" : "rounded-none"}`}
                key={i}
              >
                <div
                  className="flex sm:w-[45%] cursor-pointer items-center gap-4 px-5 py-3"
                  onClick={() => {
                    navigate(`/courses/${course._id}`)
                  }}
                >
                  <Img
                    src={course.thumbnail}
                    alt="course_img"
                    className="h-14 w-14 rounded-lg object-cover"
                  />

                  <div className="flex max-w-xs flex-col gap-2">
                    <p className="font-semibold">{course.courseName}</p>
                    <p className="text-xs text-richblack-300">
                      {course.courseDescription.length > 50
                        ? `${course.courseDescription.slice(0, 50)}...`
                        : course.courseDescription}
                    </p>
                  </div>
                </div>

                {/* Только для мобильных устройств */}
                <div className='sm:hidden'>
                  <div className="px-2 py-3">{course.instructor.firstName} {course.instructor.lastName}</div>
                  <div className="px-2 py-3">{course.category.name}</div>
                </div>

                {/* Только для больших экранов */}
                <div className="hidden w-1/4 sm:flex px-2 py-3">
                  {course.instructor.firstName} {course.instructor.lastName}
                </div>
                <div className="hidden sm:flex flex-1 px-2 py-3">
                  {course.category.name}
                </div>
              </div>
            ))
          }
        </div>
      }
    </>
  )
}
