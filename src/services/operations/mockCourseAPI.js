import { toast } from "react-hot-toast";
import { v4 as uuidv4 } from 'uuid';
import { setCourse } from "../../slices/courseSlice";

// Имитация хранилища курсов
let mockCourses = [];

// Имитация категорий курсов
const mockCategories = [
  { _id: "cat1", name: "Веб-разработка" },
  { _id: "cat2", name: "Мобильная разработка" },
  { _id: "cat3", name: "Дизайн" },
  { _id: "cat4", name: "Маркетинг" },
  { _id: "cat5", name: "Бизнес" }
];

// Функция для получения курсов из localStorage
const getCoursesFromStorage = () => {
  const storedCourses = localStorage.getItem("mockCourses");
  if (storedCourses) {
    mockCourses = JSON.parse(storedCourses);
  }
  return mockCourses;
};

// Функция для сохранения курсов в localStorage
const saveCoursesToStorage = () => {
  localStorage.setItem("mockCourses", JSON.stringify(mockCourses));
};

// Имитация получения всех курсов
export const getAllCourses = async () => {
  const toastId = toast.loading("Загрузка...");
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const courses = getCoursesFromStorage();
  
  toast.dismiss(toastId);
  return courses;
};

// Имитация получения категорий курсов
export const fetchCourseCategories = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockCategories;
};

// Имитация добавления деталей курса
export const addCourseDetails = async (data, token) => {
  const toastId = toast.loading("Загрузка...");
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  try {
    const courseId = uuidv4();
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    
    if (!user || !user.id) {
      throw new Error("Пользователь не авторизован");
    }
    
    console.log("Создание курса инструктором:", user.id);
    
    // Создаем новый курс
    const newCourse = {
      _id: courseId,
      courseName: data.get("courseName"),
      courseDescription: data.get("courseDescription"),
      price: data.get("price"),
      tag: JSON.parse(data.get("tag") || "[]"),
      thumbnail: data.get("thumbnailImage") ? data.get("thumbnailImage") : "https://api.dicebear.com/7.x/shapes/svg?seed=course",
      whatYouWillLearn: data.get("whatYouWillLearn"),
      category: mockCategories.find(cat => cat._id === data.get("category")) || mockCategories[0],
      status: data.get("status"),
      instructions: JSON.parse(data.get("instructions") || "[]"),
      courseContent: [],
      instructor: {
        ...user,
        _id: user.id // Добавляем _id для совместимости
      },
      createdAt: new Date().toISOString(),
    };
    
    console.log("Создан новый курс:", {
      id: newCourse._id,
      name: newCourse.courseName,
      instructorId: newCourse.instructor.id
    });
    
    // Добавляем курс в хранилище
    mockCourses = [...getCoursesFromStorage(), newCourse];
    saveCoursesToStorage();
    
    toast.success("Детали курса успешно добавлены");
    toast.dismiss(toastId);
    return newCourse;
  } catch (error) {
    console.error("Ошибка при добавлении курса:", error);
    toast.error("Не удалось добавить детали курса: " + error.message);
    toast.dismiss(toastId);
    return null;
  }
};

// Имитация редактирования деталей курса
export const editCourseDetails = async (data, token) => {
  const toastId = toast.loading("Загрузка...");
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  try {
    const courseId = data.get("courseId");
    const courses = getCoursesFromStorage();
    const courseIndex = courses.findIndex(course => course._id === courseId);
    
    if (courseIndex === -1) {
      throw new Error("Курс не найден");
    }
    
    const updatedCourse = { ...courses[courseIndex] };
    
    // Обновляем поля, если они были изменены
    if (data.get("courseName")) updatedCourse.courseName = data.get("courseName");
    if (data.get("courseDescription")) updatedCourse.courseDescription = data.get("courseDescription");
    if (data.get("price")) updatedCourse.price = data.get("price");
    if (data.get("tag")) updatedCourse.tag = JSON.parse(data.get("tag"));
    if (data.get("thumbnailImage")) updatedCourse.thumbnail = data.get("thumbnailImage");
    if (data.get("whatYouWillLearn")) updatedCourse.whatYouWillLearn = data.get("whatYouWillLearn");
    if (data.get("category")) {
      updatedCourse.category = mockCategories.find(cat => cat._id === data.get("category")) || updatedCourse.category;
    }
    if (data.get("instructions")) updatedCourse.instructions = JSON.parse(data.get("instructions"));
    
    // Обновляем курс в хранилище
    courses[courseIndex] = updatedCourse;
    mockCourses = courses;
    saveCoursesToStorage();
    
    toast.success("Детали курса успешно обновлены");
    toast.dismiss(toastId);
    return updatedCourse;
  } catch (error) {
    console.error("Ошибка при редактировании курса:", error);
    toast.error("Не удалось обновить детали курса");
    toast.dismiss(toastId);
    return null;
  }
};

