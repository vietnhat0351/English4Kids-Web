import React, { useEffect, useState } from 'react'
import { Navigate, NavLink, useNavigate, useParams } from 'react-router-dom';
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
import LearnFlashCardList from './tool/LearnFlashCardList';

const LearnFlashcard = () => {

    const { flashcardSetId } = useParams();

    const [flashcardSet, setFlashcardSet] = useState(null);

    const navigate = useNavigate();

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
            <div className='header'>
                <FaArrowLeft className='return-btn'
                    onClick={() => {
                        // navigate /flashcard
                        navigate('/flashcard');
                    }}
                />
                <h1 style={{
                    width: '100%',
                    textAlign: 'center',
                    fontSize: '2rem',
                }}>{flashcardSet?.name}</h1>
                <div className='btn-group'>
                    <NavLink to={`/flashcard/${flashcardSetId}/edit`}>
                        <Button variant="contained" color="primary" sx={{
                            width: '100%',
                        }}>Edit</Button>
                    </NavLink>
                    <NavLink to={`/flashcard/${flashcardSetId}/card-matching`}>
                        <Button variant="contained" color="primary">Card Matching</Button>
                    </NavLink>
                    <NavLink to={`/review-flashcard/${flashcardSetId}`}>
                        <Button variant="contained" color="primary" sx={{
                            width: '100%',
                        }}>Review</Button>
                    </NavLink>
                </div>
            </div>
            <div style={{
                maxHeight: '650px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <LearnFlashCardList vocabulary={flashcardSet?.flashcards} />
            </div>
            {/* <div className="flashcard-container">
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
                        height: '650px',
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

            </div> */}
            <Paper className='description'>
                {
                    'Description: ' + flashcardSet?.description
                }
            </Paper>
        </div>
    )
}

export default LearnFlashcard