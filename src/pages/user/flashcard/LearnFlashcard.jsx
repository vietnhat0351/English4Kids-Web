import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import customFetch from '../../../utils/customFetch';
import Flashcard from '../../../components/Flashcard';
import { Swiper, SwiperSlide } from 'swiper/react';

// import Swiper core and required modules
import { Navigation, Pagination, Scrollbar, A11y, Keyboard } from 'swiper/modules';

import './LearnFlashcard.css';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/keyboard';

const LearnFlashcard = () => {

    const { flashcardSetId } = useParams();

    const [flashcardSet, setFlashcardSet] = useState(null);

    useEffect(() => {
        console.log(flashcardSetId);
        customFetch.get(`/api/v1/flashcards/get-flashcard-set/${flashcardSetId}`)
            .then(response => {
                console.log(response.data);
                setFlashcardSet(response.data);
            })
            .catch(error => {
                console.error(error);
            })
    }, [])

    return (
        <div>
            {/* {flashcardSet?.flashcards.map(flashcard => (
                <Flashcard flashcard={flashcard} key={flashcard.id} />
            ))} */}
            <div className="flashcard-container">
                <Swiper
                    // spaceBetween={50}
                    // slidesPerView={1}
                    // navigation
                    // pagination={{
                    //     type: 'fraction', // Hiển thị bộ đếm dạng x/y (6/10)
                    // }}
                    // className="flashcard-swiper"
                    modules={[Navigation, Pagination, Scrollbar, A11y, Keyboard]}
                    spaceBetween={50}
                    slidesPerView={1}
                    navigation={true}
                    pagination={{
                        type: 'fraction',
                    }}
                    scrollbar={{ draggable: true }}
                    onSwiper={(swiper) => console.log(swiper)}
                    onSlideChange={() => console.log('slide change')}
                    keyboard={{
                        enabled: true,
                    }}
                    style={{
                        display: 'flex',
                        width: '100%',
                        height: '500px',
                    }}
                >
                    {flashcardSet?.flashcards.map((flashcard, index) => (
                        <SwiperSlide key={index} style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: '10px',
                           height: '90%',
                        }}>
                            <div style={{
                                margin: '1rem',
                                display: 'flex',
                            }}>
                                <Flashcard flashcard={flashcard} key={flashcard.id} />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    )
}

export default LearnFlashcard