// Имитация создания раздела
export const createSection = async (data, token) => {
  const toastId = toast.loading("Загрузка...");
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  try {
    const { courseId, sectionName } = data;
    const courses = getCoursesFromStorage();
    const courseIndex = courses.findIndex(course => course._id === courseId);
    
    if (courseIndex === -1) {
      throw new Error("Курс не найден");
    }
    
    const newSection = {
      _id: uuidv4(),
      sectionName,
      subSection: []
    };
    
    // Добавляем новый раздел в курс
    courses[courseIndex].courseContent.push(newSection);
    mockCourses = courses;
    saveCoursesToStorage();
    
    toast.success("Раздел курса создан");
    toast.dismiss(toastId);
    return courses[courseIndex];
  } catch (error) {
    console.error("Ошибка при создании раздела:", error);
    toast.error("Не удалось создать раздел");
    toast.dismiss(toastId);
    return null;
  }
};

// Имитация обновления раздела
export const updateSection = async (data, token) => {
  const toastId = toast.loading("Загрузка...");
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  try {
    const { courseId, sectionId, sectionName } = data;
    const courses = getCoursesFromStorage();
    const courseIndex = courses.findIndex(course => course._id === courseId);
    
    if (courseIndex === -1) {
      throw new Error("Курс не найден");
    }
    
    const sectionIndex = courses[courseIndex].courseContent.findIndex(
      section => section._id === sectionId
    );
    
    if (sectionIndex === -1) {
      throw new Error("Раздел не найден");
    }
    
    // Обновляем название раздела
    courses[courseIndex].courseContent[sectionIndex].sectionName = sectionName;
    mockCourses = courses;
    saveCoursesToStorage();
    
    toast.success("Раздел курса обновлен");
    toast.dismiss(toastId);
    return courses[courseIndex];
  } catch (error) {
    console.error("Ошибка при обновлении раздела:", error);
    toast.error("Не удалось обновить раздел");
    toast.dismiss(toastId);
    return null;
  }
};

// Имитация удаления раздела
export const deleteSection = async (data, token) => {
  const toastId = toast.loading("Загрузка...");
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  try {
    const { courseId, sectionId } = data;
    const courses = getCoursesFromStorage();
    const courseIndex = courses.findIndex(course => course._id === courseId);
    
    if (courseIndex === -1) {
      throw new Error("Курс не найден");
    }
    
    // Удаляем раздел из курса
    courses[courseIndex].courseContent = courses[courseIndex].courseContent.filter(
      section => section._id !== sectionId
    );
    
    mockCourses = courses;
    saveCoursesToStorage();
    
    toast.success("Раздел курса удален");
    toast.dismiss(toastId);
    return courses[courseIndex];
  } catch (error) {
    console.error("Ошибка при удалении раздела:", error);
    toast.error("Не удалось удалить раздел");
    toast.dismiss(toastId);
    return null;
  }
};

