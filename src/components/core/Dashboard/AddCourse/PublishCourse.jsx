import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { COURSE_STATUS } from "../../../../utils/constants"
import { resetCourseState, setStep } from "../../../../slices/courseSlice"
import IconBtn from "../../../common/IconBtn"
import { toast } from "react-hot-toast"

export default function PublishCourse() {
  const { register, handleSubmit, setValue, getValues } = useForm()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { course } = useSelector((state) => state.course)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (course?.status === COURSE_STATUS.PUBLISHED) {
      setValue("public", true)
    }
  }, [])

  const goBack = () => {
    dispatch(setStep(2))
  }

  const goToCourses = () => {
    dispatch(resetCourseState())
    navigate("/dashboard/my-courses")
  }

  const handleCoursePublish = async (data) => {
    // Здесь будет имитация публикации курса
    setLoading(true)
    
    // Имитация задержки сети
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Имитация успешной публикации
    toast.success(
      data.public 
        ? "Курс успешно опубликован" 
        : "Курс сохранен как черновик"
    )
    
    setLoading(false)
    goToCourses()
  }

  return (
    <div className="rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
      <p className="text-2xl font-semibold text-richblack-5">
        Публикация курса
      </p>
      <form onSubmit={handleSubmit(handleCoursePublish)}>
        <div className="my-6 mb-8">
          <label htmlFor="public" className="inline-flex items-center text-lg">
            <input
              type="checkbox"
              id="public"
              {...register("public")}
              className="border-gray-300 h-4 w-4 rounded bg-richblack-500 text-richblack-400 focus:ring-2 focus:ring-richblack-5"
            />
            <span className="ml-2 text-richblack-400">
              Сделать этот курс доступным для всех
            </span>
          </label>
        </div>

        <div className="ml-auto flex max-w-max items-center gap-x-4">
          <button
            disabled={loading}
            type="button"
            onClick={goBack}
            className="flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900"
          >
            Назад
          </button>
          <IconBtn disabled={loading} text="Сохранить изменения" />
        </div>
      </form>
    </div>
  )
}
