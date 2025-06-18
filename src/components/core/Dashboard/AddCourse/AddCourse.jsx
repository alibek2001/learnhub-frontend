import { useEffect } from "react";
import RenderSteps from "./RenderSteps"



export default function AddCourse() {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [])

  return (
    <div className="flex w-full items-start gap-x-6">

      <div className="flex flex-1 flex-col">
        <h1 className="mb-14 text-3xl font-medium text-richblack-5 font-boogaloo text-center lg:text-left">
          Добавить курс
        </h1>

        <div className="flex-1">
          <RenderSteps />
        </div>
      </div>

      {/* Course Upload Tips */}
      <div className="sticky top-10 hidden lg:block max-w-[400px] flex-1 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6 ">
        <p className="mb-8 text-lg text-richblack-5">⚡ Советы по загрузке курса</p>

        <ul className="ml-5 list-item list-disc space-y-4 text-xs text-richblack-5">
          <li>Установите цену курса или сделайте его бесплатным.</li>
          <li>Стандартный размер миниатюры курса - 1024x576.</li>
          <li>Раздел видео управляет обзорным видео курса.</li>
          <li>Конструктор курса - это место, где вы создаете и организуете курс.</li>
          <li>Добавьте темы в разделе конструктора курса для создания уроков, тестов и заданий.</li>
          <li>Информация из раздела дополнительных данных отображается на странице курса.</li>
          <li>Создавайте объявления для уведомления о важных событиях.</li>
          <li>Отправляйте заметки всем зарегистрированным студентам одновременно.</li>
        </ul>
      </div>
    </div>
  )
}