// Имитация создания подраздела (лекции)
export const createSubSection = async (data, token) => {
  const toastId = toast.loading("Загрузка...");
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  try {
    console.log("Полученные данные для создания лекции:", {
      sectionId: data.get("sectionId"),
      title: data.get("title"),
      description: data.get("description"),
      video: data.get("video") ? 
        (typeof data.get("video") === 'string' ? "Строка URL" : "Файл") : "Не предоставлено"
    });
    
    // Получаем данные из FormData
    const sectionId = data.get("sectionId");
    const title = data.get("title");
    const description = data.get("description");
    const video = data.get("video");
    
    if (!sectionId || !title || !description) {
      throw new Error("Необходимые поля не заполнены");
    }
    
    // Получаем все курсы
    const courses = getCoursesFromStorage();
    console.log("Найдено курсов:", courses.length);
    
    // Находим курс, содержащий указанный раздел
    let targetCourse = null;
    let targetSectionIndex = -1;
    let targetCourseIndex = -1;
    
    // Ищем курс и раздел
    for (let i = 0; i < courses.length; i++) {
      if (!courses[i].courseContent) continue;
      
      const sectionIndex = courses[i].courseContent.findIndex(
        section => section._id === sectionId
      );
      
      if (sectionIndex !== -1) {
        targetCourse = courses[i];
        targetSectionIndex = sectionIndex;
        targetCourseIndex = i;
        break;
      }
    }
    
    console.log("Найден курс и раздел:", {
      courseFound: !!targetCourse,
      sectionIndex: targetSectionIndex,
      courseIndex: targetCourseIndex
    });
    
    if (!targetCourse || targetSectionIndex === -1) {
      throw new Error("Раздел не найден");
    }
    
    // Определяем URL видео
    let videoUrl = "https://example.com/video.mp4"; // Значение по умолчанию
    
    if (video) {
      if (typeof video === 'string') {
        // Если video - это строка, значит это URL
        videoUrl = video;
        console.log("Используется URL видео:", videoUrl);
      } else {
        // Если video - это файл или что-то другое
        try {
          if (video instanceof File) {
            videoUrl = URL.createObjectURL(video);
            console.log("Создан URL для файла видео");
          } else {
            console.log("Неизвестный тип видео:", typeof video);
          }
        } catch (error) {
          console.error("Ошибка при обработке видео:", error);
        }
      }
    } else {
      console.log("Видео не предоставлено, используется заглушка");
    }
    
    // Создаем новую лекцию
    const newSubSection = {
      _id: uuidv4(),
      title,
      description,
      videoUrl: videoUrl
    };
    
    console.log("Создана новая лекция:", newSubSection);
    
    // Проверяем и инициализируем массив лекций, если он не существует
    if (!targetCourse.courseContent[targetSectionIndex].subSection) {
      targetCourse.courseContent[targetSectionIndex].subSection = [];
      console.log("Создан новый массив лекций для раздела");
    }
    
    // Добавляем новую лекцию в раздел
    targetCourse.courseContent[targetSectionIndex].subSection.push(newSubSection);
    console.log("Лекция добавлена в раздел. Всего лекций:", 
      targetCourse.courseContent[targetSectionIndex].subSection.length);
    
    // Обновляем хранилище
    courses[targetCourseIndex] = targetCourse;
    mockCourses = courses;
    saveCoursesToStorage();
    
    console.log("Курс обновлен в хранилище");
    
    toast.success("Лекция добавлена");
    toast.dismiss(toastId);
    
    // Возвращаем обновленный раздел
    return targetCourse.courseContent[targetSectionIndex];
  } catch (error) {
    console.error("Ошибка при создании лекции:", error);
    toast.error("Не удалось добавить лекцию");
    toast.dismiss(toastId);
    return null;
  }
};

