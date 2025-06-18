import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { RxCross2 } from "react-icons/rx"
import { useDispatch, useSelector } from "react-redux"

import {
  createSubSection,
  updateSubSection,
} from "../../../../../services/operations/mockCourseAPI"
import { setCourse } from "../../../../../slices/courseSlice"
import IconBtn from "../../../../common/IconBtn"
import Upload from "../Upload"



export default function SubSectionModal({ modalData, setModalData, add = false, view = false, edit = false, }) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    getValues,
  } = useForm()

  // console.log("view", view)
  // console.log("edit", edit)
  // console.log("add", add)

  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const { token } = useSelector((state) => state.auth)
  const { course } = useSelector((state) => state.course)

  useEffect(() => {
    if (view || edit) {
      // console.log("modalData", modalData)
      setValue("lectureTitle", modalData.title)
      setValue("lectureDesc", modalData.description)
      setValue("lectureVideo", modalData.videoUrl)
    }
  }, [])

  // detect whether form is updated or not
  const isFormUpdated = () => {
    const currentValues = getValues()
    // console.log("changes after editing form values:", currentValues)
    if (
      currentValues.lectureTitle !== modalData.title ||
      currentValues.lectureDesc !== modalData.description ||
      currentValues.lectureVideo !== modalData.videoUrl
    ) {
      return true
    }
    return false
  }

  // handle the editing of subsection
  const handleEditSubsection = async () => {
    try {
      const currentValues = getValues()
      console.log("Значения после редактирования:", currentValues)
      
      const formData = new FormData()
      formData.append("sectionId", modalData.sectionId)
      formData.append("subSectionId", modalData._id)
      
      if (currentValues.lectureTitle !== modalData.title) {
        formData.append("title", currentValues.lectureTitle)
      }
      
      if (currentValues.lectureDesc !== modalData.description) {
        formData.append("description", currentValues.lectureDesc)
      }
      
      if (currentValues.lectureVideo !== modalData.videoUrl) {
        formData.append("video", currentValues.lectureVideo)
      }
      
      console.log("Отправка данных для редактирования:", {
        sectionId: modalData.sectionId,
        subSectionId: modalData._id,
        title: currentValues.lectureTitle !== modalData.title ? currentValues.lectureTitle : 'Без изменений',
        description: currentValues.lectureDesc !== modalData.description ? currentValues.lectureDesc : 'Без изменений',
        video: currentValues.lectureVideo !== modalData.videoUrl ? 
          (typeof currentValues.lectureVideo === 'string' ? 'URL строка' : 'Файл или null') : 'Без изменений'
      })
      
      setLoading(true)
      const result = await updateSubSection(formData, token)
      console.log("Результат обновления лекции:", result)
      
      if (result) {
        // update the structure of course
        const updatedCourseContent = course.courseContent.map((section) =>
          section._id === modalData.sectionId ? result : section
        )
        const updatedCourse = { ...course, courseContent: updatedCourseContent }
        dispatch(setCourse(updatedCourse))
        toast.success("Лекция успешно обновлена")
      }
      setModalData(null)
    } catch (error) {
      console.error("Ошибка при редактировании лекции:", error)
      toast.error("Не удалось обновить лекцию")
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data) => {
    console.log("Данные формы:", data)
    if (view) return

    if (edit) {
      if (!isFormUpdated()) {
        toast.error("Изменения в форме не внесены")
      } else {
        handleEditSubsection()
      }
      return
    }

    try {
      const formData = new FormData()
      formData.append("sectionId", modalData)
      formData.append("title", data.lectureTitle)
      formData.append("description", data.lectureDesc)
      
      // Проверяем, является ли video строкой (URL) или файлом
      if (data.lectureVideo) {
        formData.append("video", data.lectureVideo)
      }
      
      console.log("Отправка данных:", {
        sectionId: modalData,
        title: data.lectureTitle,
        description: data.lectureDesc,
        video: typeof data.lectureVideo === 'string' ? 'URL строка' : 'Файл или null'
      })
      
      setLoading(true)
      const result = await createSubSection(formData, token)
      console.log("Результат создания лекции:", result)
      
      if (result) {
        // update the structure of course
        const updatedCourseContent = course.courseContent.map((section) =>
          section._id === modalData ? result : section
        )
        const updatedCourse = { ...course, courseContent: updatedCourseContent }
        dispatch(setCourse(updatedCourse))
        toast.success("Лекция успешно добавлена")
      }
      setModalData(null)
    } catch (error) {
      console.error("Ошибка при добавлении лекции:", error)
      toast.error("Не удалось добавить лекцию")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[1000] !mt-0 grid h-screen w-screen place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm">
      <div className="my-10 w-11/12 max-w-[700px] rounded-lg border border-richblack-400 bg-richblack-800">
        {/* Modal Header */}
        <div className="flex items-center justify-between rounded-t-lg bg-richblack-700 p-5">
          <p className="text-xl font-semibold text-richblack-5">
            {view && "Просмотр"} {add && "Добавление"} {edit && "Редактирование"} лекции
          </p>
          <button onClick={() => (!loading ? setModalData(null) : {})}>
            <RxCross2 className="text-2xl text-richblack-5" />
          </button>
        </div>
        {/* Modal Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-8 px-8 py-10"
        >
          {/* Lecture Video Upload */}
          <Upload
            name="lectureVideo"
            label="Видео лекции"
            register={register}
            setValue={setValue}
            errors={errors}
            video={true}
            viewData={view ? modalData.videoUrl : null}
            editData={edit ? modalData.videoUrl : null}
          />
          {/* Lecture Title */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="lectureTitle">
              Название лекции {!view && <sup className="text-pink-200">*</sup>}
            </label>
            <input
              disabled={view || loading}
              id="lectureTitle"
              placeholder="Введите название лекции"
              {...register("lectureTitle", { required: true })}
              className="form-style w-full"
            />
            {errors.lectureTitle && (
              <span className="ml-2 text-xs tracking-wide text-pink-200">
                Название лекции обязательно
              </span>
            )}
          </div>
          
          {/* Lecture Description */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="lectureDesc">
              Описание лекции{" "}
              {!view && <sup className="text-pink-200">*</sup>}
            </label>
            <textarea
              disabled={view || loading}
              id="lectureDesc"
              placeholder="Введите описание лекции"
              {...register("lectureDesc", { required: true })}
              className="form-style resize-x-none min-h-[130px] w-full"
            />
            {errors.lectureDesc && (
              <span className="ml-2 text-xs tracking-wide text-pink-200">
                Описание лекции обязательно
              </span>
            )}
          </div>
          {!view && (
            <div className="flex justify-end">
              <IconBtn
                disabled={loading}
                text={loading ? "Загрузка.." : edit ? "Сохранить изменения" : "Сохранить"}
              />
            </div>
          )}
        </form>
      </div>
    </div>
  )
}