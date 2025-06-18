import { useEffect, useRef, useState } from "react"
import { useDropzone } from "react-dropzone"
import { FiUploadCloud } from "react-icons/fi"
import { useSelector } from "react-redux"

import "video-react/dist/video-react.css"
import { Player } from "video-react"



export default function Upload({ name, label, register, setValue, errors, video = false, viewData = null, editData = null, }) {
  // const { course } = useSelector((state) => state.course)
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewSource, setPreviewSource] = useState(viewData ? viewData : editData ? editData : "")
  const [videoUrl, setVideoUrl] = useState("")
  const [useVideoUrl, setUseVideoUrl] = useState(false)
  const inputRef = useRef(null)

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0]
    if (file) {
      previewFile(file)
      setSelectedFile(file)
      setUseVideoUrl(false)
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: !video
      ? { "image/*": [".jpeg", ".jpg", ".png"] }
      : { "video/*": [".mp4"] },
    onDrop,
  })

  const previewFile = (file) => {
    // console.log(file)
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = () => {
      setPreviewSource(reader.result)
    }
  }

  const handleVideoUrlChange = (e) => {
    const url = e.target.value
    setVideoUrl(url)
    if (url) {
      setPreviewSource(url)
      setValue(name, url)
    } else {
      setPreviewSource("")
      setValue(name, null)
    }
  }

  const toggleVideoUrlInput = () => {
    setUseVideoUrl(!useVideoUrl)
    if (!useVideoUrl) {
      setSelectedFile(null)
      setPreviewSource("")
    } else {
      setVideoUrl("")
      setValue(name, null)
    }
  }

  useEffect(() => {
    register(name, { required: false })
  }, [register])

  useEffect(() => {
    if (!useVideoUrl) {
      setValue(name, selectedFile)
    }
  }, [selectedFile, setValue, useVideoUrl])

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm text-richblack-5" htmlFor={name}>
        {label} {!viewData && <sup className="text-pink-200">*</sup>}
      </label>

      {/* Переключатель для видео между загрузкой файла и URL */}
      {video && !viewData && (
        <div className="flex items-center space-x-4 mb-3">
          <button
            type="button"
            onClick={() => toggleVideoUrlInput()}
            className={`px-4 py-2 rounded-md ${!useVideoUrl ? 'bg-yellow-50 text-richblack-900' : 'bg-richblack-700 text-richblack-50'}`}
          >
            Загрузить видео
          </button>
          <button
            type="button"
            onClick={() => toggleVideoUrlInput()}
            className={`px-4 py-2 rounded-md ${useVideoUrl ? 'bg-yellow-50 text-richblack-900' : 'bg-richblack-700 text-richblack-50'}`}
          >
            Вставить URL видео
          </button>
        </div>
      )}

      {/* Поле для ввода URL видео */}
      {video && useVideoUrl && !viewData && (
        <div className="flex flex-col space-y-2">
          <input
            type="url"
            value={videoUrl}
            onChange={handleVideoUrlChange}
            placeholder="Вставьте URL видео (например, YouTube, Vimeo)"
            className="form-style w-full"
          />
          <p className="text-xs text-richblack-300">Поддерживаются ссылки с YouTube, Vimeo и других сервисов</p>
        </div>
      )}

      {/* Область для загрузки файла или предпросмотра */}
      {(!video || !useVideoUrl || viewData) && (
        <div
          className={`${isDragActive ? "bg-richblack-600" : "bg-richblack-700"}
           flex min-h-[250px] cursor-pointer items-center justify-center rounded-md border-2 border-dotted border-richblack-500`}
        >
          {previewSource ? (
            <div className="flex w-full flex-col p-6">
              {!video ? (
                <img
                  src={previewSource}
                  alt="Preview"
                  className="h-full w-full rounded-md object-cover"
                />
              ) : (
                <Player aspectRatio="16:9" playsInline src={previewSource} />
              )}

              {!viewData && (
                <button
                  type="button"
                  onClick={() => {
                    setPreviewSource("")
                    setSelectedFile(null)
                    setVideoUrl("")
                    setValue(name, null)
                  }}
                  className="mt-3 text-richblack-400 underline"
                >
                  Отменить
                </button>
              )}
            </div>
          ) : (
            <div
              className="flex w-full flex-col items-center p-6"
              {...getRootProps()}
            >
              <input {...getInputProps()} ref={inputRef} />
              <div className="grid aspect-square w-14 place-items-center rounded-full bg-pure-greys-800">
                <FiUploadCloud className="text-2xl text-yellow-50" />
              </div>
              <p className="mt-2 max-w-[200px] text-center text-sm text-richblack-200">
                Перетащите {!video ? "изображение" : "видео"} или нажмите, чтобы{" "}
                <span className="font-semibold text-yellow-50">Выбрать</span>
                файл
              </p>
              <ul className="mt-10 flex list-disc justify-between space-x-12 text-center text-xs text-richblack-200">
                <li>Соотношение сторон 16:9</li>
                <li>Рекомендуемый размер 1024x576</li>
              </ul>
            </div>
          )}
        </div>
      )}

      {errors[name] && name !== "courseImage" && (
        <span className="ml-2 text-xs tracking-wide text-pink-200">
          {label} обязательно
        </span>
      )}
    </div>
  )
}