// Имитация обновления подраздела (лекции)
export const updateSubSection = async (data, token) => {
  const toastId = toast.loading("Загрузка...");
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  try {
    console.log("Полученные данные для обновления лекции:", {
      sectionId: data.get("sectionId"),
      subSectionId: data.get("subSectionId"),
      title: data.get("title"),
      description: data.get("description"),
      video: data.get("video") ? 
        (typeof data.get("video") === 'string' ? "Строка URL" : "Файл") : "Не предоставлено"
    });
    
    // Получаем данные из FormData
    const sectionId = data.get("sectionId");
    const subSectionId = data.get("subSectionId");
    const title = data.get("title");
    const description = data.get("description");
    const video = data.get("video");
    
    if (!sectionId || !subSectionId) {
      throw new Error("Необходимые идентификаторы не предоставлены");
    }
    
    // Получаем все курсы
    const courses = getCoursesFromStorage();
    console.log("Найдено курсов:", courses.length);
    
    // Находим курс, содержащий указанный раздел
    let targetCourse = null;
    let targetSectionIndex = -1;
    let targetCourseIndex = -1;
    
    // Ищем курс и раздел
    for (let i = 0; i < courses.length; i++) {
      if (!courses[i].courseContent) continue;
      
      const sectionIndex = courses[i].courseContent.findIndex(
        section => section._id === sectionId
      );
      
      if (sectionIndex !== -1) {
        targetCourse = courses[i];
        targetSectionIndex = sectionIndex;
        targetCourseIndex = i;
        break;
      }
    }
    
    console.log("Найден курс и раздел:", {
      courseFound: !!targetCourse,
      sectionIndex: targetSectionIndex,
      courseIndex: targetCourseIndex
    });
    
    if (!targetCourse || targetSectionIndex === -1) {
      throw new Error("Раздел не найден");
    }
    
    // Проверяем наличие массива лекций
    if (!targetCourse.courseContent[targetSectionIndex].subSection) {
      targetCourse.courseContent[targetSectionIndex].subSection = [];
      console.log("Создан новый массив лекций для раздела");
      throw new Error("Лекция не найдена");
    }
    
    // Находим лекцию в разделе
    const subSectionIndex = targetCourse.courseContent[targetSectionIndex].subSection.findIndex(
      subSection => subSection._id === subSectionId
    );
    
    console.log("Поиск лекции:", {
      subSectionId,
      found: subSectionIndex !== -1,
      totalSubSections: targetCourse.courseContent[targetSectionIndex].subSection.length
    });
    
    if (subSectionIndex === -1) {
      throw new Error("Лекция не найдена");
    }
    
    // Определяем URL видео
    let videoUrl;
    if (video) {
      if (typeof video === 'string') {
        // Если video - это строка, значит это URL
        videoUrl = video;
        console.log("Используется URL видео:", videoUrl);
      } else {
        // Если video - это файл или что-то другое
        try {
          if (video instanceof File) {
            videoUrl = URL.createObjectURL(video);
            console.log("Создан URL для файла видео");
          } else {
            console.log("Неизвестный тип видео:", typeof video);
          }
        } catch (error) {
          console.error("Ошибка при обработке видео:", error);
        }
      }
    }
    
    console.log("Обновление данных лекции:", {
      title: title || 'Без изменений',
      description: description || 'Без изменений',
      videoUrl: videoUrl || 'Без изменений'
    });
    
    // Обновляем данные лекции
    if (title) targetCourse.courseContent[targetSectionIndex].subSection[subSectionIndex].title = title;
    if (description) targetCourse.courseContent[targetSectionIndex].subSection[subSectionIndex].description = description;
    if (videoUrl) targetCourse.courseContent[targetSectionIndex].subSection[subSectionIndex].videoUrl = videoUrl;
    
    // Обновляем хранилище
    courses[targetCourseIndex] = targetCourse;
    mockCourses = courses;
    saveCoursesToStorage();
    
    console.log("Курс обновлен в хранилище");
    console.log("Обновленная лекция:", targetCourse.courseContent[targetSectionIndex].subSection[subSectionIndex]);
    
    toast.success("Лекция обновлена");
    toast.dismiss(toastId);
    
    // Возвращаем обновленный раздел
    return targetCourse.courseContent[targetSectionIndex];
  } catch (error) {
    console.error("Ошибка при обновлении лекции:", error);
    toast.error("Не удалось обновить лекцию: " + error.message);
    toast.dismiss(toastId);
    return null;
  }
};

// Имитация удаления подраздела (лекции)
export const deleteSubSection = async (data, token) => {
  const toastId = toast.loading("Загрузка...");
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  try {
    const { courseId, sectionId, subSectionId } = data;
    const courses = getCoursesFromStorage();
    const courseIndex = courses.findIndex(course => course._id === courseId);
    
    if (courseIndex === -1) {
      throw new Error("Курс не найден");
    }
    
    const sectionIndex = courses[courseIndex].courseContent.findIndex(
      section => section._id === sectionId
    );
    
    if (sectionIndex === -1) {
      throw new Error("Раздел не найден");
    }
    
    // Удаляем подраздел из раздела
    courses[courseIndex].courseContent[sectionIndex].subSection = 
      courses[courseIndex].courseContent[sectionIndex].subSection.filter(
        subSection => subSection._id !== subSectionId
      );
    
    mockCourses = courses;
    saveCoursesToStorage();
    
    toast.success("Лекция удалена");
    toast.dismiss(toastId);
    return courses[courseIndex];
  } catch (error) {
    console.error("Ошибка при удалении лекции:", error);
    toast.error("Не удалось удалить лекцию");
    toast.dismiss(toastId);
    return null;
  }
};

