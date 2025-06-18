import React from 'react'
import HighlightText from '../HomePage/HighlightText'

const Quote = () => {
    return (
        <div className=' text-xl md:text-4xl font-semibold mx-auto py-5 pb-20 text-center text-white'>
            Мы стремимся революционизировать способ обучения. Наша инновационная платформа{' '}
            <HighlightText text={'объединяет технологии'} />,{' '}
            <span className='bg-gradient-to-b from-[#FF512F] to-[#F09819] text-transparent bg-clip-text font-bold'>
                {' '}
                экспертизу
            </span>
            , и сообщество для создания
            <span className='bg-gradient-to-b from-[#E65C00] to-[#F9D423] text-transparent bg-clip-text font-bold'>
                {' '}
                непревзойденного образовательного опыта.
            </span>
        </div>
    )
}

export default Quote
