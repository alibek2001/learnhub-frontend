import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams, useLocation } from "react-router-dom"

// Импортируем функцию из mockCourseAPI вместо courseDetailsAPI
import { getFullDetailsOfCourse } from "../../../../services/operations/mockCourseAPI"
import { setCourse, setEditCourse, setStep } from "../../../../slices/courseSlice"
import RenderSteps from "../AddCourse/RenderSteps"
import Loading from './../../../common/Loading';




export default function EditCourse() {
  const dispatch = useDispatch()
  const { courseId } = useParams()
  const location = useLocation()
  const { token } = useSelector((state) => state.auth)
  const { course } = useSelector((state) => state.course)
  
  const [loading, setLoading] = useState(false)


  useEffect(() => {
    const fetchFullCourseDetails = async () => {
      setLoading(true)
      const result = await getFullDetailsOfCourse(courseId, token);
      console.log('Данные курса для редактирования:', result)
      
      if (result?.courseDetails) {
        dispatch(setEditCourse(true))
        dispatch(setCourse(result?.courseDetails))
        
        // Получаем параметр step из URL и устанавливаем соответствующий шаг
        const urlParams = new URLSearchParams(location.search)
        const stepParam = urlParams.get('step')
        
        if (stepParam) {
          const stepNumber = parseInt(stepParam)
          if (!isNaN(stepNumber) && stepNumber >= 1 && stepNumber <= 3) {
            dispatch(setStep(stepNumber))
            console.log('Автоматический переход к шагу:', stepNumber)
          }
        }
      }
      setLoading(false)
    }

    fetchFullCourseDetails();
  }, [courseId, token, location.search, dispatch])

  // Loading
  if (loading) {
    return <Loading />
  }

  return (
    <div className="flex w-full items-start gap-x-6">

      <div className="flex flex-1 flex-col">
        <h1 className="mb-14 text-3xl font-medium text-richblack-5 text-center sm:text-left">
          Редактирование курса
        </h1>

        {loading ? <Loading />
          :
          (<div className="flex-1">
            {course ? <RenderSteps />
              :
              (<p className="mt-14 text-center text-3xl font-semibold text-richblack-100">
                Курс не найден
              </p>)
            }
          </div>)}
      </div>

      {/* Course Upload Tips  */}
      {/* <div className="sticky top-10 hidden lg:block max-w-[400px] flex-1 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6 ">
        <p className="mb-8 text-lg text-richblack-5">⚡ Course Upload Tips</p>

        <ul className="ml-5 list-item list-disc space-y-4 text-xs text-richblack-5">
          <li>Set the Course Price option or make it free.</li>
          <li>Standard size for the course thumbnail is 1024x576.</li>
          <li>Video section controls the course overview video.</li>
          <li>Course Builder is where you create & organize a course.</li>
          <li>Add Topics in the Course Builder section to create lessons,quizzes, and assignments.</li>
          <li>Information from the Additional Data section shows up on thecourse single page.</li>
          <li>Make Announcements to notify any important</li>
          <li>Notes to all enrolled students at once.</li>
        </ul>
      </div> */}

    </div>
  )
}