// Имитация получения курсов инструктора

// Создадим переменную для отслеживания активных запросов
let activeToastId = null;

export const fetchInstructorCourses = async (token) => {
  // Если уже есть активный toast, используем его, иначе создаем новый
  if (!activeToastId) {
    activeToastId = toast.loading("Загрузка курсов...");
  }
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  try {
    const courses = getCoursesFromStorage();
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    
    console.log("Получение курсов инструктора:", {
      userId: user.id,
      totalCourses: courses.length
    });
    
    // Фильтруем курсы, созданные текущим инструктором
    const instructorCourses = courses.filter(course => {
      // Проверяем наличие инструктора и совпадение id или _id
      return course.instructor && 
        (course.instructor.id === user.id || course.instructor._id === user.id);
    });
    
    console.log("Найдено курсов инструктора:", instructorCourses.length);
    
    // Закрываем уведомление и сбрасываем идентификатор
    if (activeToastId) {
      toast.dismiss(activeToastId);
      activeToastId = null;
    }
    
    return instructorCourses;
  } catch (error) {
    console.error("Ошибка при получении курсов инструктора:", error);
    
    // Закрываем уведомление о загрузке и показываем ошибку
    if (activeToastId) {
      toast.dismiss(activeToastId);
      activeToastId = null;
    }
    toast.error("Не удалось загрузить курсы инструктора");
    
    return [];
  }
};

// Имитация удаления курса
export const deleteCourse = async (data, token) => {
  const toastId = toast.loading("Загрузка...");
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  try {
    const { courseId } = data;
    const courses = getCoursesFromStorage();
    
    // Удаляем курс из хранилища
    mockCourses = courses.filter(course => course._id !== courseId);
    saveCoursesToStorage();
    
    toast.success("Курс удален");
    toast.dismiss(toastId);
    return true;
  } catch (error) {
    console.error("Ошибка при удалении курса:", error);
    toast.error("Не удалось удалить курс");
    toast.dismiss(toastId);
    return false;
  }
};

// Имитация загрузки данных каталога
export const getCatalogPageData = async (categoryId) => {
  await new Promise(resolve => setTimeout(resolve, 500)); // Имитация задержки
  
  try {
    console.log("MOCK: Загрузка данных каталога для категории:", categoryId);
    
    // Получаем все курсы из локального хранилища
    const courses = getCoursesFromStorage();
    
    // Находим категорию по ID
    const category = mockCategories.find(cat => cat._id === categoryId);
    
    if (!category) {
      throw new Error("Категория не найдена");
    }
    
    // Фильтруем курсы по категории
    // В реальном приложении здесь была бы фильтрация по категории
    // Но для простоты мы просто присваиваем категорию всем курсам
    const categorySpecificCourses = courses.map(course => ({
      ...course,
      category: category.name
    }));
    
    // Формируем ответ в формате, ожидаемом компонентом Catalog
    return {
      selectedCategory: category,
      differentCategory: mockCategories.filter(cat => cat._id !== categoryId),
      mostSellingCourses: categorySpecificCourses.slice(0, 4),
      allCourses: categorySpecificCourses,
    };
  } catch (error) {
    console.error("Ошибка при загрузке данных каталога:", error);
    toast.error("Не удалось загрузить данные каталога");
    return {
      selectedCategory: null,
      differentCategory: [],
      mostSellingCourses: [],
      allCourses: [],
    };
  }
};

// Имитация получения полных деталей курса
export const getFullDetailsOfCourse = async (courseId, token) => {
  const toastId = toast.loading("Загрузка деталей курса...");
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  try {
    const courses = getCoursesFromStorage();
    const course = courses.find(course => course._id === courseId);
    
    if (!course) {
      throw new Error("Курс не найден");
    }
    
    console.log("Найден курс для редактирования:", {
      id: course._id,
      name: course.courseName,
      sections: course.courseContent?.length || 0
    });
    
    toast.dismiss(toastId);
    // Возвращаем в формате { courseDetails: course }, который ожидает компонент EditCourse
    return { courseDetails: course };
  } catch (error) {
    console.error("Ошибка при получении деталей курса:", error);
    toast.error("Не удалось загрузить детали курса: " + error.message);
    toast.dismiss(toastId);
    return null;
  }
};
