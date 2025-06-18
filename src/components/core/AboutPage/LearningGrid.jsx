import React from 'react'
import HighlightText from '../../../components/core/HomePage/HighlightText'
import CTAButton from '../../../components/core/HomePage/Button'

const LearningGridArray = [
    {
        order: -1,
        heading: 'Обучение мирового класса для',
        highlightText: 'каждого, везде',
        description:
            'Studynotion сотрудничает с более чем 275+ ведущими университетами и компаниями, чтобы предоставить гибкое, доступное, актуальное для работы онлайн-обучение людям и организациям по всему миру.',
        BtnText: 'Узнать больше',
        BtnLink: '/',
    },
    {
        order: 1,
        heading: 'Учебная программа на основе потребностей индустрии',
        description:
            'Экономьте время и деньги! Учебная программа Belajar создана для более легкого понимания и соответствует потребностям индустрии.',
    },
    {
        order: 2,
        heading: 'Наши методы обучения',
        description: 'Studynotion сотрудничает с более чем 275+ ведущими университетами и компаниями',
    },
    {
        order: 3,
        heading: 'Сертификация',
        description: 'Studynotion сотрудничает с более чем 275+ ведущими университетами и компаниями',
    },
    {
        order: 4,
        heading: `Оценка "Авто-проверка"`,
        description: 'Studynotion сотрудничает с более чем 275+ ведущими университетами и компаниями',
    },
    {
        order: 5,
        heading: 'Готовность к работе',
        description: 'Studynotion сотрудничает с более чем 275+ ведущими университетами и компаниями',
    },
]

const LearningGrid = () => {
    return (
        <div className='grid mx-auto w-[350px] lg:w-fit grid-cols-1 lg:grid-cols-4 mb-12'>
            {LearningGridArray.map((card, i) => {
                return (
                    <div
                        key={i}
                        className={`${i === 0 && 'lg:col-span-2 lg:h-[294px]'}  ${
                            card.order % 2 === 1
                                ? 'bg-richblack-700 h-[294px]'
                                : card.order % 2 === 0
                                ? 'bg-richblack-800 h-[294px]'
                                : 'bg-transparent'
                        } ${card.order === 3 && 'lg:col-start-2'}  `}
                    >
                        {card.order < 0 ? (
                            <div className='lg:w-[90%] flex flex-col gap-3 pb-10 lg:pb-0'>
                                <div className='text-4xl font-semibold '>
                                    {card.heading}
                                    <HighlightText text={card.highlightText} />
                                </div>
                                <p className='text-richblack-300 font-medium'>{card.description}</p>

                                <div className='w-fit mt-2'>
                                    <CTAButton active={true} linkto={card.BtnLink}>
                                        {card.BtnText}
                                    </CTAButton>
                                </div>
                            </div>
                        ) : (
                            <div className='p-8 flex flex-col gap-8'>
                                <h1 className='text-richblack-5 text-lg'>{card.heading}</h1>

                                <p className='text-richblack-300 font-medium'>{card.description}</p>
                            </div>
                        )}
                    </div>
                )
            })}
        </div>
    )
}

export default LearningGrid
