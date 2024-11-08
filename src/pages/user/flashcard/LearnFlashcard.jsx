import React, { useEffect, useState } from 'react'
import { NavLink, useParams } from 'react-router-dom';
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
import { Button } from '@mui/material';

const LearnFlashcard = () => {

    const { flashcardSetId } = useParams();

    const [flashcardSet, setFlashcardSet] = useState(null);

    useEffect(() => {
        customFetch.get(`/api/v1/flashcards/get-flashcard-set/${flashcardSetId}`)
            .then(response => {
                setFlashcardSet(response.data);
                console.log(response.data);
            })
            .catch(error => {
                console.error(error);
            })
    }, [flashcardSetId])

    return (
        <div>
            <h1>{flashcardSet?.name}</h1>
            <NavLink to={`/flashcard/${flashcardSetId}/edit`}>
                <Button variant="contained" color="primary">Sửa bộ flashcard</Button>
            </NavLink>
            <NavLink to={`/flashcard/${flashcardSetId}/card-matching`}>
                <Button variant="contained" color="primary">Trò chơi với Flashcard</Button>
            </NavLink>
            <div className="flashcard-container">
                <Swiper
                    
                    modules={[Navigation, Pagination, Scrollbar, A11y, Keyboard]}
                    spaceBetween={50}
                    slidesPerView={1}
                    navigation={true}
                    pagination={{
                        type: 'fraction',
                    }}
                    scrollbar={{ draggable: true }}
                    // onSwiper={(swiper) => console.log(swiper)}
                    // onSlideChange={() => console.log('slide change')}
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