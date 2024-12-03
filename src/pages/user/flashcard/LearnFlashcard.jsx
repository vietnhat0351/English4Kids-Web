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
import { Button, Paper } from '@mui/material';

import { FaArrowLeft } from "react-icons/fa";

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
        <div id='learn-flashcard'>
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: '1rem',
            }}>
                <FaArrowLeft style={{
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    justifySelf: 'flex-start',
                    alignSelf: 'flex-start',
                }}
                    onClick={() => {
                        window.history.back();
                    }}
                />
                <h1>{flashcardSet?.name}</h1>
            </div>
            <div className='btn-group'>
                <NavLink to={`/flashcard/${flashcardSetId}/edit`}>
                    <Button variant="contained" color="primary">Sửa bộ flashcard</Button>
                </NavLink>
                <NavLink to={`/flashcard/${flashcardSetId}/card-matching`}>
                    <Button variant="contained" color="primary">Trò chơi với Flashcard</Button>
                </NavLink>
                <NavLink to={`/review-flashcard/${flashcardSetId}`}>
                    <Button variant="contained" color="primary">Luyện Tập</Button>
                </NavLink>
            </div>
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
            <Paper style={{
                minHeight: '200px',
                width: '80%',
                justifySelf: 'center',
                padding: '0.5rem',
                marginTop: '3rem',
            }}>
                {
                    flashcardSet?.description
                }
            </Paper>
        </div>
    )
}

export default LearnFlashcard